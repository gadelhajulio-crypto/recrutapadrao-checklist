# Backlog Priorizado — Auditoria Landing Page Checklist do Internato

**Critério de ordenação:** relação impacto/esforço (maior primeiro)
**Data:** 28/06/2026

---

## Legenda

| Impacto | Significado |
|---|---|
| 🔴 Crítico | Bloqueia conversão ou gera risco legal |
| 🟠 Alto | Afeta significativamente métricas de negócio |
| 🟡 Médio | Melhoria relevante, sem urgência crítica |
| 🟢 Baixo | Refinamento ou boa prática |

| Esforço | Significado |
|---|---|
| XS | < 30 minutos |
| S | 30min a 2h |
| M | 2h a 1 dia |
| L | 1 a 3 dias |
| XL | > 3 dias |

---

## Backlog

| ID | Melhoria | Impacto | Esforço | Prioridade | Dependências |
|---|---|---|---|---|---|
| QW1 | Remover `console.log` com dados pessoais do usuário em produção (`ChecklistForm.tsx:112`) | 🔴 Crítico (LGPD) | XS | P0 | — |
| QW2 | Corrigir redirect para 301 permanente (`next.config.ts`: `permanent: true`) | 🟠 Alto (SEO) | XS | P0 | — |
| QW3 | Restaurar "Marinha do Brasil" no `<title>` tag (`page.tsx`: título absoluto) | 🟠 Alto (SEO) | XS | P0 | — |
| QW4 | Validar e confirmar `NEXT_PUBLIC_WHATSAPP_NUMBER` configurado no `.env.local` | 🔴 Crítico (funil) | XS | P0 | — |
| QW5 | Confirmar `NEXT_PUBLIC_SITE_URL=https://checklist.recrutapadrao.com.br` no `.env.local` | 🟠 Alto (SEO/OG) | XS | P0 | — |
| QW6 | Remover placeholder de imagem do hero (ou substituir por layout de coluna única até imagem real) | 🔴 Crítico (UX) | S | P0 | — |
| QW7 | Melhorar headline do formulário: de "Preencha para receber" para copy orientado a benefício | 🟠 Alto (CRO) | XS | P1 | — |
| QW8 | Melhorar tela de sucesso: H2 e body com linguagem humana e expectativa clara de entrega | 🟠 Alto (CRO) | XS | P1 | — |
| QW9 | Adicionar microcopy de privacidade abaixo do botão de submit ("Sem spam. Dados protegidos.") | 🟠 Alto (CRO) | XS | P1 | — |
| QW10 | Adicionar prova de volume próximo ao H1 ou formulário ("+ de X recrutas já baixaram") | 🟠 Alto (CRO) | XS | P1 | MP3 (para número real) |
| MP1 | Ativar integração Supabase para captura de leads (`lib/supabase.ts` + `ChecklistForm.tsx`) | 🔴 Crítico (dados) | M | P0 | Credenciais Supabase |
| MP2 | Criar `og-image.png` (1200×630px) com logo + título + CTA e adicionar em `public/` | 🟠 Alto (marketing) | S | P1 | QW5 |
| MP3 | Coletar 3–5 depoimentos reais com nome, ano, estado e resultado. Implementar na página | 🟠 Alto (CRO) | M | P1 | Conteúdo externo |
| MP4 | Reposicionar prova social: mover pelo menos um depoimento para logo abaixo do H1 | 🟠 Alto (CRO) | S | P2 | MP3 |
| MP5 | Adicionar canonical URL no metadata (`page.tsx`) | 🟡 Médio (SEO) | XS | P2 | QW5 |
| MP6 | Adicionar skip navigation link para acessibilidade (WCAG 2.4.1) | 🟡 Médio (a11y) | XS | P2 | — |
| MP7 | Adicionar `aria-required="true"` e indicadores visuais nos campos obrigatórios | 🟡 Médio (a11y) | S | P2 | — |
| MP8 | Adicionar `autocomplete="name"` e `autocomplete="tel"` nos campos do formulário | 🟡 Médio (a11y/UX) | XS | P2 | — |
| MP9 | Adicionar máscara de formatação no campo WhatsApp | 🟡 Médio (UX) | S | P2 | — |
| MP10 | Adicionar microcopy explicativo no campo "Força de interesse" | 🟡 Médio (UX) | XS | P2 | — |
| MP11 | Restaurar label `(opcional)` na `forca_interesse` ou adicionar asterisco em campos obrigatórios | 🟡 Médio (UX/a11y) | XS | P2 | — |
| MP12 | Redigir Política de Privacidade mínima para `/privacidade` (LGPD Art. 6º) | 🟠 Alto (legal) | M | P1 | Assessoria jurídica ou template |
| MP13 | Redigir Termos de Uso mínimos para `/termos` | 🟡 Médio (legal) | M | P2 | MP12 |
| MP14 | Mover CSS inline duplicado de `/privacidade` e `/termos` para `globals.css` como `.policy-page` | 🟢 Baixo (manutenção) | XS | P3 | — |
| MP15 | Eliminar seção de benefícios duplicada — manter apenas a de cards | 🟡 Médio (UX) | S | P2 | — |
| MP16 | Implementar eventos GA4 customizados: `form_start`, `form_submit`, `whatsapp_click` | 🟡 Médio (analytics) | S | P2 | MP1 |
| MP17 | Adicionar `favicon.ico` (32×32) e `apple-touch-icon.png` (180×180) em `public/` | 🟢 Baixo (branding) | S | P3 | — |
| MP18 | Corrigir `.gitignore`: reverter `.claude/` para `.claude/settings.local.json` + `.claude/skills/` | 🟢 Baixo (dev) | XS | P3 | — |
| E1 | Entrega automática do PDF após submit (link Supabase Storage ou Google Drive) | 🔴 Crítico (funil) | L | P1 | MP1 |
| E2 | Substituir placeholder por foto real no hero (recrutas em formação — uso autorizado) | 🔴 Crítico (UX) | M | P1 | Imagem disponível |
| E3 | Adicionar Structured Data (Schema.org: `WebPage` + `Offer` gratuita) | 🟡 Médio (SEO) | S | P2 | — |
| E4 | Criar `sitemap.xml` e customizar `robots.txt` | 🟡 Médio (SEO) | S | P3 | — |
| E5 | Ativar Meta Pixel (`META_PIXEL_ID` já no `.env.example`) | 🟡 Médio (marketing) | S | P3 | — |
| E6 | A/B test na headline do H1: versão atual vs. alternativa com pain point | 🟠 Alto (CRO) | L | P3 | MP1 (para dados) |
| E7 | Urgência dinâmica: contador de downloads em tempo real via Supabase | 🟡 Médio (CRO) | M | P3 | MP1 |
| E8 | Landing pages separadas por força (Marinha, Exército, Aeronáutica) | 🟠 Alto (SEO/CRO) | XL | P4 | MP1 |
| E9 | Integrar API do WhatsApp Business para envio automático do PDF | 🟠 Alto (funil) | XL | P4 | E1 |

---

## Resumo por Prioridade

| Prioridade | Quantidade | Foco |
|---|---|---|
| P0 — Bloqueadores | 6 itens (QW1–QW6, MP1) | Corrigir antes de qualquer tráfego |
| P1 — Alta prioridade | 9 itens | Conversão, dados, legal |
| P2 — Médio prazo | 12 itens | UX, acessibilidade, SEO técnico |
| P3 — Refinamento | 7 itens | Analytics, branding, SEO avançado |
| P4 — Crescimento | 2 itens | Escala e segmentação |

---

## Razão impacto/esforço (Top 10)

| # | ID | Razão |
|---|---|---|
| 1 | QW2 | P0 — 1 palavra muda, +SEO permanente |
| 2 | QW3 | P0 — 1 linha muda, +keyword crítica |
| 3 | QW1 | P0 — 1 linha remove risco legal |
| 4 | QW5 | P0 — config de env, impacto global em OG |
| 5 | QW9 | P1 — 1 linha de texto, +8–12% conversão |
| 6 | MP5 | P2 — 2 linhas de código, SEO técnico completo |
| 7 | QW7 | P1 — 1 string alterada, +10–15% conversão form |
| 8 | MP8 | P2 — 2 atributos HTML, UX + acessibilidade |
| 9 | MP6 | P2 — 1 link + CSS, WCAG 2.4.1 resolvido |
| 10 | MP11 | P2 — 1 label, clareza UX + WCAG 3.3.2 |
