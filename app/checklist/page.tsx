import type { Metadata } from 'next'
import ChecklistForm from '@/components/ChecklistForm'

export const metadata: Metadata = {
  title: { absolute: 'Checklist do Internato | Quartel Digital' },
  description:
    'Baixe gratuitamente o Checklist do Internato da Marinha do Brasil e descubra o que realmente levar, quais erros evitar e como chegar mais preparado ao primeiro dia.',
  openGraph: {
    title: 'Checklist do Internato | Quartel Digital',
    description:
      'Baixe gratuitamente o Checklist do Internato da Marinha do Brasil e descubra o que realmente levar, quais erros evitar e como chegar mais preparado ao primeiro dia.',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Checklist do Internato — Quartel Digital' }],
  },
}

export default function ChecklistPage() {
  return (
    <>
      {/* ── Cabeçalho ─────────────────────────────────────────────────── */}
      <header className="site-header">
        <div className="site-header-inner">
          <div className="logo-wrap logo-wrap--dark" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/quartel-digital-logo.svg"
              alt=""
              width={26}
              height={26}
            />
          </div>
          <div>
            <span className="brand">Quartel Digital</span>
            <span className="brand-sub">Recruta Padrão</span>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="hero">
          <div className="hero-outer">
            <div className="hero-grid">

              {/* Esquerda — texto */}
              <div className="hero-content">
                <p className="hero-eyebrow">Checklist Gratuito &middot; Marinha do Brasil</p>

                <h1>
                  Vai incorporar na Marinha?<br />
                  <span className="hero-h1-accent">Não chegue despreparado.</span>
                </h1>

                <p className="subtitle">
                  Receba gratuitamente o Checklist do Internato e descubra o que levar,
                  o que evitar e quais erros muitos recrutas só percebem depois que chegam ao quartel.
                </p>

                <p className="authority-line">
                  Material desenvolvido a partir de dezenas de relatos reais de ex-recrutas
                  e mais de 40 fontes públicas pesquisadas.
                </p>

                {/* CTA visível apenas no desktop (≥1024px) */}
                <a href="#form-section" className="cta-hero-btn cta-hero-desktop">
                  Quero receber o Checklist agora
                </a>
              </div>

              {/* Direita — imagem institucional (~40% do hero no desktop) */}
              {/*
                SUBSTITUIR ANTES DO DEPLOY:
                Trocar o placeholder pelo componente abaixo com a imagem real.
                Sugestão: recrutas da Marinha em formação — acervo público das Forças Armadas.
                <img
                  src="/images/recrutas-formacao.jpg"
                  alt="Recrutas da Marinha do Brasil em formação"
                  className="hero-institutional-img"
                  loading="eager"
                  decoding="async"
                />
              */}
              <div className="hero-image-col" aria-hidden="true">
                <div className="hero-img-placeholder">
                  <span className="hero-img-placeholder-text">
                    [ Foto — recrutas em formação ]
                  </span>
                </div>
              </div>
            </div>

            {/* CTA visível apenas no mobile (após a imagem) */}
            <div className="hero-cta-mobile-wrap">
              <a href="#form-section" className="cta-hero-btn">
                Quero receber o Checklist agora
              </a>
            </div>
          </div>

          {/* Mockup do PDF */}
          <div className="container">
            <div className="pdf-mockup-wrap">
              <div className="pdf-mockup" aria-hidden="true">
                <div className="pdf-mockup-header">
                  <div className="pdf-mockup-logo-row">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/brand/quartel-digital-logo.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                    <span className="pdf-mockup-label">Quartel Digital &middot; Material Gratuito</span>
                  </div>
                </div>
                <div className="pdf-mockup-body">
                  <p className="pdf-mockup-title">Checklist do Internato</p>
                  <p className="pdf-mockup-sub">Marinha do Brasil</p>
                  <div className="pdf-mockup-lines">
                    <span /><span /><span />
                    <span /><span /><span />
                  </div>
                  <p className="pdf-mockup-version">Versão 2026</p>
                </div>
              </div>
            </div>

            {/* O que você vai receber */}
            <section className="what-you-get" aria-label="O que você vai receber">
              <p className="what-you-get-title">O que você vai receber</p>
              <ul className="what-you-get-list">
                <li className="what-you-get-item">
                  <span aria-hidden="true">📄</span> Checklist atualizado
                </li>
                <li className="what-you-get-item">
                  <span aria-hidden="true">📋</span> Lista do que realmente levar
                </li>
                <li className="what-you-get-item">
                  <span aria-hidden="true">⚓</span> Dicas de ex-recrutas
                </li>
                <li className="what-you-get-item">
                  <span aria-hidden="true">❌</span> Erros mais comuns na primeira semana
                </li>
                <li className="what-you-get-item">
                  <span aria-hidden="true">📚</span> Novos materiais gratuitos conforme forem sendo publicados
                </li>
              </ul>
            </section>
          </div>
        </section>

        {/* ── Benefícios ────────────────────────────────────────────────── */}
        <section className="benefits">
          <div className="container">
            <p className="benefits-heading">O que você vai descobrir em menos de 5 minutos</p>
            <div className="benefit-grid">
              <div className="benefit-card">
                <span className="benefit-icon">&#127890;</span>
                <span>O que realmente levar</span>
              </div>
              <div className="benefit-card">
                <span className="benefit-icon">&#9875;</span>
                <span>Dicas de ex-recrutas</span>
              </div>
              <div className="benefit-card">
                <span className="benefit-icon">&#128203;</span>
                <span>Erros comuns na primeira semana</span>
              </div>
              <div className="benefit-card">
                <span className="benefit-icon">&#128242;</span>
                <span>Próximos materiais gratuitos</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Credibilidade ─────────────────────────────────────────────── */}
        <section className="credibility">
          <div className="container">
            <p className="credibility-badge">
              <span className="credibility-check" aria-hidden="true">&#10003;</span>
              Material criado a partir de relatos reais de ex-recrutas, pesquisa documental
              e fontes públicas atualizadas.
            </p>
            <p className="credibility-disclaimer">
              Projeto educacional independente. Não substitui orientações oficiais da Marinha.
            </p>
          </div>
        </section>

        {/* ── Prova Social ──────────────────────────────────────────────── */}
        <section className="social-proof-section" aria-label="Relato de ex-recruta">
          <div className="container">
            <figure className="social-proof">
              <blockquote className="social-proof-quote">
                Se eu soubesse disso antes de incorporar, teria evitado vários erros logo na primeira semana.
              </blockquote>
              <figcaption className="social-proof-author">— Relato de ex-recruta da Marinha</figcaption>
            </figure>
          </div>
        </section>

        {/* ── Formulário ────────────────────────────────────────────────── */}
        <section className="form-section" id="form-section">
          <div className="container">
            <p className="form-title">Preencha para receber o material</p>
            <ChecklistForm />
          </div>
        </section>
      </main>

      {/* ── Rodapé ────────────────────────────────────────────────────── */}
      <footer className="site-footer">
        <div className="footer-logo-wrap">
          <div className="logo-wrap logo-wrap--dark logo-wrap--sm" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/quartel-digital-logo.svg"
              alt=""
              width={22}
              height={22}
            />
          </div>
        </div>
        <p className="footer-brand">Quartel Digital</p>
        <p className="footer-initiative">Uma iniciativa Recruta Padrão</p>
        <div className="footer-sep" aria-hidden="true" />
        <p className="footer-desc">Projeto educacional independente para futuros recrutas.</p>
        <p className="footer-legal">
          Não substitui orientações oficiais das Forças Armadas do Brasil.
        </p>
        <div className="footer-links">
          <a href="/privacidade">Política de Privacidade</a>
          <span className="footer-links-sep" aria-hidden="true">&middot;</span>
          <a href="/termos">Termos de Uso</a>
        </div>
      </footer>
    </>
  )
}
