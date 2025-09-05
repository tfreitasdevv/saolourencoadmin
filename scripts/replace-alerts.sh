#!/bin/bash

# Script para substituir todos os alerts por notificações toast

echo "🔄 Substituindo alerts por notificações toast..."

# Padrões de substituição para diferentes tipos de mensagem
declare -A replacements=(
    ["alert('Aviso excluído com sucesso!');"]="showSuccess('Aviso excluído com sucesso!');"
    ["alert('Erro ao excluir aviso');"]="showError('Erro ao excluir aviso');"
    ["alert('Erro ao excluir aviso música');"]="showError('Erro ao excluir aviso música');"
    ["alert('Membro do clero excluído com sucesso!');"]="showSuccess('Membro do clero excluído com sucesso!');"
    ["alert('Erro ao excluir membro do clero');"]="showError('Erro ao excluir membro do clero');"
    ["alert('Pastoral excluída com sucesso!');"]="showSuccess('Pastoral excluída com sucesso!');"
    ["alert('Erro ao excluir pastoral');"]="showError('Erro ao excluir pastoral');"
    ["alert('Horário excluído com sucesso!');"]="showSuccess('Horário excluído com sucesso!');"
    ["alert('Erro ao excluir horário');"]="showError('Erro ao excluir horário');"
    ["alert('Capela excluída com sucesso!');"]="showSuccess('Capela excluída com sucesso!');"
    ["alert('Erro ao excluir capela');"]="showError('Erro ao excluir capela');"
    ["alert('Erro ao carregar aviso música');"]="showError('Erro ao carregar aviso música');"
    ["alert('Erro ao carregar membro do clero');"]="showError('Erro ao carregar membro do clero');"
    ["alert('Erro ao carregar pastoral');"]="showError('Erro ao carregar pastoral');"
    ["alert('Erro ao carregar horário');"]="showError('Erro ao carregar horário');"
    ["alert('Erro ao carregar capela');"]="showError('Erro ao carregar capela');"
    ["alert('Administrador removido com sucesso!');"]="showSuccess('Administrador removido com sucesso!');"
    ["alert('Administrador adicionado com sucesso!');"]="showSuccess('Administrador adicionado com sucesso!');"
    ["alert('Erro ao carregar lista de administradores');"]="showError('Erro ao carregar lista de administradores');"
    ["alert('Você não pode remover seu próprio acesso de administrador.');"]="showWarning('Você não pode remover seu próprio acesso de administrador.');"
)

# Arquivos para processar
files=(
    "src/js/database-extended.js"
    "src/js/auth.js"
)

# Processar cada arquivo
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "📝 Processando $file..."
        
        # Aplicar substituições básicas primeiro
        for pattern in "${!replacements[@]}"; do
            replacement="${replacements[$pattern]}"
            sed -i "s|$pattern|$replacement|g" "$file"
        done
        
        # Substituições com regex para casos dinâmicos
        sed -i "s|alert('Erro ao \([^']*\)' + \([^)]*\));|showError('Erro ao \1' + \2);|g" "$file"
        sed -i "s|alert(\`Erro ao \([^`]*\): \${[^}]*}\`);|showError(\`Erro ao \1: \${result.error}\`);|g" "$file"
        sed -i "s|alert(\`Usuário: \${[^}]*}\`);|showInfo(\`Usuário: \${JSON.stringify(result.data, null, 2)}\`);|g" "$file"
        
    else
        echo "⚠️  Arquivo $file não encontrado"
    fi
done

echo "✅ Substituição concluída!"
