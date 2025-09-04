# 🔧 Plano de Refatoração do index.html

## 📋 Problemas Identificados

### Tamanho Atual: 873 linhas
- **Configuração Tailwind**: 45 linhas (8-53)
- **CSS Customizado**: 275 linhas (55-329) 
- **HTML Principal**: ~250 linhas
- **6 Modais**: ~300 linhas
- **Scripts**: 10 linhas

## 🎯 Estratégia de Otimização

### 1. Extrair CSS Customizado (275 linhas → arquivo separado)
**Criar:** `src/css/modals.css`
- Todos os estilos de modal
- Animações @keyframes
- Classes customizadas (.data-table, .btn-edit, etc.)

### 2. Extrair Configuração Tailwind (45 linhas → arquivo separado)
**Criar:** `src/config/tailwind-config.js`
- Cores da paróquia
- Configurações customizadas
- Componentes personalizados

### 3. Componentizar Modais (300 linhas → templates reutilizáveis)
**Criar:** `src/components/modal-template.html`
- Template base de modal
- Função JavaScript para gerar modais dinamicamente
- Reduzir duplicação de código

### 4. Separar Seções (250 linhas → componentes)
**Criar:** `src/components/sections/`
- `avisos-section.html`
- `clero-section.html`
- `pastorais-section.html`
- etc.

## 📊 Resultado Esperado

### Antes: 873 linhas
- index.html: 873 linhas

### Depois: ~150 linhas
- index.html: ~150 linhas (apenas estrutura principal)
- modals.css: ~200 linhas
- tailwind-config.js: ~50 linhas
- modal-template.html: ~30 linhas
- components/: ~400 linhas distribuídas

## 🚀 Benefícios

1. **Manutenibilidade**: Código organizado em responsabilidades específicas
2. **Reutilização**: Templates de modal reutilizáveis
3. **Performance**: CSS separado pode ser cacheado
4. **Legibilidade**: Arquivo principal muito mais limpo
5. **Escalabilidade**: Fácil adicionar novos componentes

## 📝 Prioridades

### Fase 1 (Alto Impacto)
1. ✅ Extrair CSS customizado
2. ✅ Extrair configuração Tailwind
3. ✅ Componentizar modais

### Fase 2 (Médio Impacto)  
4. ⚠️ Separar seções em componentes
5. ⚠️ Implementar sistema de templates

### Fase 3 (Baixo Impacto)
6. 🔄 Otimizar CSS duplicado
7. 🔄 Implementar lazy loading de componentes

## 💡 Recomendação

**Começar pela Fase 1** para obter máximo benefício com mínimo risco.
