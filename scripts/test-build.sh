#!/bin/bash

# Script para testar build local - GitHub Pages
echo "🔧 Testando build para GitHub Pages..."

# Limpar build anterior
rm -rf dist/

# Criar estrutura de build
mkdir -p dist/src/config

# Copiar arquivos
echo "📁 Copiando arquivos..."
cp -r src/ dist/
cp -r docs/ dist/ 2>/dev/null || true
cp -r scripts/ dist/ 2>/dev/null || true
cp -r backup/ dist/ 2>/dev/null || true
cp -r firebase/ dist/ 2>/dev/null || true
cp index.html dist/
cp README.md dist/ 2>/dev/null || true
cp DESENVOLVIMENTO.md dist/ 2>/dev/null || true
cp GITHUB-PAGES.md dist/ 2>/dev/null || true

# Verificar se existe config local
if [ -f "src/config/firebase-config.local.js" ]; then
    echo "🔑 Usando configuração local para teste..."
    cp src/config/firebase-config.local.js dist/src/config/firebase-config.js
else
    echo "⚠️  Mantendo template de configuração..."
    echo "   Configure suas credenciais em dist/src/config/firebase-config.js para testar"
fi

echo "✅ Build de teste criado em ./dist/"
echo ""
echo "🌐 Para testar:"
echo "   cd dist && python -m http.server 8000"
echo "   Acesse: http://localhost:8000"
echo ""
echo "📝 Nota: Este é apenas um teste local."
echo "   O deploy real usa GitHub Secrets para as credenciais."
