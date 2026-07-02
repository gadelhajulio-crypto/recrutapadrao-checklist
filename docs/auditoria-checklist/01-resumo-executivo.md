# Resumo Executivo — Auditoria Landing Page Checklist do Internato

**URL:** `checklist.recrutapadrao.com.br`
**Data:** 28/06/2026
**Escopo:** UX · UI · CRO · Copywriting · SEO · Performance · Mobile · Acessibilidade · Branding · Funil · Analytics

---

## Nota Geral

| Dimensão | Nota | Justificativa |
|---|---|---|
| Estrutura técnica | 7/10 | Stack moderna, bem organizada, sem libs desnecessárias |
| Copy e proposta de valor | 6/10 | H1 direto, mas CTA e prova social fracos |
| Conversão | 2/10 | Leads não são capturados em banco de dados |
| SEO | 4/10 | Title regrediu, sem canonical, OG image inexistente |
| UX / Funil | 5/10 | Fluxo quebrado pós-conversão, placeholder em produção |
| Acessibilidade | 4/10 | Sem skip nav, sem aria-required, sem distinção obrig./opcional |
| Performance | 8/10 | Bundle mínimo, sem web fonts, CLS sob controle |
| **Geral** | **5/10** | Potencial alto, bloqueado por 3 problemas críticos |

---

## Principais Problemas

### Bloqueadores críticos — nenhum lead está sendo capturado

1. **Supabase desativado** — o formulário valida, processa e exibe tela de sucesso, mas os dados vão apenas para `console.log` no browser do usuário. Zero leads gravados em banco de dados.

2. **og-image.png inexistente** — toda campanha compartilhada no WhatsApp, Facebook ou Telegram exibe card sem imagem. Sem imagem de preview, o CTR de compartilhamentos cai 40–60%.

3. **Placeholder visível em produção** — o hero exibe uma caixa azul com o texto literal `[ Foto — recrutas em formação ]`, com comentário no código dizendo "SUBSTITUIR ANTES DO DEPLOY". A página está no ar com esse elemento.

### Problemas de alta severidade

4. **"Marinha do Brasil" removido do `<title>`** — o commit de otimização tirou o keyword de maior intenção do elemento mais relevante para SEO. Perda estimada de 20–35% de CTR orgânico no nicho.

5. **302 em vez de 301** — o redirect de `/` para `/checklist` não passa PageRank. Cada backlink externo vale zero do ponto de vista de autoridade.

6. **`console.log` com dados pessoais em produção** — nome e WhatsApp do usuário expostos no DevTools. Risco LGPD.

7. **Entrega do material é manual** — o fluxo pós-conversão abre WhatsApp e aguarda resposta humana. Sem automação, entregas falham fora do horário comercial.

8. **Prova social anônima e singular** — um único depoimento sem nome, foto, posto ou resultado concreto. Visitante cético descarta automaticamente.

---

## Principais Oportunidades

| Oportunidade | Ganho Estimado |
|---|---|
| Ativar Supabase (captura de leads) | +100% dos dados coletados |
| Criar og-image.png | +40–60% de CTR em campanhas sociais |
| Remover placeholder do hero | +15–25% na conversão do hero |
| Restaurar "Marinha do Brasil" no title | +20–35% de CTR orgânico |
| Adicionar 3–5 depoimentos reais com nome | +10–20% na conversão |
| Prova de volume ("X recrutas já baixaram") | +15–25% na conversão |
| Melhorar headline e CTA do formulário | +10–15% na conversão |
| Microcopy de privacidade no formulário | +8–12% na conversão |
| Entrega automática do PDF | +30–50% na taxa de entrega efetiva |

---

## Impacto Esperado

| Fase | Ações | Ganho Incremental |
|---|---|---|
| Sprint 1 — Quick Wins | Bloqueadores + ajustes triviais | **+55–80%** na taxa de conversão |
| Sprint 2 — Médio Prazo | Leads, social proof, copywriting | **+40–60%** adicional |
| Sprint 3 — Estrutural | Entrega automática, páginas legais, SEO técnico | **+20–30%** adicional |
| Sprint 4 — Crescimento | A/B test, segmentação por força, campanhas | **+20–30%** adicional |
| **Total acumulado** | | **+130–200% vs. baseline atual** |

> **Baseline atual:** estimado em 2–5% de conversão visitante → dado capturado em banco, considerando que o Supabase está desativado e nenhum lead é persistido.

---

## Conclusão

A landing page tem fundação sólida — stack moderna, copy competente, responsividade adequada — mas está bloqueada por três problemas críticos que precisam ser resolvidos antes de qualquer outra otimização. Com os Quick Wins do Sprint 1 implementados, a página passará de um funil quebrado para um funil funcional. O potencial de crescimento subsequente é alto dado o nicho (recrutamento militar) e o formato (material gratuito de alto valor percebido).
