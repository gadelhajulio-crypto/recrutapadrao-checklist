# HANDOFF — Evolution API Setup
> Documento de continuidade. Retomar exatamente deste ponto na próxima sessão.
> Criado em: 2026-06-29

---

## Estado atual

- Sprint 1 concluído.
- Sprint 2 concluído.
- Landing em produção: `https://checklist.recrutapadrao.com.br`
- PM2 operacional — `recrutapadrao-checklist` online (id=5), porta 3011.
- Supabase operacional — tabela `leads_checklist` criada, RLS ativo, grants corretos.
- Persistência de leads validada — insert e rollback testados em produção.
- API `POST /api/leads` funcionando — retorna `{"ok":true}`.
- Novo número WhatsApp Business: **5584920000210**
  - Nome comercial: Recruta Padrão
  - Categoria: Site educacional

---

## Evolution API

### Rotação da AUTHENTICATION_API_KEY
- **Status: CONCLUÍDA**
- Nova chave gerada (32 chars, alphanumérica)
- `/opt/evolution-api/.env` → `AUTHENTICATION_API_KEY` atualizado
- Container `evolution_api` recriado com a nova chave
- Nova chave validada: HTTP 200 ✅
- Chave antiga (comprometida — ver commit `36464a5`) rejeitada: HTTP 401 ✅
- Três `.env.local` atualizados com `EVOLUTION_API_KEY`:
  - `/var/www/recrutapadrao-checklist/.env.local`
  - `/var/www/vitrinni-os/apps/web/.env.local`
  - `/root/vitrinni-studio/apps/web/.env.local`
- PM2 `recrutapadrao-checklist` reiniciado ✅
- PM2 `vitrinni-os` reiniciado ✅

### Instância `recrutapadrao`
- **Status: CRIADA — aguardando conexão**

| Campo | Valor |
|---|---|
| `instanceName` | `recrutapadrao` |
| `id` | `28f5a184-153f-48d8-949d-0d38e848fc54` |
| `connectionStatus` | `connecting` |
| `integration` | `WHATSAPP-BAILEYS` |
| `ownerJid` | `null` — não conectado |
| `profileName` | `null` — não conectado |
| `createdAt` | `2026-06-29T11:30:36.967Z` |

### QR Code
- Gerado com sucesso pela API
- Renderização como ANSI no terminal produziu saída colapsada — não utilizável
- **Conexão ainda não confirmada** — WhatsApp Business não escaneou o QR

---

## Variáveis de ambiente — estado atual

| Variável | Arquivo | Status |
|---|---|---|
| `SUPABASE_URL` | `.env.local` | ✅ OK |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local` | ✅ OK |
| `EVOLUTION_API_URL` | `.env.local` | ✅ OK |
| `EVOLUTION_API_KEY` | `.env.local` | ✅ OK (rotacionada) |
| `EVOLUTION_INSTANCE_NAME` | `.env.local` | ⏳ AUSENTE — configurar após conexão WhatsApp |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `.env.local` | ⏳ AUSENTE — configurar após conexão WhatsApp |
| `CHECKLIST_PDF_URL` | `.env.local` | ⏳ AUSENTE — pendente hospedagem do PDF |
| `N8N_WEBHOOK_URL` | `.env.local` | ⏳ AUSENTE — pendente decisão sobre n8n |

---

## Pendências imediatas

Na próxima sessão, executar **exatamente nesta ordem**:

### 1. Verificar instância
```
GET /instance/fetchInstances → confirmar que "recrutapadrao" existe e está em "connecting"
```

### 2. Gerar QR Code — **não renderizar no terminal**
- Chamar `GET /instance/connect/recrutapadrao`
- Salvar apenas como arquivo:
  - `/tmp/recrutapadrao-qr.png`
  - `/tmp/recrutapadrao-qr.svg`
- Informar os caminhos dos arquivos
- **Não exibir no terminal — não usar ANSI/UTF8**

### 3. Aguardar escaneamento
- Informar os caminhos dos arquivos ao usuário
- Aguardar confirmação de escaneamento antes de continuar

### 4. Confirmar conexão — só então prosseguir
Verificar via API:
```
GET /instance/fetchInstances → connectionStatus == "open"
```
Não avançar enquanto `connectionStatus` for diferente de `"open"`.

### 5. Configurar variáveis (somente após CONNECTED)
```
EVOLUTION_INSTANCE_NAME=recrutapadrao
NEXT_PUBLIC_WHATSAPP_NUMBER=5584920000210
```
Atualizar apenas em `/var/www/recrutapadrao-checklist/.env.local`.

### 6. Reiniciar somente o necessário
```bash
pm2 restart recrutapadrao-checklist
pm2 save
```

### 7. Teste parcial (Landing → Supabase → Evolution → WhatsApp)
```bash
curl -s -X POST http://127.0.0.1:3011/api/leads \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste Funil","whatsapp":"5584920000210"}' | python3 -m json.tool
```
Verificar:
- Lead gravado no Supabase ✅
- Mensagem de boas-vindas recebida no WhatsApp Business ✅

### 8. Hospedar o PDF do Checklist
- Upload no Supabase Storage (bucket público `checklist`)
- Configurar: `CHECKLIST_PDF_URL=<url_publica>`

### 9. Configurar n8n (se disponível)
- Configurar: `N8N_WEBHOOK_URL=<url_webhook>`
- n8n não estava instalado no servidor na sessão anterior

### 10. Teste ponta a ponta completo
Seguir: `docs/funil/02-plano-de-testes.md`

---

## Segurança

Nunca registrar neste documento nem em nenhum arquivo versionado:

- API Keys
- Tokens JWT
- Secrets
- Senhas
- Service Role Keys

Registrar **apenas nomes das variáveis**, nunca valores.

---

## Git — estado no encerramento desta sessão

| Item | Valor |
|---|---|
| Branch | `master` |
| Remote | `git@github.com:gadelhajulio-crypto/recrutapadrao-checklist.git` |
| Último commit (antes deste handoff) | `e06ef42 docs: adicionar handoff da sessão de desenvolvimento` |

Nenhuma alteração de código foi feita nesta sessão — apenas configuração de infraestrutura (`.env` e Docker), que não é versionada.
