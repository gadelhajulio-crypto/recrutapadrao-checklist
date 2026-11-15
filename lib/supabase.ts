// lib/supabase.ts — servidor apenas (não expor ao browser)
//
// Variáveis de ambiente necessárias (em .env.local):
//   SUPABASE_URL=https://<project>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY=<service_role_key>   ← nunca expor ao cliente
//
// Schema da tabela (SQL Editor do Supabase):
//   create table leads_checklist (
//     id                    uuid primary key default gen_random_uuid(),
//     created_at            timestamptz default now(),
//     nome                  text not null,
//     whatsapp              text not null,
//     forca                 text,
//     etapa_atual           text,
//     cidade                text,
//     estado                text,
//     origem                text,
//     ip                    text,
//     user_agent            text,
//     utm_source            text,
//     utm_medium            text,
//     utm_campaign          text,
//     checklist_token       uuid unique,
//     checklist_accessed_at timestamptz,
//     checklist_access_count integer not null default 0,
//     last_accessed_at      timestamptz
//   );
//   alter table leads_checklist enable row level security;
//   create policy "insert_only" on leads_checklist for insert with check (true);
//   -- Ver scripts/migrate-add-checklist-token.sql para adicionar colunas de token.

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
  checklist_token?: string | null
  whatsapp_opt_in?: boolean
  whatsapp_opt_in_at?: string | null
  whatsapp_opt_in_text?: string | null
  whatsapp_opt_in_source?: string | null
}

export type LeadRow = {
  id: string
  nome: string
  whatsapp: string
  checklist_accessed_at: string | null
  checklist_access_count: number
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

export async function saveLead(data: LeadData): Promise<{ id: string; created_at: string }> {
  const client = getClient()
  if (!client) {
    throw new Error('CHECKLIST_PERSISTENCE_UNAVAILABLE')
  }
  const { data: persisted, error } = await client
    .from('leads_checklist')
    .insert(data)
    .select('id, created_at')
    .single()
  if (error) throw error
  if (!persisted?.id || !persisted?.created_at) {
    throw new Error('CHECKLIST_PERSISTENCE_UNCONFIRMED')
  }
  return persisted as { id: string; created_at: string }
}

export async function getLeadByToken(token: string): Promise<LeadRow | null> {
  const client = getClient()
  if (!client) return null
  const { data, error } = await client
    .from('leads_checklist')
    .select('id, nome, whatsapp, checklist_accessed_at, checklist_access_count')
    .eq('checklist_token', token)
    .single()
  if (error || !data) return null
  return data as LeadRow
}

export async function recordChecklistAccess(token: string): Promise<void> {
  const client = getClient()
  if (!client) return
  const { data } = await client
    .from('leads_checklist')
    .select('checklist_accessed_at, checklist_access_count')
    .eq('checklist_token', token)
    .single()
  await client
    .from('leads_checklist')
    .update({
      checklist_accessed_at: data?.checklist_accessed_at ?? new Date().toISOString(),
      checklist_access_count: (data?.checklist_access_count ?? 0) + 1,
      last_accessed_at: new Date().toISOString(),
    })
    .eq('checklist_token', token)
}