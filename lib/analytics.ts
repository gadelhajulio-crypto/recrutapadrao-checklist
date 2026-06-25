// lib/analytics.ts
// Wrapper unificado para GA4 + Microsoft Clarity
// Meta Pixel: adicionar aqui quando ativar campanhas

type EventParams = Record<string, string | number | boolean | undefined>

export function trackEvent(event: string, params?: EventParams) {
  if (typeof window === 'undefined') return

  // Google Analytics 4
  if ('gtag' in window && typeof (window as Window & { gtag: Function }).gtag === 'function') {
    ;(window as Window & { gtag: Function }).gtag('event', event, params)
  }

  // Microsoft Clarity
  if ('clarity' in window && typeof (window as Window & { clarity: Function }).clarity === 'function') {
    ;(window as Window & { clarity: Function }).clarity('event', event)
  }

  // Debug em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('[analytics]', event, params)
  }
}

// Eventos previstos:
// trackEvent('page_view')
// trackEvent('lead_started')
// trackEvent('lead_completed', { forca: 'Marinha' })
// trackEvent('cta_whatsapp')
// trackEvent('pdf_download')
