# UI/UX Pro Max — Instalação

## O que é

Claude Code skill de design intelligence com banco de dados pesquisável de estilos UI,
paletas de cores, pares tipográficos, padrões de UX e estratégias de CRO para landing pages.

- **Versão instalada:** 2.6.2
- **Autor:** NextLevelBuilder
- **Licença:** MIT
- **Homepage:** https://uupm.cc

## De onde veio

```
https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
```

Instalado em: `.claude/skills/ui-ux-pro-max/`

## Como usar (CLI)

O skill possui uma CLI em Python. Requer Python 3.

```bash
# Pesquisar padrões de landing page
python3 .claude/skills/ui-ux-pro-max/src/ui-ux-pro-max/scripts/search.py \
  "lead capture conversion" --domain landing --stack nextjs -n 5

# Buscar diretrizes UX
python3 .claude/skills/ui-ux-pro-max/src/ui-ux-pro-max/scripts/search.py \
  "trust credibility form" --domain ux -n 5

# Buscar paleta de cores
python3 .claude/skills/ui-ux-pro-max/src/ui-ux-pro-max/scripts/search.py \
  "government military dark blue" --domain color -n 3

# Dominios disponíveis: product | style | typography | color | landing | chart | ux
# Stacks disponíveis: nextjs | react | html-tailwind | vue | svelte | ...
```

## Observacao

Em ambientes sem Python 3 no PATH, a CLI nao executa. Instale Python 3 ou use WSL.
O skill tambem e ativado automaticamente via Claude Code (skill listado no sistema).

## Como atualizar

```bash
cd .claude/skills/ui-ux-pro-max
git pull origin main
```

## Como remover

```bash
rm -rf .claude/skills/ui-ux-pro-max
```

## Como validar se esta disponivel

```bash
ls .claude/skills/ui-ux-pro-max/skill.json
# Deve retornar o arquivo sem erro

cat .claude/skills/ui-ux-pro-max/skill.json | grep version
# Deve mostrar a versao instalada
```
