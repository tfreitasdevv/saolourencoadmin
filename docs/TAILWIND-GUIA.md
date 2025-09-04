# 🎨 Guia de Desenvolvimento com Tailwind CSS

## 📋 Checklist de Desenvolvimento

### ✅ Já Implementado
- [x] Configuração do Tailwind CSS via CDN
- [x] Sistema de cores personalizado da paróquia
- [x] Layout responsivo mobile-first
- [x] Conversão completa do HTML
- [x] Navegação adaptativa
- [x] Componentes de formulário
- [x] Tabelas responsivas
- [x] Documentação completa

### 🔧 Para Implementar no Futuro

#### 1. Build Local do Tailwind
```bash
# Quando resolver o problema do npm, execute:
npm install
npm run build-css
npm run dev  # Para watch mode
```

#### 2. Otimizações
- [ ] Configurar purge CSS para reduzir tamanho
- [ ] Implementar dark mode (opcional)
- [ ] Criar mais componentes reutilizáveis
- [ ] Adicionar animações com Tailwind

#### 3. Componentes Adicionais
- [ ] Toast notifications
- [ ] Loading skeletons
- [ ] Breadcrumbs
- [ ] Pagination

## 🎨 Padrões de Design

### Cores Principais
```html
<!-- Botões principais -->
class="bg-parish-blue-500 hover:bg-parish-blue-600"

<!-- Backgrounds -->
class="bg-parish-gradient"  <!-- Gradiente principal -->
class="bg-header-gradient"  <!-- Header -->

<!-- Textos -->
class="text-parish-blue-600"  <!-- Links ativos -->
class="text-gray-800"         <!-- Texto principal -->
class="text-gray-600"         <!-- Texto secundário -->
```

### Espaçamentos
```html
<!-- Padding padrão -->
class="p-4"    <!-- 16px -->
class="p-6"    <!-- 24px -->

<!-- Margins -->
class="mb-4"   <!-- margin-bottom: 16px -->
class="mb-6"   <!-- margin-bottom: 24px -->

<!-- Gaps -->
class="gap-2"  <!-- 8px -->
class="gap-4"  <!-- 16px -->
```

### Layout Responsivo
```html
<!-- Mobile First -->
class="flex flex-col lg:flex-row"           <!-- Coluna no mobile, linha no desktop -->
class="w-full lg:w-64"                      <!-- Full width mobile, 256px desktop -->
class="text-xl lg:text-2xl"                <!-- Menor no mobile -->
class="hidden lg:block"                     <!-- Oculto no mobile -->
```

## 🧩 Componentes Prontos

### Botão Primário
```html
<button class="bg-parish-blue-500 hover:bg-parish-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2">
    <i class="fas fa-plus"></i> Texto do Botão
</button>
```

### Input com Label
```html
<div class="mb-4">
    <label class="block text-sm font-medium text-gray-700 mb-2">Label:</label>
    <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-parish-blue-500 focus:border-transparent">
</div>
```

### Card Container
```html
<div class="bg-white rounded-lg shadow p-6">
    <!-- Conteúdo do card -->
</div>
```

### Section Header
```html
<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200 gap-4">
    <h2 class="text-2xl font-semibold text-gray-800 flex items-center gap-2">
        <i class="fas fa-icon"></i> Título da Seção
    </h2>
    <button class="bg-parish-blue-500 hover:bg-parish-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2">
        <i class="fas fa-plus"></i> Ação
    </button>
</div>
```

### Tabela Responsiva
```html
<div class="overflow-x-auto bg-white rounded-lg shadow">
    <table class="data-table">
        <thead>
            <tr>
                <th>Coluna 1</th>
                <th>Coluna 2</th>
            </tr>
        </thead>
        <tbody>
            <!-- Conteúdo -->
        </tbody>
    </table>
</div>
```

## 🚨 Importante

### Ao Adicionar Novos Elementos
1. **Use classes Tailwind** ao invés de CSS customizado
2. **Mantenha a responsividade** com `lg:`, `sm:`, etc.
3. **Use as cores da paróquia** definidas no config
4. **Teste em diferentes tamanhos** de tela
5. **Mantenha consistência** com os padrões existentes

### Debugging
```html
<!-- Para debugar layout, adicione temporariamente: -->
class="border-2 border-red-500"  <!-- Visualizar bordas -->
class="bg-red-100"               <!-- Visualizar áreas -->
```

## 📚 Recursos

- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [Tailwind Play](https://play.tailwindcss.com) - Playground online
- [Headless UI](https://headlessui.com) - Componentes acessíveis
- [Heroicons](https://heroicons.com) - Ícones que combinam com Tailwind

## 🎯 Performance

### CSS Atual
- Via CDN: ~3.2MB (desenvolvimento)
- Build otimizado: ~10-50KB (produção)

### Para Produção
```bash
npm run build  # Gera CSS minificado e otimizado
```

---

Mantenha este guia atualizado conforme o projeto evolui! 🚀
