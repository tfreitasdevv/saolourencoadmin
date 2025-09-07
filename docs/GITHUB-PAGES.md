# 🚀 Deploy Seguro no GitHub Pages

## 📋 Pré-requisitos

1. **Repository Secrets configurados**
2. **GitHub Pages habilitado**
3. **Credenciais Firebase válidas**

## 🔐 1. Configurar GitHub Secrets

No seu repositório GitHub, vá em **Settings** > **Secrets and variables** > **Actions** e adicione:

```
FIREBASE_API_KEY=sua_api_key_real_aqui
FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## 🌐 2. Habilitar GitHub Pages

1. Vá em **Settings** > **Pages**
2. Em **Source**, selecione **GitHub Actions**
3. O deploy será automático a cada push na branch `main`

## 🔄 3. Como Funciona

### Processo Automatizado:
1. **Push para main** → Trigger do workflow
2. **GitHub Actions** → Gera firebase-config.js com secrets
3. **Build** → Cria versão para produção
4. **Deploy** → Publica no GitHub Pages

### Segurança:
- ✅ **Credenciais nunca commitadas** no repositório
- ✅ **Secrets criptografados** no GitHub
- ✅ **Config gerado dinamicamente** no deploy
- ✅ **Template público** sem dados sensíveis

## 🛠️ 4. Desenvolvimento Local

Para desenvolver localmente, use:

```bash
# Opção 1: Credenciais diretas no arquivo
cp src/config/firebase-config.local.js src/config/firebase-config.js

# Opção 2: Servidor de desenvolvimento
python -m http.server 8000
```

## 🌍 5. URL do Projeto

Após o deploy, o projeto estará disponível em:
```
https://SEU_USUARIO.github.io/saolourencoadmin/
```

## 🔍 6. Verificar Deploy

1. Vá em **Actions** no GitHub
2. Verifique se o workflow executou com sucesso
3. Acesse a URL do GitHub Pages
4. Teste o login administrativo

## ⚠️ 7. Troubleshooting

### Erro de Firebase:
- Verifique se todos os secrets estão configurados
- Confirme se as credenciais estão corretas
- Veja os logs no GitHub Actions

### Erro de Deploy:
- Verifique se GitHub Pages está habilitado
- Confirme se a branch main tem as últimas mudanças
- Veja os logs de deploy no Actions

## 🔒 8. Segurança em Produção

- **Credenciais**: Apenas nos GitHub Secrets
- **Domínio**: Configure Firebase para aceitar apenas seu domínio GitHub Pages
- **Firestore Rules**: Configure regras de segurança adequadas
- **CORS**: Configure adequadamente para GitHub Pages
