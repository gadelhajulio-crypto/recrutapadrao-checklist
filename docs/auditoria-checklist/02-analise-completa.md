# Análise Completa — Auditoria Landing Page Checklist do Internato

**URL:** `checklist.recrutapadrao.com.br`
**Stack:** Next.js 15 · React 19 · TypeScript · App Router · Vanilla CSS
**Data:** 28/06/2026

---

## 1. UX — Experiência do Usuário

### Hierarquia visual

O fluxo atual da página:

```
Header → [H1 + texto] → [PLACEHOLDER DE IMAGEM] → [PDF mockup]
→ "O que você vai receber" → "O que vai descobrir"
→ Credibilidade → Prova Social → Formulário → Footer
```

**Problemas:**

- **Placeholder em produção** — A caixa azul com `[ Foto — recrutas em formação ]` é o primeiro elemento visual after o H1. Destrói a primeira impressão de credibilidade.
- **Objeto de desejo posicionado errado** — O mockup do PDF aparece depois do CTA mobile, quando deveria aparecer antes para criar covet (eu quero isso).
- **Prova social tardia** — O único depoimento está posicionado depois da seção de credibilidade. Prova social ancora proposta de valor; deveria aparecer no início, não no fim.
- **Seção de benefícios duplicada** — "O que você vai receber" (bullets) e "O que vai descobrir em menos de 5 minutos" (cards) têm conteúdo quase idêntico, diluindo o impacto de cada seção e aumentando o scroll desnecessário.
- **Formulário invisível sem scroll no mobile** — O CTA do hero faz scroll suave para o formulário, o que é correto, mas não há indicadores visuais intermediários que incentivem o scroll espontâneo.

**Hierarquia ideal:**

```
Header → [H1 + proposta de valor] → [Prova social #1 — imediata]
→ [PDF mockup + O que você vai receber] → [Benefícios sem duplicação]
→ [Credibilidade + autoridade] → [Prova social #2, #3]
→ [Formulário com urgência] → Footer
```

### Funil pós-conversão quebrado

O fluxo após o submit do formulário:

1. Usuário preenche e envia o formulário
2. Tela de sucesso aparece com botão "Entrar no Grupo do WhatsApp"
3. Usuário clica e abre WhatsApp
4. **Aguarda resposta manual** de alguém

Problemas:
- Sem automação, entregas falham fora do horário comercial
- O usuário não sabe que precisará esperar
- Qualquer delay resulta em abandono
- Se `NEXT_PUBLIC_WHATSAPP_NUMBER` estiver vazio, o link `wa.me/?text=...` é inválido

---

## 2. UI — Interface do Usuário

### Pontos positivos

- CSS responsivo bem estruturado com breakpoints em 340px, 768px, 1024px e 1440px
- `prefers-reduced-motion` implementado
- Variáveis CSS organizadas e consistentes
- Sem dependências de UI frameworks — bundle enxuto

### Pontos negativos

- **Placeholder de imagem** — caixa com borda dashed e texto literal de desenvolvimento visível em produção
- **Fonte sistema genérica** — `system-ui, -apple-system, 'Segoe UI'` é funcional mas transmite zero autoridade institucional para o público militar. Inter ou Roboto Condensed reforçariam o branding
- **Favicon incompleto** — apenas `favicon.svg`. Browsers legados (Samsung Internet, UC Browser) não renderizam SVG como favicon; ausência de `apple-touch-icon.png` (180×180) faz com que salvar na tela inicial do iPhone exiba screenshot ao invés do ícone
- **CSS duplicado** — as páginas `/privacidade` e `/termos` têm blocos `<style>` inline idênticos que deveriam estar em `globals.css` como `.policy-page`

---

## 3. Copywriting

### H1 e proposta de valor

O H1 atual é direto e tem o keyword principal. A proposta de valor ("gratuito", "específico para o internato") está presente no subheadline.

**Problema:** eyebrow diz `"Checklist Gratuito · Marinha do Brasil"` mas o formulário oferece opções para Exército e Aeronáutica. Visitante buscando informações do Exército pode sentir que o material não é para ele.

### CTAs e microcopy

| Elemento | Atual | Problema |
|---|---|---|
| Form headline | "Preencha para receber o material" | Instruction-oriented, sem benefício |
| Botão submit | "Receber o Checklist Gratuito" | OK — claro e direto |
| Success H2 | "Cadastro realizado com sucesso." | Frio e burocrático |
| Success body | "Clique abaixo para entrar em contato" | Não explica o que vai acontecer |

**Sugestões:**

```
Form headline: "Onde enviamos o seu Checklist?"
ou: "Receba seu Checklist agora — é gratuito"

Success H2: "Pronto! Seu Checklist está a caminho."
Success body: "Clique abaixo para abrir o WhatsApp e receber o material em segundos."
```

### Urgência e prova de volume

A página não cria nenhuma razão para agir agora. Ausentes:
- Contador de downloads ("Mais de 1.200 recrutas já baixaram")
- Urgência temporal ("Disponível gratuitamente até [data]")
- FOMO ("Recrutas que chegam preparados têm vantagem clara")
- Garantia de entrega ("Receba em segundos, sem spam")

### Prova social

Um único depoimento anônimo com:
- Sem nome (nem inicial + sobrenome)
- Sem foto
- Sem posto ou especialização
- Sem resultado quantificável
- Sem ano de incorporação ou estado

O visitante cético desconta automaticamente depoimentos sem identificação. Qualquer marcador de identidade — mesmo `"J.S., recruta 2024, Escola de Aprendizes-Marinheiros de SC"` — aumenta a credibilidade.

---

## 4. CRO — Otimização de Conversão

### Gatilhos psicológicos presentes

| Gatilho | Status |
|---|---|
| Reciprocidade (material gratuito) | ✅ Presente |
| Autoridade (menção a 40+ fontes) | ✅ Presente |
| Clareza de proposta (H1 direto) | ✅ Presente |
| Prova social | ⚠️ Presente, mas fraca |

### Gatilhos ausentes

| Gatilho | Impacto Estimado |
|---|---|
| Urgência / Escassez | -15 a -25% conversão |
| Prova de volume ("X já baixaram") | -10 a -15% conversão |
| Garantia de entrega ("Receba em segundos") | -8 a -12% conversão |
| Identidade social ("Recrutas preparados...") | -5 a -10% conversão |
| Microcopy de privacidade no formulário | -8 a -12% conversão |

### Fricção no formulário

- Campo "Força de interesse" sem justificativa de por que é pedido — aumenta percepção de invasão de privacidade. Adicionar: `"Para enviarmos materiais da sua Força"`
- Sem máscara no campo WhatsApp — usuário digita `11999999999` sem feedback de formatação
- Sem distinção visual entre campos obrigatórios e opcionais (label `(opcional)` foi removida)
- Sem microcopy de privacidade abaixo do botão

---

## 5. SEO

### Análise de elementos técnicos

| Elemento | Status | Detalhe |
|---|---|---|
| Title tag | ⚠️ | "Marinha do Brasil" removido no último commit |
| Meta description | ✅ | Boa — inclui keywords, dentro do limite |
| H1 | ✅ | Presente, único, com keyword |
| Open Graph title/description | ✅ | Configurados |
| og-image | ❌ | `og-image.png` não existe em `public/` |
| Canonical URL | ❌ | Ausente |
| Sitemap.xml | ❌ | Ausente |
| robots.txt | ❓ | Next.js gera automaticamente — sem customização |
| Redirect raiz | ⚠️ | 302 em vez de 301 (não passa PageRank) |
| Structured data | ❌ | Ausente |
| HTTPS | ✅ | Certbot configurado |
| Mobile-friendly | ✅ | Responsivo |

### Regressão de keyword crítica

```
Antes: "Checklist do Internato — Marinha do Brasil"
Depois: "Checklist do Internato | Quartel Digital"
```

"Marinha do Brasil" é o modificador de alta intenção que distingue este conteúdo de checklists genéricos. A perda desse keyword do `<title>` — o elemento mais pesado para ranking e CTR orgânico — é a maior regressão de SEO do projeto.

### metadataBase inconsistente

```ts
// layout.tsx
metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://quarteldigital.com.br')
```

O fallback aponta para `quarteldigital.com.br`, mas o site está em `checklist.recrutapadrao.com.br`. Se a variável de ambiente não estiver configurada, todas as URLs absolutas de OG images e canonicals resolverão para o domínio errado.

### Oportunidade: Structured Data

Com JSON-LD `WebPage` + `Offer` (preço: 0), o Google pode exibir rich snippets com destaque "Gratuito" nos resultados de busca — diferencial significativo para uma página de material educacional.

---

## 6. Performance e Core Web Vitals

### Estimativa de métricas

| Métrica | Status | Observação |
|---|---|---|
| LCP | ⚠️ Risco futuro | Placeholder atual é CSS puro (rápido). Quando imagem real for adicionada sem `fetchpriority="high"`, LCP aumentará |
| CLS | ✅ OK | Fontes do sistema eliminam FOIT/FOUT. Placeholder tem dimensões fixas. |
| INP / FID | ✅ OK | Bundle mínimo, React 19 Concurrent, sem libs pesadas |
| TTFB | ✅ OK | Next.js SSR + Nginx. PM2 mantém processo ativo, sem cold start |
| Bundle size | ✅ Excelente | Apenas Next.js + React. Zero dependências de UI. |

### Riscos quando a imagem real for adicionada

- Exige `loading="eager"` + `fetchpriority="high"` na imagem do hero (é o LCP element)
- Exige `width` e `height` explícitos para evitar CLS
- Exige preload no `<head>`: `<link rel="preload" as="image" href="/hero.jpg">`

---

## 7. Mobile First

### Pontos positivos

- CSS escrito mobile-first com media queries min-width
- Breakpoints adequados: 340px, 768px, 1024px, 1440px
- `inputMode="numeric"` no campo WhatsApp (abre teclado numérico no iOS/Android)
- `prefers-reduced-motion` respeitado nas animações

### Pontos negativos

- Formulário sem máscara visual — no mobile, sem formatação automática, o usuário não sabe se está digitando corretamente
- Placeholder de imagem ocupa espaço visual significativo no mobile sem entregar valor
- Botão de submit no formulário — verificar área de toque mínima de 44×44px (WCAG 2.5.5)

---

## 8. Acessibilidade

### WCAG 2.1 — Critérios verificados

| Critério | Nível | Status |
|---|---|---|
| 2.4.1 Bypass Blocks | A | ❌ Sem skip navigation link |
| 1.3.5 Identify Input Purpose | AA | ⚠️ `autocomplete` ausente nos campos de formulário |
| 3.3.2 Labels or Instructions | A | ⚠️ Sem distinção visual obrigatório/opcional |
| 4.1.3 Status Messages | AA | ⚠️ Tela de sucesso deve usar `role="status"` ou `aria-live` |
| 2.5.5 Target Size | AAA | ❓ Verificar área de toque dos botões |

### Problemas específicos

**Skip navigation ausente** — usuários de teclado e screen readers precisam navegar por todo o header antes de acessar o H1. Correção:
```html
<a href="#main-content" className="skip-link">Pular para o conteúdo</a>
```

**`aria-required` ausente** — campos obrigatórios não têm atributo semântico. Screen readers não anunciam a obrigatoriedade:
```tsx
<input aria-required="true" ... />
```

**`autocomplete` ausente** — campos de nome e telefone devem ter `autocomplete="name"` e `autocomplete="tel"` para facilitar preenchimento automático (especialmente no mobile).

**Distinção de campos** — o label `(opcional)` foi removido da `forca_interesse` sem compensação. Adicionar asterisco com legenda:
```
* Campo obrigatório
```

---

## 9. Analytics

### Configuração atual

| Ferramenta | Status | Observação |
|---|---|---|
| Google Analytics 4 | ✅ Configurado | Via `@next/third-parties/google` |
| Microsoft Clarity | ✅ Configurado | Via script direto no `<head>` |
| Meta Pixel | ❌ Comentado | `META_PIXEL_ID` env definida mas não usada |
| Supabase | ❌ Desativado | Schema completo mas totalmente comentado |

### Eventos customizados

O wrapper `analytics.ts` expõe `trackEvent(name, params)`. Nenhum evento customizado está sendo disparado na página atual. Oportunidades:

- `form_start` — quando usuário interage com o primeiro campo
- `form_submit` — quando submit ocorre (para calcular taxa de conversão no GA4)
- `whatsapp_click` — quando usuário clica no botão pós-sucesso
- `scroll_depth` — marcos de 25%, 50%, 75%, 100%

### Problema: `page_view` documentado mas nunca chamado

`analytics.ts:27` documenta `trackEvent('page_view')` mas não há chamada no código. O GA4 rastreia pageviews nativamente, mas a ausência de evento customizado impede correlação com dados do Clarity.

### `origem` sempre vazio

O payload do formulário inclui o campo `origem` mas ele é sempre preenchido com `''`. O propósito (canal diferente de UTMs?) não está claro e os dados coletados são inúteis.

---

## 10. Branding

### Consistência

- Logo "Quartel Digital" presente no header
- Cores military-adjacent (azul marinho, dourado) adequadas ao público
- Tom de voz autoritativo e direto, adequado para o nicho militar

### Inconsistências

- **Eyebrow vs. formulário** — eyebrow diz "Marinha do Brasil" mas o formulário aceita Exército e Aeronáutica. Mensagem de posicionamento incoerente.
- **metadataBase** aponta para `quarteldigital.com.br` como fallback, criando confusão de origem de marca em OG tags
- **Fonte sistema** — sem personalidade tipográfica. Para audiência militar, tipografias com maior autoridade (Inter, Source Sans Pro) reforçariam a credibilidade institucional

### Política de Privacidade e Termos — "Em construção"

As páginas `/privacidade` e `/termos` exibem texto de placeholder. Além do risco legal (LGPD Art. 6º exige política vigente antes da coleta), isso prejudica a credibilidade da marca: visitantes que clicam nos links do footer veem que o site está incompleto.

---

## 11. Funil de Conversão

### Mapa do funil atual

```
[Tráfego] → [Landing Page] → [Formulário] → [console.log] → [WhatsApp]
                                                  ↑
                                          Dados perdidos aqui
```

### Mapa do funil ideal

```
[Tráfego orgânico/pago]
        ↓
[Landing Page — hero com imagem real]
        ↓
[Formulário — com prova social, urgência, microcopy]
        ↓
[Supabase — lead capturado]
        ↓
[Entrega automática do PDF]
        ↓
[WhatsApp — nurturing e engajamento]
        ↓
[Conversão em inscrição / produto pago]
```

### Pontos de abandono

1. **Hero com placeholder** → abandono imediato por falta de credibilidade
2. **Formulário sem garantia de privacidade** → hesitação ao fornecer WhatsApp
3. **Campo "Força de interesse" sem contexto** → fricção desnecessária
4. **Pós-submit sem entrega automática** → abandono por falta de resposta imediata

---

## 12. Arquitetura

### Pontos positivos

- Next.js 15 App Router — SSR por padrão, bom para SEO
- Sem libs de UI desnecessárias — bundle leve
- `lib/analytics.ts` bem encapsulado
- Schema do Supabase já documentado e preparado em `lib/supabase.ts`
- Redirect configurado no `next.config.ts` (ao invés de Nginx)

### Problemas técnicos identificados

**`console.log` em produção com dados pessoais** (`ChecklistForm.tsx:112`):
```tsx
console.log('[Quartel Digital] lead:', payload)
// payload: { nome, whatsapp, user_agent, url, timestamp }
```
Expõe dados pessoais no browser. Deve ser removido ou guardado atrás de `NODE_ENV === 'development'`.

**og-image.png referenciado mas inexistente** (`page.tsx:13`):
```tsx
images: [{ url: '/og-image.png', width: 1200, height: 630 }]
// Arquivo não existe em public/
```

**302 em vez de 301** (`next.config.ts:9`):
```ts
permanent: false  // Deve ser true
```

**`.gitignore` excessivamente amplo** — o último commit mudou para ignorar `.claude/` inteiramente, o que remove `.claude/docs/` do controle de versão. Arquivos de documentação do projeto em `.claude/docs/` deixam de ser rastreados.

**Supabase totalmente comentado** — o schema está completo e bem documentado em `lib/supabase.ts`. A ativação requer apenas descomentar o código e configurar as variáveis de ambiente.

**Campo `origem` na interface mas sempre vazio** — `FormFields.origem` existe mas nunca é preenchido. Ou deve ser removido ou deve capturar um valor útil (ex: UTM source).
