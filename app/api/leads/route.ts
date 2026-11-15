import { NextRequest, NextResponse } from 'next/server'
import { saveLead } from '@/lib/supabase'
import { sendTextMessage, normalizeBrPhone } from '@/lib/evolution'
// sendDocumentMessage mantido em lib/evolution.ts como fallback documentado

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? ''
const N8N_WEBHOOK = process.env.N8N_WEBHOOK_URL ?? ''
const FIRST_PARTY_EVENTS_URL = process.env.FIRST_PARTY_EVENTS_URL ?? ''

const WHATSAPP_OPT_IN_TEXT =
  'Autorizo o Recruta Padrão a enviar pelo WhatsApp informado neste cadastro o acesso ao checklist, materiais gratuitos, orientações e avisos relacionados à preparação para o serviço militar.'

interface ApiResponse {
  ok: boolean
  leadSaved: boolean
  welcomeSent: boolean
  checklistLinkSent: boolean
  checklistAccessUrl?: string
  error?: string
  details?: unknown
}

export async function POST(req: NextRequest) {
  console.log('[FUNIL] formulario recebido')

  const resp: ApiResponse = {
    ok: false,
    leadSaved: false,
    welcomeSent: false,
    checklistLinkSent: false,
  }

  try {
    const body = await req.json()

    const {
      nome, whatsapp, forca_interesse, etapa_atual,
      cidade, estado, origem,
      utm_source, utm_medium, utm_campaign, user_agent,
      whatsapp_opt_in,
    } = body

    if (!nome?.trim() || !whatsapp?.trim()) {
      return NextResponse.json(
        { ...resp, error: 'nome e whatsapp são obrigatórios' },
        { status: 400 },
      )
    }

    const digits = String(whatsapp).replace(/\D/g, '')

    if (digits.length < 10 || digits.length > 11) {
      return NextResponse.json({ ...resp, error: 'whatsapp inválido' }, { status: 400 })
    }

    if (!whatsapp_opt_in) {
      return NextResponse.json(
        { ...resp, error: 'WHATSAPP_OPT_IN_REQUIRED' },
        { status: 400 },
      )
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      null

    const checklistToken = crypto.randomUUID()

    const checklistAccessUrl = `${SITE_URL}/checklist/acesso?token=${checklistToken}`
    const lead = {
      nome: String(nome).trim(),
      whatsapp: digits,
      forca: forca_interesse || null,
      etapa_atual: etapa_atual || null,
      cidade: cidade || null,
      estado: estado || null,
      origem: origem || null,
      ip,
      user_agent: user_agent || null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      checklist_token: checklistToken,
      whatsapp_opt_in: true,
      whatsapp_opt_in_at: new Date().toISOString(),
      whatsapp_opt_in_text: WHATSAPP_OPT_IN_TEXT,
      whatsapp_opt_in_source: 'landing_page_checklist',
    }

    try {
      const persisted = await saveLead(lead)
      resp.leadSaved = true
      resp.checklistAccessUrl = checklistAccessUrl

      if (FIRST_PARTY_EVENTS_URL) {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)
        try {
          const eventResponse = await fetch(FIRST_PARTY_EVENTS_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-analytics-ingest-secret': process.env.FIRST_PARTY_EVENTS_SECRET ?? '',
            },
            body: JSON.stringify({
              event_id: persisted.id,
              event_name: 'lead_created',
              occurred_at: persisted.created_at,
              source: 'recrutapadrao-checklist',
              environment: process.env.NODE_ENV === 'production' ? 'production' : 'homologacao',
              schema_version: 1,
              properties: {},
            }),
            signal: controller.signal,
          })
          if (![200, 201].includes(eventResponse.status)) {
            console.warn('[FUNIL] first-party event rejected', eventResponse.status)
          }
        } catch (eventError) {
          console.warn('[FUNIL] first-party event delivery failed')
        } finally {
          clearTimeout(timeout)
        }
      }
    } catch (err) {
      console.error('[FUNIL] lead persistence failed')
      return NextResponse.json({ ...resp, error: 'LEAD_PERSISTENCE_FAILED' }, { status: 503 })
    }

    const phone = normalizeBrPhone(digits)
    const firstName = lead.nome.split(' ')[0]

    // ── Envio 1: boas-vindas ───────────────────────────────────────────────
    try {
      const resTexto = await sendTextMessage(
        phone,
        `Olá, ${firstName}! Aqui é o Quartel Digital.\n\nSeu Checklist do Internato está chegando agora. 👇`,
      )
      resp.welcomeSent = true
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status
      console.error('[FUNIL] erro envio WhatsApp status:', status ?? 'N/A')
      return NextResponse.json({
        ...resp,
        error: 'WHATSAPP_SEND_FAILED',
        details: { step: 'welcome' },
      })
    }

    // ── Envio 2: link do checklist ─────────────────────────────────────────
    try {
      const resLink = await sendTextMessage(
        phone,
        `Seu Checklist do Internato está pronto. ✅\n\nToque no link abaixo para abrir no navegador:\n\n${checklistAccessUrl}\n\nDentro do checklist há um botão para enviar o link oficial a um amigo que também vai servir.`,
      )
      resp.checklistLinkSent = true
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status
      console.error('[FUNIL] erro envio WhatsApp status:', status ?? 'N/A')
      return NextResponse.json({
        ...resp,
        error: 'WHATSAPP_SEND_FAILED',
        details: { step: 'checklist_link' },
      })
    }

    if (N8N_WEBHOOK) {
      void fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      }).catch(() => {
        console.error('[leads] n8n webhook failed')
      })
    }

    resp.ok = true
    console.log('[FUNIL] retornando ok true')
    return NextResponse.json(resp)
  } catch (err) {
    console.error('[leads] erro inesperado')
    return NextResponse.json({ ...resp, error: 'Erro interno' }, { status: 500 })
  }
}