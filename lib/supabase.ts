// lib/supabase.ts
// Integração com Supabase — inativa por enquanto.
//
// Para ativar:
//   1. npm install @supabase/supabase-js
//   2. Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local
//   3. Descomente o código abaixo
//   4. Em ChecklistForm.tsx, importe saveLead e chame após validação
//
// Schema da tabela (executar no SQL Editor do Supabase):
//
//   create table leads_checklist (
//     id              uuid primary key default gen_random_uuid(),
//     created_at      timestamptz default now(),
//     nome            text not null,
//     whatsapp        text not null,
//     forca           text,
//     etapa_atual     text,
//     cidade          text,
//     estado          text,
//     origem          text,
//     ip              text,
//     user_agent      text,
//     utm_source      text,
//     utm_medium      text,
//     utm_campaign    text
//   );
//
//   -- Habilitar RLS
//   alter table leads_checklist enable row level security;
//
//   -- Permitir insert anônimo (o site insere, ninguém lê sem autenticação)
//   create policy "insert_only" on leads_checklist
//     for insert with check (true);

// import { createClient } from '@supabase/supabase-js'
//
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//
// export const supabase = createClient(supabaseUrl, supabaseKey)
//
// export type LeadData = {
//   nome: string
//   whatsapp: string
//   forca: string
//   etapa_atual: string
//   cidade?: string
//   estado?: string
//   origem?: string
//   ip?: string
//   user_agent?: string
//   utm_source?: string
//   utm_medium?: string
//   utm_campaign?: string
// }
//
// export async function saveLead(data: LeadData) {
//   const { error } = await supabase.from('leads_checklist').insert(data)
//   if (error) throw error
// }

export {}
