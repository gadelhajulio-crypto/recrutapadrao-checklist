#!/usr/bin/env bash
# setup-evolution.sh — Cria instância WhatsApp na Evolution API
#
# Uso:
#   bash scripts/setup-evolution.sh
#
# Depois de executar:
#   1. Escaneie o QR code que aparece no terminal
#   2. Adicione EVOLUTION_INSTANCE_NAME=quartel-digital no .env.local
#   3. Reinicie a build: pm2 restart recrutapadrao-checklist

set -euo pipefail

EVOLUTION_URL="${EVOLUTION_API_URL:-http://127.0.0.1:8080}"
API_KEY="${EVOLUTION_API_KEY:?Erro: EVOLUTION_API_KEY não configurada no .env.local}"
INSTANCE_NAME="${EVOLUTION_INSTANCE_NAME:-quartel-digital}"
SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://checklist.recrutapadrao.com.br}"
WEBHOOK_URL="${SITE_URL}/api/webhooks/whatsapp"

echo "==================================================================="
echo " Quartel Digital — Setup Evolution API"
echo " Instância  : $INSTANCE_NAME"
echo " Evolution  : $EVOLUTION_URL"
echo " Webhook URL: $WEBHOOK_URL"
echo "==================================================================="
echo ""

# 1. Criar instância
echo "--> Criando instância '$INSTANCE_NAME'..."
curl -s -X POST "$EVOLUTION_URL/instance/create" \
  -H "Content-Type: application/json" \
  -H "apikey: $API_KEY" \
  -d "{
    \"instanceName\": \"$INSTANCE_NAME\",
    \"qrcode\": true,
    \"integration\": \"WHATSAPP-BAILEYS\"
  }" | python3 -m json.tool 2>/dev/null || true
echo ""

# 2. Configurar webhook
echo "--> Configurando webhook..."
curl -s -X POST "$EVOLUTION_URL/webhook/set/$INSTANCE_NAME" \
  -H "Content-Type: application/json" \
  -H "apikey: $API_KEY" \
  -d "{
    \"url\": \"$WEBHOOK_URL\",
    \"webhook_by_events\": false,
    \"events\": [\"connection.update\", \"qrcode.updated\", \"messages.upsert\"]
  }" | python3 -m json.tool 2>/dev/null || true
echo ""

# 3. Obter QR code de conexão
echo "--> Conectando ao WhatsApp (QR code abaixo)..."
curl -s "$EVOLUTION_URL/instance/connect/$INSTANCE_NAME" \
  -H "apikey: $API_KEY" | python3 -m json.tool 2>/dev/null || true
echo ""

echo "==================================================================="
echo " Próximos passos:"
echo "   1. Escaneie o QR code acima com o WhatsApp Business"
echo "   2. Adicione no .env.local:"
echo "      EVOLUTION_INSTANCE_NAME=$INSTANCE_NAME"
echo "   3. Reinicie: pm2 restart recrutapadrao-checklist"
echo "==================================================================="
