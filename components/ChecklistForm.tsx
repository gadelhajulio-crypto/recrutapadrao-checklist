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

const ETAPAS = [
  'Vou me alistar',
  'Já fui selecionado',
  'Já tenho data para incorporar',
  'Já estou servindo',
  'Sou familiar de um recruta',
]

const ORIGENS = ['WhatsApp', 'Instagram', 'TikTok', 'YouTube', 'Amigo', 'Instrutor', 'Outro']

const ESTADOS_BR = [
  'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT',
  'PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO',
]

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

  if (!form.forca_interesse) {
    errors.forca_interesse = 'Selecione uma opção'
  }

  if (!form.etapa_atual) {
    errors.etapa_atual = 'Selecione uma opção'
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
      // Scroll to first error
      const firstErrorField = Object.keys(fieldErrors)[0]
      document.getElementById(firstErrorField)?.focus()
      return
    }

    setSubmitting(true)

    // ── Payload ──────────────────────────────────────────────────────────
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
    console.log('[Quartel Digital] lead:', payload)

    trackEvent('lead_completed', { forca: form.forca_interesse, etapa: form.etapa_atual })

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
        <h2>Cadastro realizado com sucesso.</h2>
        <p>Clique abaixo para entrar em contato e receber o material.</p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
          onClick={handleWaClick}
        >
          Entrar no WhatsApp
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

      {/* Força */}
      <div className="field">
        <label htmlFor="forca_interesse">Força de interesse</label>
        <select
          id="forca_interesse"
          name="forca_interesse"
          value={form.forca_interesse}
          onChange={handleChange}
          className={errors.forca_interesse ? 'has-error' : ''}
        >
          <option value="">Selecione</option>
          {FORCAS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        {errors.forca_interesse && <span className="error-msg">{errors.forca_interesse}</span>}
      </div>

      {/* Etapa atual */}
      <div className="field">
        <label htmlFor="etapa_atual">Etapa atual</label>
        <select
          id="etapa_atual"
          name="etapa_atual"
          value={form.etapa_atual}
          onChange={handleChange}
          className={errors.etapa_atual ? 'has-error' : ''}
        >
          <option value="">Selecione</option>
          {ETAPAS.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        {errors.etapa_atual && <span className="error-msg">{errors.etapa_atual}</span>}
      </div>

      {/* Divider — opcionais */}
      <hr className="form-divider" />
      <p className="form-divider-label">Opcionais</p>

      {/* Cidade */}
      <div className="field">
        <label htmlFor="cidade">
          Cidade <span className="label-optional">(opcional)</span>
        </label>
        <input
          id="cidade"
          name="cidade"
          type="text"
          autoComplete="address-level2"
          value={form.cidade}
          onChange={handleChange}
          placeholder="Sua cidade"
        />
      </div>

      {/* Estado */}
      <div className="field">
        <label htmlFor="estado">
          Estado <span className="label-optional">(opcional)</span>
        </label>
        <select
          id="estado"
          name="estado"
          value={form.estado}
          onChange={handleChange}
        >
          <option value="">Selecione</option>
          {ESTADOS_BR.map((uf) => (
            <option key={uf} value={uf}>{uf}</option>
          ))}
        </select>
      </div>

      {/* Origem */}
      <div className="field">
        <label htmlFor="origem">
          Como conheceu o material? <span className="label-optional">(opcional)</span>
        </label>
        <select
          id="origem"
          name="origem"
          value={form.origem}
          onChange={handleChange}
        >
          <option value="">Selecione</option>
          {ORIGENS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <button type="submit" className="btn-submit" disabled={submitting}>
        {submitting ? 'Enviando...' : 'Quero receber o Checklist'}
      </button>
    </form>
  )
}
