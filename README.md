# recrutapadrao-checklist

Landing page de captura de leads do Quartel Digital.

URL de produção: `https://recrutapadrao.com/checklist`

---

## Rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com os valores reais

# 3. Subir o servidor de desenvolvimento
npm run dev
```

Abra `http://localhost:3000` — ele redireciona para `/checklist`.

---

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

| Variável | Obrigatória | Descrição |
|---|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Sim | Número no formato internacional sem `+` (ex: `5521999999999`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Quando integrar | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Quando integrar | Chave anônima do Supabase |
| `NEXT_PUBLIC_GA_ID` | Quando ativar | ID do Google Analytics 4 (ex: `G-XXXXXXXXXX`) |
| `NEXT_PUBLIC_CLARITY_ID` | Quando ativar | ID do Microsoft Clarity |
| `NEXT_PUBLIC_META_PIXEL_ID` | Quando ativar campanhas | ID do Meta Pixel |

---

## Conectar o Supabase

### 1. Instalar o pacote

```bash
npm install @supabase/supabase-js
```

### 2. Criar a tabela

Execute no SQL Editor do Supabase:

```sql
create table leads_checklist (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  nome            text not null,
  whatsapp        text not null,
  forca           text,
  etapa_atual     text,
  cidade          text,
  estado          text,
  origem          text,
  ip              text,
  user_agent      text,
  utm_source      text,
  utm_medium      text,
  utm_campaign    text
);

alter table leads_checklist enable row level security;

create policy "insert_only" on leads_checklist
  for insert with check (true);
```

### 3. Ativar o client

Em `lib/supabase.ts`, descomente o código e siga as instruções no próprio arquivo.

### 4. Chamar no formulário

Em `components/ChecklistForm.tsx`, localize o comentário `TODO: Supabase` e substitua o `console.log` pela chamada `await saveLead(payload)`.

---

## Analytics

### Google Analytics 4

1. Crie um stream no GA4 e copie o Measurement ID (`G-XXXXXXXXXX`)
2. Coloque em `NEXT_PUBLIC_GA_ID` no `.env.local`
3. O script é injetado automaticamente via `app/layout.tsx`

Eventos rastreados (`lib/analytics.ts`):

| Evento | Quando dispara |
|---|---|
| `lead_started` | Primeiro campo preenchido |
| `lead_completed` | Formulário enviado com sucesso |
| `cta_whatsapp` | Clique no botão "Entrar no WhatsApp" |

### Microsoft Clarity

1. Crie um projeto em [clarity.microsoft.com](https://clarity.microsoft.com)
2. Copie o Project ID e coloque em `NEXT_PUBLIC_CLARITY_ID`

### Meta Pixel

O script está preparado (comentado) em `app/layout.tsx`. Quando ativar:

1. Preencha `NEXT_PUBLIC_META_PIXEL_ID`
2. Descomente o bloco `<Script id="meta-pixel">` no layout

---

## Build e deploy

```bash
npm run build
npm run start
```

Para deploy no Vercel:

1. Importe o repositório
2. Configure as variáveis de ambiente no painel do Vercel
3. Deploy automático a cada push na branch `main`

---

## Estrutura do projeto

```
recrutapadrao-checklist/
├── app/
│   ├── globals.css          # Estilos globais
│   ├── layout.tsx           # Layout raiz + scripts de analytics
│   └── checklist/
│       └── page.tsx         # Página principal (/checklist)
├── components/
│   └── ChecklistForm.tsx    # Formulário com validação e estado de sucesso
├── lib/
│   ├── analytics.ts         # Wrapper GA4 + Clarity
│   └── supabase.ts          # Client Supabase (inativo, preparado)
├── .env.example             # Variáveis previstas
├── next.config.ts           # Redirect / → /checklist
└── README.md
```

---

## Próximos passos (Sprint 02)

- [ ] Integrar Supabase (`lib/supabase.ts` já preparado)
- [ ] Ativar GA4 e Clarity
- [ ] Adicionar mockup/imagem do PDF no hero
- [ ] Configurar domínio `recrutapadrao.com` no Vercel
- [ ] Ativar Meta Pixel quando iniciar campanhas
