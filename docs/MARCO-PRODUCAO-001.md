# MARCO DE PRODUÇÃO Nº 001
## Primeiro funil operacional do Recruta Padrão

**Data:** 02 de julho de 2026
**Hora:** 11:15 UTC (08:15 BRT)
**Commit de referência:** `db2669b`

---

## Objetivo

Registrar oficialmente o momento em que o primeiro funil do Recruta Padrão foi validado em ambiente de produção com tráfego real, cadeia completa e zero erros.

---

## Escopo validado

### Infraestrutura

| Componente | Versão / Detalhe | Status |
|---|---|---|
| VPS | Ubuntu 22.04 · 8 GB RAM · 96 GB SSD · Hostinger | ✅ Online |
| Nginx | v1.24.0 | ✅ Configurado |
| PM2 | `recrutapadrao-checklist` id=5 · porta 3011 | ✅ Online |
| Cloudflare | Orange cloud em todos os domínios · Full (Strict) | ✅ Ativo |
| Workers | OpenNext (`recrutapadrao-router`) para apex | ✅ Ativo |
| DNS | A records para todos os subdomínios | ✅ Correto |
| SSL Let's Encrypt | Dois certificados válidos · renovação automática DNS-01 | ✅ Válido |
| Cloudflare Full (Strict) | Certificados validados na origem | ✅ Ativo |
| Evolution API | v2.3.7 · Docker · instância `recrutapadrao` · `connectionStatus: open` | ✅ Conectada |
| Supabase | PostgreSQL · tabela `leads_checklist` · Storage `checklist` | ✅ Operacional |

---

### Domínios

| Domínio | Comportamento | Status |
|---|---|---|
| `https://recrutapadrao.com.br` | Homepage pública via Worker OpenNext · HTTP 200 | ✅ |
| `https://www.recrutapadrao.com.br` | Redirect 301 permanente → `https://recrutapadrao.com.br` | ✅ |
| `https://checklist.recrutapadrao.com.br` | Landing page do funil · porta 3011 | ✅ |
| `https://os.recrutapadrao.com.br` | Dashboard operacional interno · porta 3001 | ✅ |

---

### Funil validado

```
Usuário acessa https://checklist.recrutapadrao.com.br/checklist
           ↓
Preenche formulário (nome + WhatsApp)
           ↓
POST /api/leads  →  HTTP 200 {"ok":true}
           ↓
Supabase  →  lead gravado em leads_checklist
           ↓
Evolution API  →  sendText (mensagem de boas-vindas)
           ↓
Evolution API  →  sendMedia (PDF automático via CHECKLIST_PDF_URL)
           ↓
WhatsApp  →  mensagem + PDF entregues ao número cadastrado
           ↓
Fim
```

---

## Testes realizados

| Data/Hora (UTC) | Tipo | Resultado |
|---|---|---|
| 26/06/2026 | Configuração inicial de variáveis e PM2 | ✅ |
| 27/06/2026 | Teste Evolution API — conexão da instância via QR Code | ✅ |
| 29/06/2026 | Teste automatizado `POST /api/leads` (local, sem env vars) | ❌ → identificou ausência de vars |
| 29/06/2026 | Configuração de `EVOLUTION_INSTANCE_NAME`, `--update-env` PM2 | ✅ |
| 30/06/2026 | Teste automatizado `POST /api/leads` com vars corretas | ✅ |
| 30/06/2026 | PDF hospedado no Supabase Storage · `CHECKLIST_PDF_URL` configurado | ✅ |
| 30/06/2026 | Substituição de hero image (`formacao_naval.png`) · build e push | ✅ |
| 01/07/2026 | Diagnóstico de infraestrutura (`www` fora do ar) | — |
| 01/07/2026 | Correção Nginx `Host` header (`$host` em vez de hardcoded) | ✅ |
| 01/07/2026 | Diagnóstico DNS (NXDOMAIN em Windows) | ✅ resolvido |
| 01/07/2026 | Investigação Cloudflare Error 522 | ✅ resolvido |
| 01/07/2026 | Investigação Cloudflare Error 526 | ✅ resolvido |
| 01/07/2026 | Emissão de certificado SSL Let's Encrypt (DNS-01 via Cloudflare API) | ✅ |
| 01/07/2026 | Teste SSL `openssl s_client` — ambos os domínios | ✅ |
| 02/07/2026 | Correção redirect `www` (dashboard operacional exposto) | ✅ |
| 02/07/2026 | Teste E2E automatizado `POST /api/leads` com lead de teste | ✅ |
| 02/07/2026 10:58 UTC | **Teste real #1 — iPhone · Chrome iOS · "Julio teste producao"** | ✅ |
| 02/07/2026 11:15 UTC | **Teste real #2 — iPhone · Chrome iOS · "Julio teste logs"** | ✅ |

---

## Problemas encontrados

### 1. QR Code Evolution API — instância desconectada

**Problema:** Instância `recrutapadrao` criada mas sem WhatsApp conectado. Envios falhavam silenciosamente.

**Diagnóstico:** `connectionStatus: close` — o QR Code precisa ser escaneado manualmente para autenticar a sessão WhatsApp Business.

**Correção:** Escaneamento do QR Code via painel Evolution API. Sessão autenticada com `owner: 5584920000210@s.whatsapp.net`.

**Resultado:** `connectionStatus: open` · instância estável desde 27/06/2026.

---

### 2. DNS — NXDOMAIN em Windows para `www.recrutapadrao.com.br`

**Problema:** `nslookup www.recrutapadrao.com.br` retornava NXDOMAIN em ambiente Windows, mesmo com registro presente na zona Cloudflare.

**Diagnóstico:** Inconsistência entre cache local do resolver Windows e os nameservers autoritativos da Cloudflare, que respondiam corretamente via `dig`. O registro existia mas o cache local estava desatualizado.

**Correção:** Flush de cache DNS local no Windows (`ipconfig /flushdns`) + aguardar propagação. Registro confirmado nos nameservers `art.ns.cloudflare.com` e `dahlia.ns.cloudflare.com`.

**Resultado:** Resolução DNS correta em todos os ambientes.

---

### 3. Cloudflare Error 1101 — Worker exception

**Problema:** `recrutapadrao.com.br` retornava Cloudflare Error 1101 (Worker runtime exception).

**Diagnóstico:** O Worker OpenNext (gerado pelo framework Next.js para deploy no Cloudflare Pages/Workers) estava lançando uma exceção interna durante a inicialização ou roteamento.

**Correção:** Resolvido automaticamente após estabilização — o Worker passou a responder `HTTP 200` com `x-opennext: 1`. Sem alteração manual necessária.

**Resultado:** Apex respondendo `200 OK` com homepage pública servida pelo Worker.

---

### 4. Cloudflare Error 522 — TCP timeout em `www.recrutapadrao.com.br`

**Problema:** `https://www.recrutapadrao.com.br` retornava Error 522 (Connection Timed Out).

**Diagnóstico:** O registro DNS era `www CNAME recrutapadrao.com.br`, com ambos os domínios com orange cloud (proxied). O Cloudflare seguia o CNAME e chegava ao seu próprio endereço IP proxy, criando um loop — a requisição nunca chegava à origem.

**Correção:** Alteração manual no painel Cloudflare: `www` convertido de `CNAME recrutapadrao.com.br` para `A 85.31.230.58` (IP direto da VPS), mantendo orange cloud.

**Resultado:** Requisições `www.` passaram a chegar corretamente à origem via Cloudflare proxy.

---

### 5. Cloudflare Error 526 — Invalid SSL Certificate

**Problema:** Após correção do DNS, `https://www.recrutapadrao.com.br` retornava Error 526 (Invalid SSL Certificate). Cloudflare em Full (Strict) rejeita certificados inválidos na origem.

**Diagnóstico:** O VirtualHost Nginx para `recrutapadrao.com.br www.recrutapadrao.com.br` usava o certificado `os.recrutapadrao.com.br`, que não possuía SAN para os domínios solicitados. Cloudflare em modo Full (Strict) valida o certificado da origem e rejeitou por incompatibilidade.

**Correção:** Emissão de novo certificado Let's Encrypt exclusivo para `recrutapadrao.com.br` e `www.recrutapadrao.com.br`. Atualização do VirtualHost Nginx para usar o novo certificado.

**Resultado:** Certificado válido com SANs corretos. Error 526 eliminado.

---

### 6. Falha no desafio HTTP-01 do Certbot

**Problema:** `certbot certonly --nginx` falhou para `recrutapadrao.com.br` com erro `unauthorized: 404`.

**Diagnóstico:** O Cloudflare Worker intercepta **todas** as requisições HTTP para o apex `recrutapadrao.com.br`, incluindo o caminho `/.well-known/acme-challenge/`. O Worker retornava 404 antes de a requisição chegar ao Nginx, impedindo a validação HTTP-01.

**Correção:** Instalação do plugin `python3-certbot-dns-cloudflare` e uso do desafio DNS-01 via Cloudflare API. O certbot adicionou um registro TXT `_acme-challenge.recrutapadrao.com.br` automaticamente, validou e emitiu o certificado sem depender de HTTP.

**Resultado:** Certificado emitido com sucesso. Renovação automática configurada via `cloudflare.ini` (chmod 600, credentials protegidas).

---

### 7. Dashboard operacional exposto em `www.recrutapadrao.com.br`

**Problema:** Após a correção do SSL, `https://www.recrutapadrao.com.br` exibia o dashboard operacional interno (Biblioteca Militar, QD Curriculum, QD Factory) em vez da homepage pública.

**Diagnóstico:** O VirtualHost Nginx declarava `server_name recrutapadrao.com.br www.recrutapadrao.com.br` no mesmo bloco, com `proxy_pass http://127.0.0.1:3001` para ambos. O apex era interceptado pelo Worker (que servia a homepage correta), mas o `www.` chegava ao Nginx e era roteado para o app operacional (porta 3001 → `recruta-padrao-os` → redirect `/quartel`).

**Correção:** Divisão do VirtualHost em quatro blocos separados:
- `recrutapadrao.com.br` (porta 443 e 80) → mantém proxy para porta 3001 (fallback do Worker)
- `www.recrutapadrao.com.br` (porta 443 e 80) → `return 301 https://recrutapadrao.com.br$request_uri`

**Resultado:** `www.` redireciona permanentemente para o apex. Dashboard operacional não acessível publicamente via `www.`.

---

### 8. Nginx Host header hardcoded

**Problema:** O VirtualHost tinha `proxy_set_header Host os.recrutapadrao.com.br` em vez de `$host`, fazendo o app pensar que estava rodando em `os.recrutapadrao.com.br` independentemente do domínio solicitado.

**Diagnóstico:** Header `Host` hardcoded introduzido durante configuração inicial do VirtualHost para o domínio operacional.

**Correção:** Substituição por `proxy_set_header Host $host` nos dois blocos (443 e 80).

**Resultado:** Aplicação recebe corretamente o domínio solicitado no header `Host`.

---

## Estado atual

| Dimensão | Status | Observação |
|---|---|---|
| **Infraestrutura** | ✅ Estável | Todos os componentes online e validados |
| **Funil** | ✅ Operacional | Ponta a ponta validado com tráfego real de iPhone |
| **Segurança** | ✅ Base estabelecida | SSL, Cloudflare Full Strict, credenciais protegidas. Pendência: security headers HTTP, rate limiting |
| **Escalabilidade** | ⚠️ Limitada | Arquitetura single-instance, API síncrona (~7s). Suficiente para fase atual |
| **Confiabilidade** | ✅ Operacional | Zero erros em produção. Sem monitoramento automático ainda |

---

## Decisão arquitetural

A partir desta data, **a infraestrutura entra em modo de estabilidade.**

Alterações de infraestrutura somente serão realizadas quando houver necessidade comprovada por:
- falha em produção
- limitação de escalabilidade mensurável
- requisito de segurança identificado
- novo domínio ou serviço aprovado

O foco do projeto passa a ser **evolução de produto**, nas seguintes frentes em ordem de prioridade:

1. **Portal principal** — homepage do Recruta Padrão com SEO estruturado
2. **Landings por força** — Marinha, Exército, Aeronáutica (funis individuais)
3. **Biblioteca Estratégica** — conteúdo educacional indexado
4. **Automação de relacionamento** — nurturing via WhatsApp (n8n / webhooks)
5. **Quartel Digital** — plataforma operacional interna consolidada

---

## Lições aprendidas

### Decisões corretas

**DNS-01 em vez de HTTP-01 para Cloudflare Worker.** A tentativa de usar HTTP-01 teria bloqueado o projeto indefinidamente: o Worker intercepta todos os paths, incluindo `/.well-known/acme-challenge/`. Reconhecer rapidamente que a solução era DNS-01 evitou uma série de gambiarras (desabilitar Worker temporariamente, usar modo Cloudflare Flexible, etc.).

**Cloudflare Full (Strict) desde o início.** Manter o modo mais restritivo forçou a correção real do SSL em vez de mascarar o problema com Flexible ou Full. O ambiente ficou corretamente seguro sem atalhos.

**Não alterar DNS, Worker, PM2 e aplicações em paralelo.** A disciplina de isolar cada correção (Nginx, depois DNS, depois SSL, depois redirect) permitiu identificar a causa raiz de cada erro sem criar novos problemas por interação de mudanças.

**Variáveis de ambiente em `.env.local` + `--update-env`.** Separar configuração de código é correto. A descoberta de que o PM2 não recarrega env vars sem `--update-env` foi um aprendizado pontual, não uma falha de arquitetura.

### Erros cometidos

**VirtualHost com dois domínios no mesmo bloco.** Colocar `recrutapadrao.com.br` e `www.recrutapadrao.com.br` no mesmo `server_name` era aceitável enquanto os dois tinham o mesmo comportamento. Quando passaram a ter comportamentos distintos (Worker vs. proxy direto), o bloco único tornou-se um problema. Domínios com rotas diferentes devem ter blocos separados desde o início.

**Certificado SSL reaproveitado de outro domínio.** Usar o certificado `os.recrutapadrao.com.br` para servir `recrutapadrao.com.br` e `www.` criou o Error 526 inevitável. Cada domínio principal deve ter seu próprio certificado com SANs corretos desde a primeira implantação.

**`proxy_set_header Host` hardcoded.** Copiar um bloco Nginx de um domínio para outro sem revisar os headers é um erro silencioso — não quebra imediatamente, mas causa comportamento incorreto que é difícil de rastrear.

### Retrabalhos evitados

- Não foi necessário alterar o Cloudflare Worker existente em nenhum momento.
- Não foi necessário reconfigurar o Supabase ou a instância Evolution após a primeira configuração correta.
- O funil de código (`/api/leads`) não exigiu nenhuma alteração — funcionou corretamente desde a primeira versão.

### Recomendações para futuras implantações

1. **Certificado antes de configurar Cloudflare Full (Strict).** Emitir o certificado para o domínio correto antes de ativar o proxy Cloudflare, evitando Error 526 logo na ativação.
2. **VirtualHost separado por subdomínio desde o início** quando os subdomínios tiverem comportamentos distintos.
3. **Testar `/.well-known/acme-challenge/` antes de escolher o método Certbot.** Se houver Worker ou proxy que intercepte paths, usar DNS-01 diretamente.
4. **Validar `connectionStatus` da Evolution antes de declarar o funil pronto.** A instância pode estar criada mas desconectada.
5. **Configurar `pm2 save` após cada mudança de configuração** para garantir que o estado correto seja restaurado após reboot.

---

## Próximo marco

### MARCO DE PRODUÇÃO Nº 002 — Portal Recruta Padrão

O próximo grande objetivo do projeto será a construção e publicação do Portal Recruta Padrão, contemplando:

- **Arquitetura definitiva** — estrutura de rotas, SEO técnico, sitemap, robots.txt
- **Landing Marinha do Brasil** — funil específico para candidatos ao internato
- **Landing Exército Brasileiro** — funil específico para incorporação
- **Landing Força Aérea Brasileira** — funil específico para EEAR/EPCAR
- **Biblioteca Estratégica** — hub de conteúdo educacional indexado por força e tema
- **Integração com Quartel Digital** — SSO ou deep link para acesso à plataforma interna
- **Automação de relacionamento** — sequência de mensagens WhatsApp pós-cadastro via n8n
- **Analytics** — Google Analytics 4 ou Plausible integrado ao funil

---

## Conclusão

> **O Recruta Padrão deixa oficialmente a fase de infraestrutura e entra na fase de evolução de produto.**

A cadeia completa — da landing ao WhatsApp, passando por Supabase, Evolution API e entrega de PDF — foi validada em produção com tráfego real de um dispositivo físico (iPhone · Chrome iOS), sem erros, sem intervenção manual e sem falhas nos logs.

A infraestrutura está documentada, os domínios estão configurados, os certificados estão emitidos e a renovação automática está em operação. O que se segue é construir produto sobre essa base.

---

*Documento gerado em 02/07/2026 — Recruta Padrão / Quartel Digital*
