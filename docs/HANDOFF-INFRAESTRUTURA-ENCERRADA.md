# HANDOFF — Encerramento da Fase de Infraestrutura
> **Este documento substitui HANDOFF-2026-06-28.md e HANDOFF-EVOLUTION-SETUP.md.**
> Todas as pendências listadas nesses documentos foram concluídas.
> Data de encerramento: 02/07/2026

---

## Declaração oficial

**A infraestrutura do Recruta Padrão entra em modo de estabilidade.**

Mudanças futuras na infraestrutura somente mediante necessidade comprovada:
- falha em produção
- limitação de escalabilidade mensurável
- requisito de segurança identificado
- novo domínio ou serviço aprovado

**O foco do projeto passa a ser evolução de produto.**

---

## Estado final da infraestrutura

### Domínios e roteamento

| Domínio | Comportamento | HTTP Status |
|---|---|---|
| `https://recrutapadrao.com.br` | Worker OpenNext → homepage pública | 200 |
| `https://www.recrutapadrao.com.br` | Nginx → 301 permanente → apex | 301 |
| `https://checklist.recrutapadrao.com.br` | Nginx → porta 3011 → landing do funil | 200 |
| `https://os.recrutapadrao.com.br` | Nginx → porta 3001 → dashboard operacional | 307→/quartel |

### SSL

| Certificado | SANs | Validade | Renovação |
|---|---|---|---|
| `recrutapadrao.com.br` | `recrutapadrao.com.br`, `www.recrutapadrao.com.br` | 29/09/2026 | DNS-01 via Cloudflare API (automática) |
| `checklist.recrutapadrao.com.br` | `checklist.recrutapadrao.com.br` | 24/09/2026 | Automática |
| `os.recrutapadrao.com.br` | `os.recrutapadrao.com.br` | 18/08/2026 | Automática |

Credenciais DNS-01: `/root/.secrets/certbot/cloudflare.ini` (chmod 600)

### Nginx

Arquivo de configuração: `/etc/nginx/sites-available/recrutapadrao.com.br`

Quatro blocos separados (não reutilizar o padrão de bloco único com múltiplos server_names):
- `recrutapadrao.com.br` (443) → `proxy_pass 127.0.0.1:3001`
- `www.recrutapadrao.com.br` (443) → `return 301 https://recrutapadrao.com.br$request_uri`
- `recrutapadrao.com.br` (80) → `proxy_pass 127.0.0.1:3001`
- `www.recrutapadrao.com.br` (80) → `return 301 https://recrutapadrao.com.br$request_uri`

### PM2

| id | Processo | Porta | Status |
|---|---|---|---|
| 0 | pm2-logrotate | — | online |
| 1 | vitrinni-os | 3010 | online |
| 2 | recruta-padrao-os | 3001 | online |
| 3 | qd-stale-checker | — | stopped (esperado) |
| 4 | mergulho-atipico | 3002 | online |
| 5 | **recrutapadrao-checklist** | **3011** | **online** |

### Variáveis de ambiente — `.env.local`

| Variável | Status |
|---|---|
| `SUPABASE_URL` | ✅ Configurado |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Configurado |
| `EVOLUTION_API_URL` | ✅ Configurado |
| `EVOLUTION_API_KEY` | ✅ Configurado (rotacionada em 29/06/2026) |
| `EVOLUTION_INSTANCE_NAME` | ✅ `recrutapadrao` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ✅ `5584920000210` |
| `CHECKLIST_PDF_URL` | ✅ Configurado (Supabase Storage) |
| `N8N_WEBHOOK_URL` | ⏳ Ausente — n8n não instalado, decisão pendente |

### Evolution API

| Campo | Valor |
|---|---|
| Versão | v2.3.7 |
| Container | `evolution_api` · Docker · `127.0.0.1:8080` |
| Instância | `recrutapadrao` |
| connectionStatus | `open` |
| Owner | `5584920000210@s.whatsapp.net` |

### Supabase

| Campo | Valor |
|---|---|
| Projeto | `fjwvtzvfbhubxicsmbdz` |
| Tabela | `leads_checklist` · RLS ativo · grants corretos |
| Storage | bucket `checklist` (público) · PDF do checklist hospedado |

### Git

| Campo | Valor |
|---|---|
| Branch | `master` |
| Último commit | `462f92b` — docs: registrar MARCO-PRODUCAO-001 |
| Remote | `git@github.com:gadelhajulio-crypto/recrutapadrao-checklist.git` |
| Árvore | Limpa |

---

## Itens concluídos nesta fase

Todas as pendências dos HANDOFFs anteriores foram endereçadas:

- [x] Rotação da `AUTHENTICATION_API_KEY` da Evolution API
- [x] Criação da instância `recrutapadrao` na Evolution API
- [x] Conexão do WhatsApp Business (`5584920000210`)
- [x] Configuração das variáveis `EVOLUTION_INSTANCE_NAME` e `NEXT_PUBLIC_WHATSAPP_NUMBER`
- [x] Hospedagem do PDF no Supabase Storage
- [x] Configuração de `CHECKLIST_PDF_URL`
- [x] Substituição da imagem hero (`formacao_naval.png`)
- [x] Correção do `proxy_set_header Host` no Nginx
- [x] Resolução do Error 522 (CNAME loop → A record)
- [x] Resolução do Error 526 (certificado inválido → novo cert Let's Encrypt DNS-01)
- [x] Correção do redirect `www` (dashboard exposto → 301 para apex)
- [x] Validação E2E completa do funil
- [x] Teste real com iPhone (Chrome iOS) — dois testes confirmados em produção

---

## O que NÃO fazer a partir daqui

- Não alterar VirtualHosts do Nginx sem necessidade comprovada
- Não alterar Workers do Cloudflare
- Não alterar configurações de DNS
- Não alterar a tabela `leads_checklist` sem migração planejada
- Não reiniciar PM2 processos de outros projetos ao trabalhar no checklist
- Não commitar `.env.local`, certificados, tokens ou logs

---

## Próxima fase — Evolução de Produto

Referência: `docs/MARCO-PRODUCAO-001.md` — Seção "Próximo marco"

**MARCO DE PRODUÇÃO Nº 002 — Portal Recruta Padrão**

Prioridades em ordem:

1. **Portal principal** — homepage `recrutapadrao.com.br` com SEO estruturado
2. **Landings por força** — Marinha, Exército, Aeronáutica (funis individuais)
3. **Biblioteca Estratégica** — conteúdo educacional indexado
4. **Automação de relacionamento** — nurturing WhatsApp via n8n
5. **Quartel Digital** — plataforma operacional interna consolidada

---

## Pendências técnicas herdadas (não bloqueantes)

Itens que não impedem operação mas devem ser endereçados antes de escala:

1. **Security headers HTTP** — adicionar `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` no Nginx
2. **Rate limiting** — limitar `POST /api/leads` por IP para evitar abuso
3. **Envio assíncrono WhatsApp** — desacoplar envio da resposta HTTP (latência atual: ~7s)
4. **Monitoramento de uptime** — UptimeRobot ou similar para alertas automáticos
5. **N8N** — instalar e configurar `N8N_WEBHOOK_URL` para automações pós-lead
6. **Health check endpoint** — `GET /api/health` para Supabase + Evolution

---

*Fase de Infraestrutura encerrada em 02/07/2026 — Recruta Padrão / Quartel Digital*
