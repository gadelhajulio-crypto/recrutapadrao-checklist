# Plano de Execução — Auditoria Landing Page Checklist do Internato

**Data de início estimada:** 28/06/2026
**Duração total:** 4 sprints · ~6 semanas

---

## Visão geral

| Sprint | Duração | Foco | Ganho esperado |
|---|---|---|---|
| Sprint 1 | 3–5 dias | Bloqueadores críticos + quick wins | +55–80% conversão |
| Sprint 2 | 1–2 semanas | Leads, prova social, copywriting, legal | +40–60% adicional |
| Sprint 3 | 1–2 semanas | SEO técnico, acessibilidade, analytics | +15–20% adicional |
| Sprint 4 | 2–3 semanas | Crescimento, automação, escalabilidade | +20–30% adicional |

---

## Sprint 1 — Destravar o funil

**Objetivo:** Eliminar os bloqueadores que tornam a landing page disfuncional. Nenhuma métrica de conversão é válida enquanto leads não são capturados e o hero exibe um placeholder.

**Duração estimada:** 3–5 dias

### Tarefas

#### Dia 1 — Correções triviais (< 2h total)

| ID | Tarefa | Arquivo | Ação |
|---|---|---|---|
| QW1 | Remover `console.log` com dados pessoais | `ChecklistForm.tsx:112` | Deletar a linha |
| QW2 | Corrigir redirect para 301 | `next.config.ts:9` | `permanent: false` → `permanent: true` |
| QW3 | Restaurar keyword no title | `page.tsx:5` | `'Checklist do Internato Marinha do Brasil \| Quartel Digital'` |
| QW5 | Confirmar SITE_URL no ambiente | `.env.local` | `NEXT_PUBLIC_SITE_URL=https://checklist.recrutapadrao.com.br` |
| QW4 | Confirmar WhatsApp configurado | `.env.local` | Verificar `NEXT_PUBLIC_WHATSAPP_NUMBER` |

#### Dia 2 — Hero e copywriting do formulário (2–4h)

| ID | Tarefa | Arquivo | Ação |
|---|---|---|---|
| QW6 | Remover placeholder de imagem | `page.tsx` | Remover a `<div>` placeholder. Layout de coluna única até imagem real. |
| QW7 | Melhorar headline do formulário | `page.tsx` | De "Preencha para receber o material" para copy orientado a benefício |
| QW8 | Melhorar tela de sucesso | `ChecklistForm.tsx` | H2 e body com linguagem humana e expectativa clara |
| QW9 | Microcopy de privacidade | `ChecklistForm.tsx` | Linha abaixo do botão: "Sem spam. Seus dados são protegidos." |
| QW10 | Prova de volume (placeholder) | `page.tsx` | Adicionar número conservador: "+ de 500 recrutas já baixaram" |

#### Dia 3–5 — Ativar captura de leads (M — 4–8h)

| ID | Tarefa | Arquivo | Ação |
|---|---|---|---|
| MP1 | Ativar Supabase | `lib/supabase.ts` + `ChecklistForm.tsx` | Descomentar código, instalar `@supabase/supabase-js`, configurar credenciais, chamar `saveLead(payload)` no handleSubmit |

**Pré-requisito:** credenciais Supabase (`NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### Ganho esperado — Sprint 1

| Métrica | Antes | Depois |
|---|---|---|
| Leads capturados em banco | 0% | 100% |
| CTR orgânico (keyword "Marinha do Brasil") | Baixo | +20–35% |
| PageRank dos backlinks externos | 0% | 100% |
| Risco LGPD (console.log) | Presente | Eliminado |
| Conversão hero | Prejudicada pelo placeholder | Restaurada |
| **Conversão geral estimada** | 2–5% | **5–9%** |

---

## Sprint 2 — Credibilidade e conversão

**Objetivo:** Aumentar a taxa de conversão através de prova social real, copy persuasivo, urgência autêntica e conformidade legal mínima.

**Duração estimada:** 1–2 semanas

### Tarefas

#### Semana 1 — Prova social e copywriting

| ID | Tarefa | Arquivo | Observação |
|---|---|---|---|
| MP3 | Coletar 3–5 depoimentos reais | Conteúdo externo | Nome + ano + estado + resultado quantificável. Foto opcional mas recomendada. |
| MP4 | Reposicionar prova social no hero | `page.tsx` | Pelo menos 1 depoimento logo abaixo do H1 |
| MP15 | Eliminar seção de benefícios duplicada | `page.tsx` | Manter apenas a seção de cards, remover a de bullets |
| MP2 | Criar og-image.png | `public/` | 1200×630px com logo + título "Checklist do Internato · Marinha do Brasil" + CTA visual |
| E2 | Substituir placeholder por foto real no hero | `page.tsx` + `public/` | Foto de domínio público (site da Marinha) ou ilustração vetorial |

#### Semana 2 — Conformidade legal e refinamentos

| ID | Tarefa | Arquivo | Observação |
|---|---|---|---|
| MP12 | Redigir Política de Privacidade mínima | `app/privacidade/page.tsx` | Cobrir: finalidade da coleta, destinatários, prazo de retenção, direitos do titular (LGPD Art. 9º) |
| MP13 | Redigir Termos de Uso mínimos | `app/termos/page.tsx` | Uso do material, limitação de responsabilidade, propriedade intelectual |
| MP14 | Mover CSS inline para globals.css | `globals.css` + ambas as páginas | Classe `.policy-page` substitui as `<style>` inline duplicadas |
| MP10 | Microcopy no campo "Força de interesse" | `ChecklistForm.tsx` | `"Para enviarmos materiais da sua Força"` abaixo do select |
| MP11 | Restaurar distinção obrigatório/opcional | `ChecklistForm.tsx` | Asterisco em nome e whatsapp + legenda `"* Campo obrigatório"` |

### Ganho esperado — Sprint 2

| Métrica | Antes | Depois |
|---|---|---|
| Credibilidade (prova social) | 1 depoimento anônimo | 3–5 com identidade real |
| CTR de compartilhamentos | Sem imagem (card em branco) | +40–60% com og-image real |
| Conformidade LGPD | Páginas "em construção" | Política e Termos vigentes |
| Fricção no formulário | Média | Reduzida |
| **Conversão geral estimada** | 5–9% | **8–15%** |

---

## Sprint 3 — SEO técnico e acessibilidade

**Objetivo:** Completar a estrutura técnica de SEO e garantir acessibilidade básica (WCAG 2.1 AA). Tarefas sem dependências externas — podem ser feitas em paralelo.

**Duração estimada:** 1 semana

### Tarefas

| ID | Tarefa | Arquivo | Esforço |
|---|---|---|---|
| MP5 | Adicionar canonical URL | `page.tsx` | XS |
| E3 | Adicionar Structured Data (JSON-LD) | `page.tsx` | S |
| E4 | Criar sitemap.xml | `app/sitemap.ts` | S |
| MP6 | Adicionar skip navigation link | `app/layout.tsx` + `globals.css` | XS |
| MP7 | Adicionar `aria-required` nos campos obrigatórios | `ChecklistForm.tsx` | S |
| MP8 | Adicionar `autocomplete` nos campos | `ChecklistForm.tsx` | XS |
| MP9 | Implementar máscara no campo WhatsApp | `ChecklistForm.tsx` | S |
| MP16 | Implementar eventos GA4: `form_start`, `form_submit`, `whatsapp_click` | `ChecklistForm.tsx` | S |
| MP17 | Adicionar favicon.ico e apple-touch-icon.png | `public/` | S |
| MP18 | Corrigir `.gitignore` — proteger `.claude/docs/` | `.gitignore` | XS |
| E5 | Ativar Meta Pixel | `app/layout.tsx` + `.env.local` | S |

### Canonical URL (implementação)

```tsx
// page.tsx — adicionar em generateMetadata:
alternates: {
  canonical: 'https://checklist.recrutapadrao.com.br/checklist',
},
```

### Structured Data (implementação)

```tsx
// page.tsx — adicionar script JSON-LD:
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Checklist do Internato Marinha do Brasil',
  description: 'Material gratuito com roteiro completo de preparação para o internato das Forças Armadas.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock',
  },
}
```

### Ganho esperado — Sprint 3

| Métrica | Antes | Depois |
|---|---|---|
| Canonical URL | Ausente | Definida |
| Rich results elegíveis | Não | Sim (Structured Data) |
| Acessibilidade WCAG 2.1 | Parcial | AA para campos auditados |
| Dados GA4 customizados | Nenhum evento | form_start, form_submit, whatsapp_click |
| **Melhoria estimada em tráfego orgânico** | Baseline | **+15–25%** |

---

## Sprint 4 — Crescimento e escalabilidade

**Objetivo:** Com funil validado e métricas funcionando, escalar conversão via automação, testes e segmentação.

**Duração estimada:** 2–3 semanas

### Tarefas

| ID | Tarefa | Esforço | Dependência | Observação |
|---|---|---|---|---|
| E7 | Contador de downloads em tempo real (Supabase → UI) | M | MP1 | Mostrar número real de leads capturados |
| E1 | Entrega automática do PDF após submit | L | MP1 | Link público no Supabase Storage ou Google Drive. Enviar via WhatsApp automático ou email |
| E6 | A/B test na headline do H1 | L | MP1 | Precisa de volume de tráfego para significância estatística. Tool: Vercel Edge Config ou feature flag manual |
| E8 | Landing pages por força militar | XL | MP1 | `/marinha`, `/exercito`, `/aeronautica` — cada uma com H1, eyebrow, title e OG personalizados. Benefício: SEO por keyword + conversão por segmento |
| E9 | WhatsApp Business API para entrega automática | XL | E1 | Elimina a dependência de resposta humana. Requer conta Business API verificada |

### Marcos do Sprint 4

```
Semana 1:
  - Contador dinâmico de downloads ao vivo
  - Entrega automática do PDF configurada
  - Primeiras métricas GA4 analisadas

Semana 2:
  - A/B test ativo com variante de H1
  - Volume suficiente para primeiros dados (meta: 100+ conversões)

Semana 3:
  - Análise dos resultados do A/B test
  - Decisão: escalar winner ou iterar
  - Planejamento das landing pages por força (se validado o canal)
```

### Ganho esperado — Sprint 4

| Métrica | Estimativa |
|---|---|
| Taxa de entrega do material (automação) | +30–50% vs. manual |
| Conversão com urgência dinâmica real | +10–15% |
| Conversão por landing page segmentada | +20–40% por segmento |
| **Conversão geral estimada (acumulado)** | **12–22%** |

---

## Cronograma Consolidado

```
Semana 1    Sprint 1 — Destravar o funil
            ├── Dia 1: QW1, QW2, QW3, QW4, QW5 (triviais — < 2h)
            ├── Dia 2: QW6, QW7, QW8, QW9, QW10 (hero + copy — 2–4h)
            └── Dia 3–5: MP1 — Ativar Supabase

Semana 2–3  Sprint 2 — Credibilidade e conversão
            ├── Sem 2: MP3, MP4, MP15, MP2, E2 (prova social + imagens)
            └── Sem 3: MP12, MP13, MP14, MP10, MP11 (legal + refinamentos)

Semana 4    Sprint 3 — SEO técnico e acessibilidade
            └── MP5, E3, E4, MP6, MP7, MP8, MP9, MP16, MP17, MP18, E5

Semana 5–7  Sprint 4 — Crescimento
            ├── Sem 5: E7, E1 (automação)
            ├── Sem 6: E6 (A/B test)
            └── Sem 7: análise + decisão E8/E9
```

---

## Critérios de sucesso por sprint

| Sprint | Critério de conclusão |
|---|---|
| Sprint 1 | Leads capturados no Supabase, console.log removido, 301 ativo, placeholder eliminado |
| Sprint 2 | 3+ depoimentos reais publicados, og-image.png ao vivo, Política de Privacidade vigente |
| Sprint 3 | Canonical definido, structured data validado no Rich Results Test do Google, eventos GA4 ativos |
| Sprint 4 | PDF entregue automaticamente em < 60s após submit, A/B test rodando com tráfego real |

---

## Pré-requisitos externos

Antes de iniciar, confirmar disponibilidade de:

- [ ] Credenciais Supabase (URL + ANON_KEY)
- [ ] Número WhatsApp Business configurado (`NEXT_PUBLIC_WHATSAPP_NUMBER`)
- [ ] Foto autorizada de recrutas para o hero
- [ ] Depoimentos reais coletados (Sprint 2)
- [ ] Assessoria para rascunho de Política de Privacidade (Sprint 2) — pode-se usar template público da ANPD como base
- [ ] Conta Meta Business para ativar Pixel (Sprint 3)
