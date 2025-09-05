# Interface Administrativa - Paróquia São Lourenço

Esta é uma interface web administrativa para gerenciar as coleções do Firebase do aplicativo da Paróquia São Lourenço.

## 🚀 Acesso Rápido

- **Painel Principal**: [index.html](./src/pages/index.html)
- **Configuração Inicial**: [setup-admin.html](./src/pages/setup-admin.html)
- **Documentação Completa**: [docs/README.md](./docs/README.md)

## 🌐 Deploy

- **GitHub Pages**: [GITHUB-PAGES.md](./GITHUB-PAGES.md) - Deploy seguro com GitHub Actions
- **Desenvolvimento**: [DESENVOLVIMENTO.md](./DESENVOLVIMENTO.md) - Como executar localmente
- **Configuração**: [CONFIGURACAO-FIREBASE.md](./CONFIGURACAO-FIREBASE.md) - Setup das credenciais

## 📁 Estrutura do Projeto

```
saolourencoadmin/
├── 📁 src/
│   ├── 📁 js/              # Scripts JavaScript
│   ├── 📁 css/             # Estilos CSS
│   ├── 📁 config/          # Configurações Firebase
│   └── 📁 pages/           # Páginas HTML
├── 📁 docs/                # Documentação
├── 📁 scripts/             # Scripts de automação
├── 📁 backup/              # Arquivos de backup
├── 📁 firebase/            # Configurações Firebase
├── 📁 .github/workflows/   # GitHub Actions
└── index.html              # Redirecionamento
```

## ⚠️ IMPORTANTE - Primeira Configuração

### Para Desenvolvimento Local:
1. Configure as credenciais Firebase em `src/config/firebase-config.js`
2. Acesse `src/pages/setup-admin.html` para configurar o primeiro administrador
3. Use `src/pages/index.html` para acessar o painel

### Para Deploy no GitHub Pages:
1. Configure os **GitHub Secrets** com suas credenciais Firebase
2. Habilite **GitHub Pages** no repositório
3. O deploy será automático a cada push na branch main

## 🔧 Tecnologias

- HTML5, CSS3, JavaScript (Vanilla)
- Firebase (Auth, Firestore, Storage)
- Font Awesome (ícones)
- GitHub Actions (deploy automático)

## 🆕 Melhorias Recentes

### ✨ Sistema de Quebras de Linha Intuitivo
- **Nova funcionalidade**: Campos de texto longo (descrições, biografias) agora aceitam Enter naturalmente
- **Benefício**: Usuários não precisam mais digitar `\n` manualmente
- **Seções incluídas**: Avisos Paroquiais, Avisos Musicais, Clero e Pastorais
- **Compatibilidade**: Mantém funcionamento com o aplicativo Flutter
- **Documentação**: [`docs/MELHORIA-QUEBRAS-LINHA.md`](./docs/MELHORIA-QUEBRAS-LINHA.md)

### 🎨 Contraste Aprimorado nos Formulários
- **Problema resolvido**: Baixo contraste entre texto e fundo nos campos de entrada
- **Benefício**: Melhor legibilidade e acessibilidade para todos os usuários
- **Aplicação**: Todos os modais de formulário (Pastorais, Avisos, Clero, etc.)
- **Técnica**: CSS com `!important` para sobrescrever conflitos do Tailwind
- **Documentação**: [`docs/MELHORIA-CONTRASTE-FORMULARIOS.md`](./docs/MELHORIA-CONTRASTE-FORMULARIOS.md)

## 🛡️ Segurança

- ✅ Credenciais protegidas com GitHub Secrets
- ✅ Deploy automático seguro
- ✅ Controle de acesso administrativo
- ✅ Templates públicos sem dados sensíveis

## 📖 Documentação

Consulte a pasta `docs/` para documentação detalhada.
