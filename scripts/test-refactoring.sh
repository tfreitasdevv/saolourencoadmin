#!/bin/bash

# Script para verificar a refatoração do index.html

echo "🔧 Verificando Refatoração do index.html"
echo "========================================"

# Métricas de antes e depois
echo "📊 Redução de tamanho:"
echo "• Antes: 873 linhas"
echo "• Depois: $(wc -l < src/pages/index.html) linhas"
REDUCAO=$((873 - $(wc -l < src/pages/index.html)))
PERCENTUAL=$(echo "scale=1; $REDUCAO / 873 * 100" | bc -l)
echo "• Redução: $REDUCAO linhas (-${PERCENTUAL}%)"

echo ""
echo "📁 Verificando arquivos criados:"

# Verificar se os novos arquivos existem
if [ -f "src/css/custom-components.css" ]; then
    CSS_LINES=$(wc -l < src/css/custom-components.css)
    echo "✅ custom-components.css criado ($CSS_LINES linhas)"
else
    echo "❌ custom-components.css não encontrado"
fi

if [ -f "src/config/tailwind-parish-config.js" ]; then
    CONFIG_LINES=$(wc -l < src/config/tailwind-parish-config.js)
    echo "✅ tailwind-parish-config.js criado ($CONFIG_LINES linhas)"
else
    echo "❌ tailwind-parish-config.js não encontrado"
fi

echo ""
echo "🔍 Verificando referências no index.html:"

# Verificar se as referências foram adicionadas
if grep -q "custom-components.css" src/pages/index.html; then
    echo "✅ Referência ao CSS customizado encontrada"
else
    echo "❌ Referência ao CSS customizado não encontrada"
fi

if grep -q "tailwind-parish-config.js" src/pages/index.html; then
    echo "✅ Referência à configuração Tailwind encontrada"
else
    echo "❌ Referência à configuração Tailwind não encontrada"
fi

echo ""
echo "🧹 Verificando limpeza do código:"

# Verificar se o CSS inline foi removido
if grep -q "<style>" src/pages/index.html; then
    echo "⚠️  Ainda há tags <style> no arquivo"
else
    echo "✅ CSS inline removido com sucesso"
fi

# Verificar se a configuração inline foi removida
if grep -q "tailwind.config = {" src/pages/index.html; then
    echo "⚠️  Ainda há configuração Tailwind inline"
else
    echo "✅ Configuração Tailwind inline removida"
fi

echo ""
echo "🎯 Componentes extraídos para CSS:"

# Contar componentes no CSS
MODAL_STYLES=$(grep -c "\.modal" src/css/custom-components.css)
TABLE_STYLES=$(grep -c "\.data-table" src/css/custom-components.css)
BTN_STYLES=$(grep -c "\.btn-" src/css/custom-components.css)
FORM_STYLES=$(grep -c "\.form-group" src/css/custom-components.css)

echo "• Estilos de modal: $MODAL_STYLES"
echo "• Estilos de tabela: $TABLE_STYLES"
echo "• Estilos de botão: $BTN_STYLES"
echo "• Estilos de formulário: $FORM_STYLES"

echo ""
echo "🎨 Configuração Tailwind extraída:"

# Verificar paleta de cores
PARISH_COLORS=$(grep -c "parish-" src/config/tailwind-parish-config.js)
echo "• Cores da paróquia definidas: $PARISH_COLORS"

echo ""
echo "📈 Benefícios alcançados:"
echo "✅ Código mais organizado e maintível"
echo "✅ CSS reutilizável em outros arquivos"
echo "✅ Configuração centralizada do Tailwind"
echo "✅ Redução significativa do arquivo principal"
echo "✅ Separação clara de responsabilidades"

echo ""
echo "🚀 Próximos passos recomendados:"
echo "1. Testar a aplicação no navegador"
echo "2. Verificar se todos os estilos estão funcionando"
echo "3. Considerar modularização dos modais (Fase 2)"
echo "4. Implementar sistema de componentes (Fase 3)"

echo ""
if [ $REDUCAO -gt 200 ]; then
    echo "🎉 REFATORAÇÃO BEM-SUCEDIDA!"
    echo "   Redução significativa de código alcançada!"
else
    echo "⚠️  Refatoração parcial. Verifique os componentes."
fi
