#!/bin/bash

# Script de verificação do projeto - Paróquia São Lourenço
echo "🔍 Verificando integridade do projeto..."
echo ""

# Verificar estrutura de arquivos
echo "📁 Verificando estrutura de arquivos:"

files=(
    "index.html"
    "src/pages/index.html"
    "src/pages/setup-admin.html"
    "src/js/app.js"
    "src/js/auth.js" 
    "src/js/database.js"
    "src/js/database-extended.js"
    "src/css/styles.css"
    "src/config/firebase-config.js"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (AUSENTE)"
    fi
done

echo ""
echo "🔗 Verificando referências nos arquivos HTML:"

# Verificar referências no index.html principal
echo "   📄 index.html (raiz):"
if grep -q "src/pages/index.html" index.html; then
    echo "      ✅ Redirecionamento configurado"
else
    echo "      ❌ Redirecionamento não encontrado"
fi

# Verificar referências no index.html das páginas
echo "   📄 src/pages/index.html:"
if grep -q "../css/styles.css" src/pages/index.html; then
    echo "      ✅ CSS referenciado corretamente"
else
    echo "      ❌ Referência CSS incorreta"
fi

if grep -q "../config/firebase-config.js" src/pages/index.html; then
    echo "      ✅ Firebase config referenciado corretamente"
else
    echo "      ❌ Referência Firebase config incorreta"
fi

# Verificar setup-admin.html
echo "   📄 src/pages/setup-admin.html:"
if grep -q "../config/firebase-config.js" src/pages/setup-admin.html; then
    echo "      ✅ Firebase config referenciado corretamente"
else
    echo "      ❌ Referência Firebase config incorreta"
fi

echo ""
echo "🌐 Para testar o projeto:"
echo "   1. Execute: python -m http.server 8000"
echo "   2. Acesse: http://localhost:8000"
echo "   3. O redirecionamento deve funcionar automaticamente"
echo ""
