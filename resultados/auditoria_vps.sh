#!/usr/bin/env bash
# =============================================================================
#  auditoria_vps.sh — Quartel Digital / Recruta Padrão
#  Auditoria SOMENTE LEITURA do servidor VPS
#
#  ESTE SCRIPT:
#    ✓ Não instala nada
#    ✓ Não reinicia serviços
#    ✓ Não altera arquivos do sistema
#    ✓ Não exibe valores completos de variáveis sensíveis
#    ✓ Mascara tokens, senhas, chaves e URLs sensíveis
#
#  USO:
#    chmod +x auditoria_vps.sh
#    bash auditoria_vps.sh
#
#  SAÍDA:
#    auditoria_vps_output.txt  (gerado no mesmo diretório)
# =============================================================================

OUTPUT="auditoria_vps_output.txt"

# Redireciona tudo para o arquivo e para o terminal simultaneamente
exec > >(tee -a "$OUTPUT") 2>&1

# Zera o arquivo antes de começar
> "$OUTPUT"

SEP="============================================================"
SEP2="------------------------------------------------------------"

header() {
  echo ""
  echo "$SEP"
  echo "  $1"
  echo "$SEP"
}

subheader() {
  echo ""
  echo "$SEP2"
  echo "  $1"
  echo "$SEP2"
}

# Função para mascarar valores sensíveis em arquivos .env
# Mantém o nome da variável, oculta o valor
mask_env_file() {
  local file="$1"
  if [ -f "$file" ]; then
    sed -E \
      's/^([A-Z_]+)=(.{0,4}).*/\1=\2[*** MASCARADO ***]/g' \
      "$file"
  else
    echo "(arquivo não encontrado)"
  fi
}

# Verifica se um comando existe
has_cmd() {
  command -v "$1" >/dev/null 2>&1
}

# =============================================================================
echo ""
echo "Quartel Digital — Auditoria de Servidor VPS"
echo "Data/hora: $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "Script versão: 1.0.0"
echo "$SEP"

# =============================================================================
header "1. SISTEMA OPERACIONAL"
# =============================================================================

subheader "1.1 Distribuição"
if [ -f /etc/os-release ]; then
  cat /etc/os-release
else
  uname -a
fi

subheader "1.2 Kernel"
uname -r

subheader "1.3 Uptime"
uptime

subheader "1.4 Data e fuso horário"
date
timedatectl 2>/dev/null || echo "(timedatectl não disponível)"

# =============================================================================
header "2. HARDWARE"
# =============================================================================

subheader "2.1 CPUs"
nproc
echo ""
lscpu 2>/dev/null | grep -E "^(Architecture|CPU\(s\)|Model name|Thread|Core)" || cat /proc/cpuinfo | grep "model name" | head -2

subheader "2.2 Memória RAM"
free -h

subheader "2.3 Disco"
df -h --output=source,size,used,avail,pcent,target 2>/dev/null || df -h

subheader "2.4 Endereços IP"
hostname -I 2>/dev/null || ip addr show | grep "inet " | awk '{print $2}'
echo ""
echo "Hostname: $(hostname)"

# =============================================================================
header "3. USUÁRIOS DO SISTEMA"
# =============================================================================

subheader "3.1 Usuário atual"
whoami
id

subheader "3.2 Usuários com shell válido (excluindo sistema)"
grep -E '/bin/(bash|sh|zsh|fish)$' /etc/passwd | \
  awk -F: '{print "  usuário: "$1" | home: "$6" | shell: "$7}'

subheader "3.3 Últimos logins"
last -n 10 2>/dev/null || echo "(comando last não disponível)"

# =============================================================================
header "4. NODE.JS / NPM / YARN / PNPM"
# =============================================================================

subheader "4.1 Node.js"
if has_cmd node; then
  echo "Versão: $(node --version)"
  echo "Caminho: $(which node)"
  # Verificar se NVM está em uso
  if [ -d "$HOME/.nvm" ]; then
    echo "NVM detectado em: $HOME/.nvm"
    ls "$HOME/.nvm/versions/node/" 2>/dev/null | head -10
  fi
else
  echo "Node.js NÃO instalado"
fi

subheader "4.2 NPM"
if has_cmd npm; then
  echo "Versão: $(npm --version)"
  echo "Caminho: $(which npm)"
else
  echo "npm NÃO instalado"
fi

subheader "4.3 PNPM"
if has_cmd pnpm; then
  echo "Versão: $(pnpm --version)"
  echo "Caminho: $(which pnpm)"
else
  echo "pnpm não instalado"
fi

subheader "4.4 Yarn"
if has_cmd yarn; then
  echo "Versão: $(yarn --version)"
  echo "Caminho: $(which yarn)"
else
  echo "yarn não instalado"
fi

subheader "4.5 Bun"
if has_cmd bun; then
  echo "Versão: $(bun --version)"
  echo "Caminho: $(which bun)"
else
  echo "bun não instalado"
fi

# =============================================================================
header "5. PM2"
# =============================================================================

subheader "5.1 Versão PM2"
if has_cmd pm2; then
  echo "Versão: $(pm2 --version)"
  echo "Caminho: $(which pm2)"
else
  echo "PM2 NÃO instalado"
fi

subheader "5.2 Lista de processos PM2"
if has_cmd pm2; then
  pm2 list 2>/dev/null || echo "(sem processos ou PM2 sem daemon)"
else
  echo "PM2 não disponível"
fi

subheader "5.3 Detalhes de cada app PM2"
if has_cmd pm2; then
  # Listar nomes dos apps e descrever cada um
  PM2_APPS=$(pm2 jlist 2>/dev/null | python3 -c "
import sys, json
try:
    apps = json.load(sys.stdin)
    for app in apps:
        print(app.get('name',''))
except:
    pass
" 2>/dev/null)

  if [ -n "$PM2_APPS" ]; then
    while IFS= read -r app; do
      echo ""
      echo "  >>> App: $app"
      pm2 describe "$app" 2>/dev/null | grep -E \
        "(name|status|pid|uptime|restarts|mode|exec_mode|path|cwd|script|node_version|port|namespace|watch)" \
        | head -30
    done <<< "$PM2_APPS"
  else
    echo "(nenhum app PM2 em execução ou jlist indisponível)"
    pm2 describe all 2>/dev/null | head -60
  fi
fi

subheader "5.4 Configuração de startup PM2"
if has_cmd pm2; then
  pm2 startup 2>/dev/null | tail -5
fi

# =============================================================================
header "6. NGINX"
# =============================================================================

subheader "6.1 Versão e status"
if has_cmd nginx; then
  echo "Versão: $(nginx -v 2>&1)"
  systemctl status nginx 2>/dev/null | grep -E "(Active|Loaded|Main PID)" || \
    service nginx status 2>/dev/null | head -5
else
  echo "Nginx NÃO instalado"
fi

subheader "6.2 Arquivos em sites-available"
if [ -d /etc/nginx/sites-available ]; then
  ls -la /etc/nginx/sites-available/
else
  echo "(pasta não encontrada)"
fi

subheader "6.3 Arquivos em sites-enabled"
if [ -d /etc/nginx/sites-enabled ]; then
  ls -la /etc/nginx/sites-enabled/
else
  echo "(pasta não encontrada)"
fi

subheader "6.4 Conteúdo de cada site (sites-available)"
if [ -d /etc/nginx/sites-available ]; then
  for f in /etc/nginx/sites-available/*; do
    echo ""
    echo "  >>> Arquivo: $f"
    echo "$SEP2"
    # Exibir conteúdo mas mascarar qualquer coisa parecida com senha/token
    cat "$f" 2>/dev/null | sed -E \
      's/(password|secret|token|key|api_key)\s*=\s*.+/\1 = [*** MASCARADO ***]/gi'
    echo "$SEP2"
  done
fi

subheader "6.5 nginx.conf principal (seção http)"
if [ -f /etc/nginx/nginx.conf ]; then
  grep -v "^\s*#" /etc/nginx/nginx.conf | grep -v "^$" | head -60
fi

subheader "6.6 Teste de configuração Nginx"
if has_cmd nginx; then
  nginx -t 2>&1
fi

# =============================================================================
header "7. CERTIFICADOS SSL / LET'S ENCRYPT"
# =============================================================================

subheader "7.1 Certbot"
if has_cmd certbot; then
  echo "Versão: $(certbot --version 2>&1)"
  echo "Caminho: $(which certbot)"
else
  echo "Certbot não instalado"
fi

subheader "7.2 Certificados existentes e validade"
if has_cmd certbot; then
  certbot certificates 2>/dev/null
elif [ -d /etc/letsencrypt/live ]; then
  for cert_dir in /etc/letsencrypt/live/*/; do
    domain=$(basename "$cert_dir")
    echo ""
    echo "  Domínio: $domain"
    if [ -f "$cert_dir/cert.pem" ]; then
      expiry=$(openssl x509 -enddate -noout -in "$cert_dir/cert.pem" 2>/dev/null)
      issuer=$(openssl x509 -issuer -noout -in "$cert_dir/cert.pem" 2>/dev/null | cut -c1-60)
      echo "  Validade: $expiry"
      echo "  Emissor:  $issuer"
    fi
  done
else
  echo "Nenhum certificado Let's Encrypt encontrado"
fi

subheader "7.3 Cron de renovação automática"
crontab -l 2>/dev/null | grep -i "certbot\|renew" || echo "(sem cron de renovação para este usuário)"
cat /etc/cron.d/certbot 2>/dev/null || echo "(sem /etc/cron.d/certbot)"

# =============================================================================
header "8. PROJETOS EM /var/www"
# =============================================================================

subheader "8.1 Estrutura de /var/www"
if [ -d /var/www ]; then
  ls -la /var/www/
else
  echo "Pasta /var/www não encontrada"
fi

subheader "8.2 Detalhes de cada projeto"
if [ -d /var/www ]; then
  for project_dir in /var/www/*/; do
    project=$(basename "$project_dir")
    echo ""
    echo "  >>> Projeto: $project"
    echo "  Caminho: $project_dir"
    echo "  Tamanho: $(du -sh "$project_dir" 2>/dev/null | cut -f1)"

    # package.json
    if [ -f "$project_dir/package.json" ]; then
      echo ""
      echo "  package.json encontrado:"
      echo "    name:    $(python3 -c "import json,sys; d=json.load(open('$project_dir/package.json')); print(d.get('name','?'))" 2>/dev/null)"
      echo "    version: $(python3 -c "import json,sys; d=json.load(open('$project_dir/package.json')); print(d.get('version','?'))" 2>/dev/null)"
      echo "    scripts:"
      python3 -c "
import json
try:
    d = json.load(open('$project_dir/package.json'))
    for k,v in d.get('scripts',{}).items():
        print(f'      {k}: {v}')
except:
    print('      (erro ao ler scripts)')
" 2>/dev/null
    else
      echo "  (sem package.json)"
    fi

    # Verificar .env files (sem mostrar valores)
    echo ""
    echo "  Arquivos .env encontrados:"
    find "$project_dir" -maxdepth 2 -name ".env*" -not -path "*/node_modules/*" 2>/dev/null | while read envfile; do
      echo "    $envfile"
      echo "    Variáveis (apenas nomes):"
      grep -E "^[A-Z_]+=." "$envfile" 2>/dev/null | \
        sed -E 's/^([A-Z_0-9]+)=.*/      \1/' | head -20
    done

    # .next build
    if [ -d "$project_dir/.next" ]; then
      echo ""
      echo "  Build .next: presente"
      echo "    Tamanho: $(du -sh "$project_dir/.next" 2>/dev/null | cut -f1)"
    else
      echo "  Build .next: ausente"
    fi

    # node_modules
    if [ -d "$project_dir/node_modules" ]; then
      echo "  node_modules: presente ($(du -sh "$project_dir/node_modules" 2>/dev/null | cut -f1))"
    else
      echo "  node_modules: ausente"
    fi

    echo "$SEP2"
  done
fi

subheader "8.3 Outros caminhos comuns de projetos"
for alt_path in /home/*/apps /home/*/projects /opt /srv/www; do
  if [ -d "$alt_path" ]; then
    echo "  Encontrado: $alt_path"
    ls "$alt_path" 2>/dev/null
  fi
done

# =============================================================================
header "9. PORTAS EM USO"
# =============================================================================

subheader "9.1 Todas as portas TCP em escuta"
if has_cmd ss; then
  ss -tlnp 2>/dev/null | grep LISTEN
elif has_cmd netstat; then
  netstat -tlnp 2>/dev/null | grep LISTEN
fi

subheader "9.2 Processos Node.js em execução"
ps aux 2>/dev/null | grep -E "[n]ode|[n]ext" | grep -v grep

subheader "9.3 Portas usadas por processos Node"
if has_cmd ss; then
  ss -tlnp 2>/dev/null | grep node || echo "(nenhum processo node com porta detectado via ss)"
fi

subheader "9.4 Portas comuns — verificar disponibilidade"
for port in 3000 3001 3002 3003 3004 3005 4000 4001 8000 8001 8080 8443; do
  status=$(ss -tlnp 2>/dev/null | grep ":$port " && echo "EM USO" || echo "livre")
  echo "  Porta $port: $status"
done

# =============================================================================
header "10. DOCKER (se instalado)"
# =============================================================================

if has_cmd docker; then
  subheader "10.1 Versão Docker"
  docker --version

  subheader "10.2 Containers em execução"
  docker ps 2>/dev/null || echo "(sem permissão ou sem containers)"

  subheader "10.3 Imagens"
  docker images 2>/dev/null | head -20
else
  echo "Docker não instalado"
fi

# =============================================================================
header "11. VARIÁVEIS DE AMBIENTE DO SISTEMA"
# =============================================================================

subheader "11.1 Variáveis gerais (sem valores sensíveis)"
# Mostrar apenas nomes de variáveis que pareçam configuração de app
env 2>/dev/null | grep -E "^(NODE_ENV|PORT|HOST|APP_|NEXT_|DOMAIN|BASE_URL|PUBLIC_)" | \
  sed -E 's/^([A-Z_0-9]+)=(.{0,6}).*/\1=\2[...]/g'

subheader "11.2 PATH"
echo "$PATH"

# =============================================================================
header "12. PACOTES GLOBAIS NPM"
# =============================================================================

if has_cmd npm; then
  npm list -g --depth=0 2>/dev/null | head -30
fi

# =============================================================================
header "13. FIREWALL"
# =============================================================================

subheader "13.1 UFW"
if has_cmd ufw; then
  ufw status verbose 2>/dev/null || echo "(sem permissão para verificar UFW)"
else
  echo "UFW não instalado"
fi

subheader "13.2 iptables (regras resumidas)"
iptables -L INPUT --line-numbers -n 2>/dev/null | head -30 || echo "(sem permissão ou iptables não disponível)"

# =============================================================================
header "14. CRON JOBS"
# =============================================================================

subheader "14.1 Crontab do usuário atual"
crontab -l 2>/dev/null || echo "(sem crontab para este usuário)"

subheader "14.2 /etc/cron.d/"
ls /etc/cron.d/ 2>/dev/null && cat /etc/cron.d/* 2>/dev/null | grep -v "^#" | grep -v "^$"

# =============================================================================
header "15. LOGS RECENTES (apenas últimas linhas)"
# =============================================================================

subheader "15.1 Nginx error.log (últimas 20 linhas)"
tail -20 /var/log/nginx/error.log 2>/dev/null || echo "(sem acesso ao log)"

subheader "15.2 Nginx access.log (últimas 10 linhas)"
tail -10 /var/log/nginx/access.log 2>/dev/null || echo "(sem acesso ao log)"

subheader "15.3 Syslog recente (últimas 20 linhas)"
tail -20 /var/log/syslog 2>/dev/null || \
  journalctl -n 20 --no-pager 2>/dev/null | grep -v "audit\[" || \
  echo "(sem acesso aos logs)"

# =============================================================================
header "16. RESUMO DE SEGURANÇA"
# =============================================================================

subheader "16.1 Atualizações pendentes"
if has_cmd apt; then
  apt list --upgradable 2>/dev/null | head -20
fi

subheader "16.2 Acesso SSH — configuração"
grep -E "^(PermitRootLogin|PasswordAuthentication|Port|AllowUsers|PubkeyAuthentication)" \
  /etc/ssh/sshd_config 2>/dev/null || echo "(sem acesso ou arquivo não encontrado)"

subheader "16.3 Fail2ban"
if has_cmd fail2ban-client; then
  fail2ban-client status 2>/dev/null | head -10
else
  echo "Fail2ban não instalado"
fi

# =============================================================================
echo ""
echo "$SEP"
echo "  AUDITORIA CONCLUÍDA"
echo "  Arquivo gerado: $OUTPUT"
echo "  Data/hora fim: $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "$SEP"
echo ""
echo "INSTRUÇÕES:"
echo "  1. Baixe o arquivo '$OUTPUT' para sua máquina"
echo "  2. Envie o conteúdo para análise"
echo "  3. NUNCA compartilhe este arquivo publicamente (pode conter informações do servidor)"
echo ""
