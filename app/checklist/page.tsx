import type { Metadata } from 'next'
import ChecklistForm from '@/components/ChecklistForm'

export const metadata: Metadata = {
  title: 'Checklist do Internato — Marinha do Brasil',
  description:
    'Baixe gratuitamente o Checklist do Internato da Marinha do Brasil e receba materiais para futuros recrutas.',
  openGraph: {
    title: 'Checklist do Internato — Marinha do Brasil | Quartel Digital',
    description:
      'Baixe gratuitamente o Checklist do Internato da Marinha do Brasil e receba materiais para futuros recrutas.',
    type: 'website',
  },
}

export default function ChecklistPage() {
  return (
    <>
      <header className="site-header">
        <div>
          <span className="brand">Quartel Digital</span>
          <span className="brand-sub">Recruta Padrão</span>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="container">
            <p className="hero-eyebrow">Checklist Gratuito &middot; Marinha do Brasil</p>
            <h1>
              Vai incorporar na Marinha?<br />
              <span className="hero-h1-accent">Não chegue despreparado.</span>
            </h1>
            <p className="subtitle">
              Receba gratuitamente o Checklist do Internato e descubra o que levar,
              o que evitar e quais erros muitos recrutas só percebem depois que chegam ao quartel.
            </p>

            {/* Mockup do PDF */}
            <div className="pdf-mockup" aria-hidden="true">
              <div className="pdf-mockup-header">
                <span className="pdf-mockup-label">Quartel Digital &middot; Material Gratuito</span>
              </div>
              <div className="pdf-mockup-body">
                <p className="pdf-mockup-title">Checklist do Internato</p>
                <p className="pdf-mockup-sub">Marinha do Brasil</p>
                <div className="pdf-mockup-lines">
                  <span /><span /><span />
                </div>
                <p className="pdf-mockup-version">Versão 2026</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="benefits">
          <div className="container">
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

        {/* Credibilidade */}
        <section className="credibility">
          <div className="container">
            <p className="credibility-text">
              Material criado a partir de relatos de ex-recrutas, pesquisa documental
              e fontes públicas atualizadas.
            </p>
            <p className="credibility-disclaimer">
              Projeto educacional independente. Não substitui orientações oficiais da Marinha.
            </p>
          </div>
        </section>

        {/* Formulário */}
        <section className="form-section">
          <div className="container">
            <p className="form-title">Preencha para receber o material</p>
            <ChecklistForm />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <strong>Quartel Digital</strong> &middot; Uma iniciativa Recruta Padrão
        <br />
        Projeto educacional independente para futuros recrutas.
      </footer>
    </>
  )
}
