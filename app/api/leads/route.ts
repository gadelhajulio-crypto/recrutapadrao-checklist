import { NextRequest, NextResponse } from 'next/server'
import { saveLead } from '@/lib/supabase'
import { sendTextMessage, sendDocumentMessage, normalizeBrPhone } from '@/lib/evolution'

const PDF_URL = process.env.CHECKLIST_PDF_URL ?? ''
const N8N_WEBHOOK = process.env.N8N_WEBHOOK_URL ?? ''

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      nome, whatsapp, forca_interesse, etapa_atual,
      cidade, estado, origem,
      utm_source, utm_medium, utm_campaign, user_agent,
    } = body

    if (!nome?.trim() || !whatsapp?.trim()) {
      return NextResponse.json(
        { error: 'nome e whatsapp são obrigatórios' },
        { status: 400 },
      )
    }

    const digits = String(whatsapp).replace(/\D/g, '')
    if (digits.length < 10 || digits.length > 11) {
      return NextResponse.json({ error: 'whatsapp inválido' }, { status: 400 })
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      null

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
    }

    // 1. Persistir no Supabase — falha silenciosa para não bloquear o usuário
    try {
      await saveLead(lead)
    } catch (err) {
      console.error('[leads] supabase:', err)
    }

    // 2. Enviar WhatsApp via Evolution API
    const phone = normalizeBrPhone(digits)
    const firstName = lead.nome.split(' ')[0]
    try {
      await sendTextMessage(
        phone,
        `Olá, ${firstName}! Aqui é o Quartel Digital.\n\nSeu Checklist do Internato está chegando agora. 👇`,
      )
      if (PDF_URL) {
        await sendDocumentMessage(
          phone,
          PDF_URL,
          'Checklist-Internato-Quartel-Digital.pdf',
          'Checklist do Internato — Marinha do Brasil',
        )
      }
    } catch (err) {
      console.error('[leads] evolution api:', err)
    }

    // 3. Disparar webhook n8n (fire-and-forget, não bloqueia resposta)
    if (N8N_WEBHOOK) {
      fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      }).catch((err) => console.error('[leads] n8n webhook:', err))
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[leads] erro inesperado:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
