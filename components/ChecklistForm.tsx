'use client'

import { useState, useRef, FormEvent, ChangeEvent, FocusEvent } from 'react'
import { trackEvent } from '@/lib/analytics'

// ─── Types ─────────────────────────────────────────────────────────────────

interface FormFields {
  nome: string
  whatsapp: string
  forca_interesse: string
  etapa_atual: string
  cidade: string
  estado: string
  origem: string
}

type FieldErrors = Partial<Record<keyof FormFields, string>>

// ─── Constants ──────────────────────────────────────────────────────────────

const INITIAL_FORM: FormFields = {
  nome: '',
  whatsapp: '',
  forca_interesse: '',
  etapa_atual: '',
  cidade: '',
  estado: '',
  origem: '',
}

const FORCAS = ['Marinha', 'Exército', 'Aeronáutica']

// ─── Validation ─────────────────────────────────────────────────────────────

function validate(form: FormFields): FieldErrors {
  const errors: FieldErrors = {}

  if (!form.nome.trim()) {
    errors.nome = 'Nome é obrigatório'
  }

  const digits = form.whatsapp.replace(/\D/g, '')
  if (!digits) {
    errors.whatsapp = 'WhatsApp é obrigatório'
  } else if (digits.length < 10 || digits.length > 11) {
    errors.whatsapp = 'Número inválido — informe DDD + número'
  }

  return errors
}

// ─── UTM helper ─────────────────────────────────────────────────────────────

function getUtms(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const p = new URLSearchParams(window.location.search)
  return {
    utm_source: p.get('utm_source') ?? '',
    utm_medium: p.get('utm_medium') ?? '',
    utm_campaign: p.get('utm_campaign') ?? '',
  }
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ChecklistForm() {
  const [form, setForm] = useState<FormFields>(INITIAL_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const startedRef = useRef(false)

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormFields]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function handleFirstInteraction(e: FocusEvent) {
    if (startedRef.current) return
    startedRef.current = true
    trackEvent('lead_started', { field: (e.target as HTMLElement).getAttribute('name') ?? '' })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const fieldErrors = validate(form)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      const firstErrorField = Object.keys(fieldErrors)[0]
      document.getElementById(firstErrorField)?.focus()
      return
    }

    setSubmitting(true)

    const payload = {
      ...form,
      ...getUtms(),
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
    }

    // TODO: Supabase — quando integrado, chamar saveLead(payload) aqui
    // import { saveLead } from '@/lib/supabase'
    // await saveLead(payload)

    trackEvent('lead_completed', { forca: form.forca_interesse })

    setSubmitted(true)
    setSubmitting(false)
  }

  // ── Success state ─────────────────────────────────────────────────────────
  if (submitted) {
    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
    const waText = encodeURIComponent('Olá.\nAcabei de me cadastrar para receber o Checklist do Internato.')
    const waUrl = `https://wa.me/${waNumber}?text=${waText}`

    function handleWaClick() {
      trackEvent('cta_whatsapp')
    }

    return (
      <div className="success-box">
        <div className="success-icon">&#10003;</div>
        <h2>Pronto! Seu Checklist está a caminho.</h2>
        <p>Clique no botão abaixo para abrir o WhatsApp e concluir o recebimento do seu material.</p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
          onClick={handleWaClick}
        >
          Receber pelo WhatsApp
        </a>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate className="lead-form" onFocus={handleFirstInteraction}>

      {/* Nome */}
      <div className="field">
        <label htmlFor="nome">Nome</label>
        <input
          id="nome"
          name="nome"
          type="text"
          autoComplete="given-name"
          value={form.nome}
          onChange={handleChange}
          placeholder="Seu nome"
          className={errors.nome ? 'has-error' : ''}
        />
        {errors.nome && <span className="error-msg">{errors.nome}</span>}
      </div>

      {/* WhatsApp */}
      <div className="field">
        <label htmlFor="whatsapp">WhatsApp</label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          autoComplete="tel"
          inputMode="numeric"
          value={form.whatsapp}
          onChange={handleChange}
          placeholder="(11) 99999-9999"
          className={errors.whatsapp ? 'has-error' : ''}
        />
        {errors.whatsapp && <span className="error-msg">{errors.whatsapp}</span>}
      </div>

      {/* Força — opcional */}
      <div className="field">
        <label htmlFor="forca_interesse">
          Força de interesse
        </label>
        <select
          id="forca_interesse"
          name="forca_interesse"
          value={form.forca_interesse}
          onChange={handleChange}
        >
          <option value="">Selecione</option>
          {FORCAS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <button type="submit" className="btn-submit" disabled={submitting}>
        {submitting ? 'Enviando...' : 'Quero receber o Checklist agora'}
      </button>
    </form>
  )
}
