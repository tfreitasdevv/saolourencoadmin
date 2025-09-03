# Guia de Desenvolvimento - Paróquia São Lourenço

## 🚀 Como executar o projeto

### Opção 1: Servidor HTTP simples (Recomendado)

```bash
# Navegue até a pasta do projeto
cd /c/Projetos/saolourencoadmin

# Inicie um servidor HTTP simples
python -m http.server 8000
# ou
npx serve .
# ou
php -S localhost:8000
```

Acesse: `http://localhost:8000`

### Opção 2: Live Server (VS Code)

1. Instale a extensão "Live Server" no VS Code
2. Clique com botão direito no `index.html`
3. Selecione "Open with Live Server"

## 📂 Estrutura Reorganizada

```
saolourencoadmin/
├── src/
│   ├── js/              # Lógica da aplicação
│   │   ├── app.js       # Aplicação principal
│   │   ├── auth.js      # Autenticação
│   │   ├── database.js  # Operações básicas BD
│   │   └── database-extended.js # Operações avançadas
│   ├── css/
│   │   └── styles.css   # Estilos da aplicação
│   ├── config/
│   │   ├── firebase-config.js # Config atual (com credenciais)
│   │   └── firebase-config.template.js # Template seguro
│   └── pages/
│       ├── index.html   # Painel principal
│       └── setup-admin.html # Configuração inicial
├── docs/                # Documentação
├── scripts/             # Scripts de automação
├── backup/              # Backups
├── firebase/            # Configurações Firebase
├── .env.example         # Exemplo de variáveis de ambiente
└── index.html           # Redirecionamento automático
```

## 🔧 Melhorias Implementadas

1. **Organização por responsabilidade**: Arquivos agrupados por função
2. **Separação de configurações**: Config sensível isolada
3. **Documentação organizada**: Tudo em `docs/`
4. **Redirecionamento automático**: `index.html` na raiz redireciona
5. **Template de segurança**: Para futuras implantações
6. **Gitignore atualizado**: Protege arquivos sensíveis

## 🛡️ Segurança

- Credenciais Firebase em arquivo separado
- Template para variáveis de ambiente
- Gitignore configurado para proteger dados sensíveis
- Documentação de boas práticas

## 📖 Próximos Passos

1. **Para desenvolvimento**: Use a estrutura atual
2. **Para produção**: Migre credenciais para variáveis de ambiente
3. **Para equipe**: Use `.env.example` como base
4. **Para deployment**: Configure CI/CD com secrets
