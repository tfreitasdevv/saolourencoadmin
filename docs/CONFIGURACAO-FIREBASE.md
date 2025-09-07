# 🔐 Configuração de Credenciais Firebase

## ⚠️ IMPORTANTE - Segurança

Este projeto requer configuração de credenciais do Firebase para funcionar. Por motivos de segurança, as credenciais reais **NÃO** estão incluídas no repositório.

## 🚀 Como Configurar

### Opção 1: Arquivo Local (Recomendado para desenvolvimento)

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Vá em **Configurações do Projeto** > **Geral**
3. Na seção **Seus apps**, clique em **</> (Web)**
4. Copie as credenciais do Firebase
5. Cole as credenciais em `src/config/firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY_REAL_AQUI",
    authDomain: "seu-projeto-real.firebaseapp.com",
    projectId: "seu-projeto-real-id", 
    storageBucket: "seu-projeto-real.appspot.com",
    messagingSenderId: "SEU_SENDER_ID_REAL",
    appId: "SEU_APP_ID_REAL"
};
```

### Opção 2: Variáveis de Ambiente (Recomendado para produção)

1. Copie `.env.example` para `.env`
2. Preencha com suas credenciais reais
3. Configure seu bundler (Vite, Webpack, etc.) para usar as variáveis

## 🛡️ Arquivos de Segurança

### ✅ Commitados no Git:
- `.env.example` - Template sem credenciais reais
- `firebase-config.template.js` - Template de configuração
- `firebase-config.js` - Versão genérica (sem credenciais)

### ❌ NÃO Commitados (gitignore):
- `.env` - Suas credenciais reais
- `firebase-config.local.js` - Backup das credenciais
- `firebase-config.backup.js` - Outros backups

## 🔧 Para Desenvolvedores

Se você tem acesso às credenciais reais:
1. Substitua o conteúdo de `src/config/firebase-config.js`
2. **NUNCA** commite credenciais reais
3. Use `git status` antes de fazer commit

## 📞 Suporte

Se você não tem acesso às credenciais, entre em contato com o administrador do projeto.
