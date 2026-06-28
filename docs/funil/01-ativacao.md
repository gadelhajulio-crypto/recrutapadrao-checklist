# Guia de Ativação do Funil

## Pré-requisitos

- [ ] Número WhatsApp Business disponível
- [ ] Conta Supabase criada (free tier suficiente)
- [ ] PDF do Checklist disponível em URL pública
- [ ] Evolution API rodando (já rodando em `127.0.0.1:8080`)

---

## Passo 1 — Supabase: criar tabela

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. Abra seu projeto → **SQL Editor**
3. Execute:

```sql
create table leads_checklist (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now(),
  nome         text not null,
  whatsapp     text not null,
  forca        text,
  etapa_atual  text,
  cidade       text,
  estado       text,
  origem       text,
  ip           text,
  user_agent   text,
  utm_source   text,
  utm_medium   text,
  utm_campaign text
);
alter table leads_checklist enable row level security;
create policy "insert_only" on leads_checklist for insert with check (true);
```

4. No Supabase → **Settings → API**:
   - Copie **Project URL** → `SUPABASE_URL`
   - Copie **service_role (secret)** → `SUPABASE_SERVICE_ROLE_KEY`

---

## Passo 2 — Hospedar o PDF

Opções:
- **Supabase Storage** (recomendado): criar bucket público `checklist`, fazer upload do PDF
  - URL ficará: `https://<project>.supabase.co/storage/v1/object/public/checklist/checklist-internato.pdf`
- **Google Drive**: compartilhar publicamente → pegar link de download direto
- **GitHub Releases**: upload como asset de release

Copiar a URL pública → `CHECKLIST_PDF_URL`

---

## Passo 3 — Configurar instância WhatsApp

```bash
# No servidor, com o número disponível:
cd /var/www/recrutapadrao-checklist
bash scripts/setup-evolution.sh
```

Escaneie o QR code que aparece com o WhatsApp Business.

---

## Passo 4 — Atualizar `.env.local`

```bash
# Editar no servidor:
nano /var/www/recrutapadrao-checklist/.env.local
```

Preencher:
```
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999   ← número para o botão da tela de sucesso
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
EVOLUTION_INSTANCE_NAME=quartel-digital
CHECKLIST_PDF_URL=<url_do_pdf>
```

---

## Passo 5 — Build e deploy

```bash
cd /var/www/recrutapadrao-checklist
npm run build
pm2 restart recrutapadrao-checklist
pm2 logs recrutapadrao-checklist --lines 20
```

---

## Passo 6 — Teste de fumo

```bash
curl -s -X POST https://checklist.recrutapadrao.com.br/api/leads \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","whatsapp":"11999999999"}' | jq .
```

Esperado: `{"ok":true}`

Verificar:
- [ ] Lead aparece na tabela `leads_checklist` no Supabase
- [ ] Mensagem de boas-vindas chega no WhatsApp do número de teste
- [ ] PDF entregue como documento
- [ ] Logs PM2 sem erros críticos

---

## Checklist de ativação

- [ ] Tabela Supabase criada com RLS
- [ ] `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` preenchidos
- [ ] PDF hospedado em URL pública
- [ ] `CHECKLIST_PDF_URL` preenchido
- [ ] Instância Evolution API criada e conectada
- [ ] `EVOLUTION_INSTANCE_NAME` preenchido
- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER` preenchido
- [ ] Build sem erros
- [ ] PM2 online
- [ ] Teste de fumo passou
- [ ] Funil em produção ✓
