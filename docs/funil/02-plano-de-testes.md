# Plano de Testes E2E — Funil de Aquisição

## Pré-condições

- Ambiente de produção rodando em `checklist.recrutapadrao.com.br`
- Supabase configurado e tabela criada
- Evolution API com instância conectada
- PDF hospedado em URL pública
- `.env.local` totalmente preenchido
- PM2 com build atualizado

---

## T1 — Submissão válida (caminho feliz)

**Ação:** Preencher formulário com dados válidos e submeter

**Dados:**
```
Nome: João Recruta
WhatsApp: (11) 98765-4321
Força: Marinha
```

**Verificar:**
- [ ] Formulário aceita envio sem erros de validação
- [ ] Botão muda para "Enviando..." durante a requisição
- [ ] Tela de sucesso exibe em < 3 segundos
- [ ] H2: "Pronto! Seu Checklist está a caminho."
- [ ] Botão "Receber pelo WhatsApp" visível
- [ ] Supabase: registro aparece em `leads_checklist` com `whatsapp = '11987654321'`
- [ ] WhatsApp: mensagem de boas-vindas recebida com nome correto
- [ ] WhatsApp: PDF entregue como documento após boas-vindas
- [ ] PM2 logs sem erros

---

## T2 — Validação de campos obrigatórios

**Ação:** Submeter formulário vazio

**Verificar:**
- [ ] Erro "Nome é obrigatório" aparece abaixo do campo Nome
- [ ] Foco vai para o campo Nome
- [ ] Formulário NÃO chama `/api/leads`

**Ação:** Preencher nome, deixar WhatsApp vazio

**Verificar:**
- [ ] Erro "WhatsApp é obrigatório"
- [ ] Foco vai para o campo WhatsApp

---

## T3 — WhatsApp com formato inválido

**Dados:** WhatsApp = "123" (menos de 10 dígitos)

**Verificar:**
- [ ] Erro "Número inválido — informe DDD + número"
- [ ] Formulário não submete

---

## T4 — API `/api/leads` diretamente

```bash
# Payload mínimo válido
curl -s -X POST https://checklist.recrutapadrao.com.br/api/leads \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste API","whatsapp":"11999990001"}' | jq .
# Esperado: {"ok":true}

# Payload completo
curl -s -X POST https://checklist.recrutapadrao.com.br/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Recruta",
    "whatsapp": "21988887777",
    "forca_interesse": "Marinha",
    "etapa_atual": "Preparação",
    "utm_source": "test",
    "utm_medium": "e2e"
  }' | jq .

# Payload inválido — sem nome
curl -s -X POST https://checklist.recrutapadrao.com.br/api/leads \
  -H "Content-Type: application/json" \
  -d '{"whatsapp":"11999990001"}' | jq .
# Esperado: {"error":"nome e whatsapp são obrigatórios"} + HTTP 400

# Payload inválido — WhatsApp curto
curl -s -X POST https://checklist.recrutapadrao.com.br/api/leads \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","whatsapp":"123"}' | jq .
# Esperado: {"error":"whatsapp inválido"} + HTTP 400
```

---

## T5 — Webhook WhatsApp

```bash
# Simular evento de conexão
curl -s -X POST https://checklist.recrutapadrao.com.br/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "event": "connection.update",
    "instance": "quartel-digital",
    "data": {"state": "open"}
  }' | jq .
# Esperado: {"ok":true}
```

Verificar nos logs PM2:
```bash
pm2 logs recrutapadrao-checklist --lines 10
# Esperado: [whatsapp] quartel-digital — status: open
```

---

## T6 — Degradação graciosa (Supabase offline)

**Preparação:** Preencher `SUPABASE_URL` com valor inválido (ex: `https://invalid.supabase.co`)

**Ação:** Submeter formulário com dados válidos

**Verificar:**
- [ ] Usuário vê tela de sucesso normalmente
- [ ] PM2 logs: `[leads] supabase: <erro>`
- [ ] WhatsApp: mensagem ainda é enviada (se Evolution configurado)
- [ ] Restabelecer `SUPABASE_URL` correto

---

## T7 — UTMs propagados

**URL de teste:** `https://checklist.recrutapadrao.com.br/checklist?utm_source=instagram&utm_medium=bio&utm_campaign=internato-jun`

**Ação:** Preencher e submeter formulário

**Verificar no Supabase:**
- [ ] `utm_source = 'instagram'`
- [ ] `utm_medium = 'bio'`
- [ ] `utm_campaign = 'internato-jun'`

---

## T8 — Tela de sucesso mobile

**Dispositivos a testar:** iPhone Safari, Android Chrome

**Verificar:**
- [ ] Botão "Receber pelo WhatsApp" abre o app do WhatsApp
- [ ] Texto pré-preenchido correto
- [ ] Layout não quebrado

---

## Matriz de status

| Teste | Data | Resultado | Notas |
|-------|------|-----------|-------|
| T1 — Caminho feliz | | | |
| T2 — Validação obrigatórios | | | |
| T3 — WhatsApp inválido | | | |
| T4 — API direta | | | |
| T5 — Webhook | | | |
| T6 — Degradação | | | |
| T7 — UTMs | | | |
| T8 — Mobile | | | |
