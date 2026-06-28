// lib/supabase.ts — servidor apenas (não expor ao browser)
//
// Variáveis de ambiente necessárias (em .env.local):
//   SUPABASE_URL=https://<project>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY=<service_role_key>   ← nunca expor ao cliente
//
// Schema da tabela (SQL Editor do Supabase):
//   create table leads_checklist (
//     id           uuid primary key default gen_random_uuid(),
//     created_at   timestamptz default now(),
//     nome         text not null,
//     whatsapp     text not null,
//     forca        text,
//     etapa_atual  text,
//     cidade       text,
//     estado       text,
//     origem       text,
//     ip           text,
//     user_agent   text,
//     utm_source   text,
//     utm_medium   text,
//     utm_campaign text
//   );
//   alter table leads_checklist enable row level security;
//   create policy "insert_only" on leads_checklist for insert with check (true);

import { createClient, SupabaseClient } from '@supabase/supabase-js'

export type LeadData = {
  nome: string
  whatsapp: string
  forca?: string | null
  etapa_atual?: string | null
  cidade?: string | null
  estado?: string | null
  origem?: string | null
  ip?: string | null
  user_agent?: string | null
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
}

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient | null {
  if (_client) return _client
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  _client = createClient(url, key, { auth: { persistSession: false } })
  return _client
}

export async function saveLead(data: LeadData): Promise<void> {
  const client = getClient()
  if (!client) {
    console.warn('[supabase] credenciais não configuradas — lead não salvo')
    return
  }
  const { error } = await client.from('leads_checklist').insert(data)
  if (error) throw error
}
