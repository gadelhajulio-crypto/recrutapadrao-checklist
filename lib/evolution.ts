// lib/evolution.ts — Evolution API WhatsApp client (servidor apenas)
//
// Variáveis de ambiente necessárias (em .env.local):
//   EVOLUTION_API_URL=http://127.0.0.1:8080
//   EVOLUTION_API_KEY=<api_key>
//   EVOLUTION_INSTANCE_NAME=<nome_da_instancia>   ← criar via scripts/setup-evolution.sh

const BASE_URL = () => process.env.EVOLUTION_API_URL ?? 'http://127.0.0.1:8080'
const API_KEY = () => process.env.EVOLUTION_API_KEY ?? ''
const INSTANCE = () => process.env.EVOLUTION_INSTANCE_NAME ?? ''

async function post<T = unknown>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL()}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: API_KEY(),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Evolution API ${res.status}: ${text}`)
  }
  return res.json()
}

// Normaliza número brasileiro para formato internacional (55DDNNNNNNNNN)
export function normalizeBrPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('55') && digits.length >= 12) return digits
  return `55${digits}`
}

export async function sendTextMessage(to: string, text: string): Promise<void> {
  const instance = INSTANCE()
  if (!instance) {
    console.warn('[evolution] EVOLUTION_INSTANCE_NAME não configurado')
    return
  }
  await post(`/message/sendText/${instance}`, { number: to, text })
}

export async function sendDocumentMessage(
  to: string,
  mediaUrl: string,
  fileName: string,
  caption: string,
): Promise<void> {
  const instance = INSTANCE()
  if (!instance) {
    console.warn('[evolution] EVOLUTION_INSTANCE_NAME não configurado')
    return
  }
  await post(`/message/sendMedia/${instance}`, {
    number: to,
    mediatype: 'document',
    mimetype: 'application/pdf',
    media: mediaUrl,
    fileName,
    caption,
  })
}
