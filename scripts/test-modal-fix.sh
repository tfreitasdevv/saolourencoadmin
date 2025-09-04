#!/bin/bash

# Script de teste para verificar se os modais estão funcionando corretamente

echo "🔍 Verificando correção dos modais..."
echo "===================================="

# Verificar se todos os modais têm a classe 'hidden'
modals=(
    "avisoModal"
    "avisoMusicaModal" 
    "cleroModal"
    "pastoralModal"
    "horarioModal"
    "adminModal"
)

echo "📋 Verificando se todos os modais têm a classe 'hidden':"

for modal in "${modals[@]}"; do
    if grep -q "id=\"$modal\" class=\"modal hidden\"" src/pages/index.html; then
        echo "✅ $modal - OK"
    else
        echo "❌ $modal - FALTANDO classe 'hidden'"
    fi
done

echo ""
echo "🔧 Verificando funções JavaScript atualizadas:"

# Verificar se as funções foram atualizadas para usar classList
if grep -q "classList.remove('hidden')" src/js/app.js; then
    echo "✅ openModal atualizada para Tailwind"
else
    echo "❌ openModal NÃO atualizada"
fi

if grep -q "classList.add('hidden')" src/js/app.js; then
    echo "✅ closeModal atualizada para Tailwind"
else
    echo "❌ closeModal NÃO atualizada"
fi

# Verificar event listener de clique externo
if grep -q "modal.classList.add('hidden')" src/js/app.js; then
    echo "✅ Event listener de clique externo atualizado"
else
    echo "❌ Event listener de clique externo NÃO atualizado"
fi

# Verificar funções de admin
if grep -q "classList.remove('hidden')" src/js/database-extended.js; then
    echo "✅ openAdminModal atualizada para Tailwind"
else
    echo "❌ openAdminModal NÃO atualizada"
fi

echo ""
echo "📊 Verificações adicionais:"

# Verificar se não há mais style.display nos modais
old_display_count=$(grep -c "style.display.*block\|style.display.*flex" src/js/app.js src/js/database-extended.js 2>/dev/null || echo 0)

if [ "$old_display_count" -eq 0 ]; then
    echo "✅ Nenhuma referência a style.display nos modais"
else
    echo "⚠️  Ainda há $old_display_count referências a style.display nos modais"
fi

echo ""
echo "🎯 Resultado da correção:"
echo "========================"

hidden_count=$(grep -c "class=\"modal hidden\"" src/pages/index.html)
expected_count=6

if [ "$hidden_count" -eq "$expected_count" ]; then
    echo "✅ Correção aplicada com sucesso!"
    echo "   - $hidden_count/$expected_count modais com classe 'hidden'"
    echo "   - Funções JavaScript atualizadas para Tailwind"
    echo "   - Modais não aparecerão automaticamente ao carregar a página"
else
    echo "❌ Correção incompleta:"
    echo "   - Apenas $hidden_count/$expected_count modais com classe 'hidden'"
fi

echo ""
echo "📝 Para testar:"
echo "1. Abra a página index.html em um navegador"
echo "2. Faça login no sistema"
echo "3. Verifique se NENHUM modal aparece automaticamente"
echo "4. Teste clicando nos botões '+' para abrir os modais"
echo "5. Teste fechando os modais com 'X' ou clicando fora"
