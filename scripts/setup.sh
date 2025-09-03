#!/bin/bash

echo "🔧 Configuração do Projeto São Lourenço Admin"
echo "=============================================="

# Verificar se o arquivo .env existe
if [ ! -f ".env" ]; then
    echo "📋 Criando arquivo .env..."
    cp .env.example .env
    echo "✅ Arquivo .env criado a partir do .env.example"
    echo "⚠️  IMPORTANTE: Edite o arquivo .env com suas credenciais do Firebase"
else
    echo "✅ Arquivo .env já existe"
fi

# Verificar se firebase-config.js existe
if [ ! -f "firebase-config.js" ]; then
    echo "📋 Criando firebase-config.js..."
    cp firebase-config.template.js firebase-config.js
    echo "✅ Arquivo firebase-config.js criado a partir do template"
else
    echo "✅ Arquivo firebase-config.js já existe"
fi

echo ""
echo "🚀 Próximos passos:"
echo "1. Edite o arquivo .env com suas credenciais do Firebase"
echo "2. Execute: python -m http.server 8000"
echo "3. Acesse: http://localhost:8000"
echo ""
echo "📚 Para mais informações, consulte o README.md"
