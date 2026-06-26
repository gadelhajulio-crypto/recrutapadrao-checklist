import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  robots: { index: false, follow: false },
}

export default function TermosPage() {
  return (
    <main className="policy-page">
      <div className="policy-container">
        <h1 className="policy-title">Termos de Uso</h1>
        <p className="policy-body">
          Esta página está em construção. Em breve disponibilizaremos nossos Termos de Uso completos,
          estabelecendo as condições de acesso e utilização dos materiais educacionais do Quartel Digital.
        </p>
        <a href="/checklist" className="policy-back">← Voltar</a>
      </div>

      <style>{`
        .policy-page {
          min-height: 100vh;
          background: #f7f9fc;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
          padding: 40px 20px;
        }
        .policy-container {
          max-width: 560px;
          width: 100%;
        }
        .policy-title {
          font-size: 24px;
          font-weight: 800;
          color: #1a2e5a;
          margin-bottom: 16px;
        }
        .policy-body {
          font-size: 15px;
          color: #555;
          line-height: 1.7;
          margin-bottom: 24px;
        }
        .policy-back {
          font-size: 14px;
          color: #1a2e5a;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
      `}</style>
    </main>
  )
}
