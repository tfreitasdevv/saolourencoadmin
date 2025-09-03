#!/bin/bash

# Script de inicialização - Paróquia São Lourenço Admin
# Execute este script para iniciar o ambiente de desenvolvimento

echo "🚀 Iniciando ambiente de desenvolvimento..."
echo "📁 Projeto: Paróquia São Lourenço - Interface Administrativa"
echo ""

# Verificar se estamos na pasta correta
if [ ! -f "README.md" ]; then
    echo "❌ Execute este script na pasta raiz do projeto"
    exit 1
fi

# Mostrar informações do projeto
echo "📂 Estrutura reorganizada:"
echo "   src/pages/     - Páginas HTML"
echo "   src/js/        - Scripts JavaScript"
echo "   src/css/       - Estilos CSS"
echo "   src/config/    - Configurações Firebase"
echo "   docs/          - Documentação"
echo ""

# Tentar iniciar servidor HTTP
PORT=8000

echo "🌐 Iniciando servidor HTTP na porta $PORT..."
echo ""

# Verificar se Python está disponível
if command -v python3 &> /dev/null; then
    echo "🐍 Usando Python 3..."
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    echo "🐍 Usando Python..."
    python -m http.server $PORT
elif command -v npx &> /dev/null; then
    echo "📦 Usando NPX serve..."
    npx serve . -p $PORT
elif command -v php &> /dev/null; then
    echo "🐘 Usando PHP..."
    php -S localhost:$PORT
else
    echo "❌ Nenhum servidor HTTP encontrado!"
    echo "   Instale Python, Node.js ou PHP para continuar"
    echo ""
    echo "🔗 Acesso manual:"
    echo "   Abra o arquivo index.html no navegador"
    echo "   Ou use a extensão Live Server do VS Code"
    exit 1
fi
