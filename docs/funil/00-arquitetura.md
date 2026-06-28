# Funil de Aquisição — Arquitetura

## Visão geral

```
[Formulário — cliente]
        │
        │  POST /api/leads
        ▼
[Next.js API Route]
        │
        ├── Supabase INSERT (leads_checklist)
        │       └── se SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY configurados
        │
        ├── Evolution API: sendText + sendDocument (PDF)
        │       └── se EVOLUTION_INSTANCE_NAME + CHECKLIST_PDF_URL configurados
        │
        └── n8n webhook (fire-and-forget)
                └── se N8N_WEBHOOK_URL configurado
```

## Fluxo por componente

### 1. Formulário (`components/ChecklistForm.tsx`)
- Usuário preenche nome, WhatsApp e campos opcionais
- Ao submeter, chama `POST /api/leads` com JSON
- Exibe tela de sucesso independente do resultado da API

### 2. API Route (`app/api/leads/route.ts`)
- Valida nome e WhatsApp
- Extrai IP do header `x-forwarded-for`
- Persiste no Supabase (falha silenciosa — não bloqueia usuário)
- Envia mensagem de boas-vindas via Evolution API
- Envia PDF via Evolution API (se `CHECKLIST_PDF_URL` configurado)
- Dispara webhook n8n (se `N8N_WEBHOOK_URL` configurado)

### 3. Supabase (`lib/supabase.ts`)
- Tabela: `leads_checklist`
- Cliente servidor com `SUPABASE_SERVICE_ROLE_KEY` (não exposto ao browser)
- RLS habilitado — policy `insert_only`

### 4. Evolution API (`lib/evolution.ts`)
- Rodando em `127.0.0.1:8080` via Docker
- Timeout de 10s por chamada
- Falha silenciosa — erro logado, funil continua

### 5. Webhook receiver (`app/api/webhooks/whatsapp/route.ts`)
- Recebe eventos da Evolution API (mensagens recebidas, status de conexão)
- Loga eventos
- Extensível para encaminhar para n8n

## Degradação graciosa

| Componente indisponível | Impacto para o usuário |
|-------------------------|------------------------|
| Supabase offline | Lead não salvo, funil continua |
| Evolution offline | WhatsApp não enviado, funil continua |
| n8n offline | Automações não executam, funil continua |
| PDF URL ausente | Mensagem enviada sem anexo |
| Todos offline | Usuário vê tela de sucesso, lead perdido |

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SITE_URL` | Sim | URL do site em produção |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Para tela de sucesso | Número exibido no botão |
| `SUPABASE_URL` | Para persistência | URL do projeto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Para persistência | Chave servidor (nunca `NEXT_PUBLIC_`) |
| `EVOLUTION_API_URL` | Padrão: `http://127.0.0.1:8080` | URL da Evolution API |
| `EVOLUTION_API_KEY` | Para WhatsApp | API key da Evolution |
| `EVOLUTION_INSTANCE_NAME` | Para WhatsApp | Nome da instância configurada |
| `CHECKLIST_PDF_URL` | Para entrega do PDF | URL pública do PDF |
| `N8N_WEBHOOK_URL` | Para automações | Webhook de entrada do n8n |
