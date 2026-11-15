[Reading 166 lines from start (total: 166 lines, 0 remaining)]

import { NextRequest, NextResponse } from 'next/server'
import { saveLead } from '@/lib/supabase'
import { sendTextMessage, normalizeBrPhone } from '@/lib/evolution'
// sendDocumentMessage mantido em lib/evolution.ts como fallback documentado

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? ''
const N8N_WEBHOOK = process.env.N8N_WEBHOOK_URL ?? ''\nconst FIRST_PARTY_EVENTS_URL = process.env.FIRST_PARTY_EVENTS_URL ?? ''\n\n\nToque no link abaixo para abrir no navegador:\n\n${checklistAccessUrl}\n