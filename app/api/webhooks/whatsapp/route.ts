import { NextRequest, NextResponse } from 'next/server'

// Receiver de eventos da Evolution API.
// Configurar via: scripts/setup-evolution.sh
// Eventos recebidos: connection.update, qrcode.updated, messages.upsert

export async function POST(req: NextRequest) {
  try {
    const event = await req.json()
    const { event: eventName, instance, data } = event ?? {}

    switch (eventName) {
      case 'connection.update':
        console.log(`[whatsapp] ${instance} — status: ${data?.state}`)
        break

      case 'qrcode.updated':
        console.log(`[whatsapp] ${instance} — QR code atualizado`)
        break

      case 'messages.upsert': {
        const messages: Array<{ key?: { fromMe?: boolean; remoteJid?: string }; message?: unknown }> =
          data?.messages ?? []
        for (const msg of messages) {
          if (msg.key?.fromMe) continue
          console.log(`[whatsapp] ${instance} — mensagem recebida de ${msg.key?.remoteJid}`)
          // TODO: encaminhar para n8n quando N8N_WEBHOOK_URL configurado
        }
        break
      }

      default:
        // Evento não tratado — log silencioso
        break
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[whatsapp-webhook] erro ao processar evento:', err)
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }
}
