# Configuração Rápida - Interface Administrativa

## Pré-requisitos
- Conta no Firebase
- Projeto Firebase configurado
- Firebase CLI instalado (opcional, para deploy)

## Passos de Configuração

### 1. Configure o Firebase
1. Vá para o [Console do Firebase](https://console.firebase.google.com/)
2. Selecione seu projeto "sao-lourenco"
3. Vá para "Configurações do projeto" > "Geral"
4. Na seção "Seus aplicativos", encontre as configurações web
5. Copie as configurações e cole no arquivo `firebase-config.js`

### 2. Configure a Autenticação
1. No Console do Firebase, vá para "Authentication"
2. Ative o provedor "Email/senha"
3. Adicione usuários autorizados na aba "Users"

### 3. Configure as Regras de Segurança

#### Firestore:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Storage:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Deploy (Opcional)

#### Via Firebase Hosting:
```bash
cd saolourencoadmin
firebase init hosting
firebase deploy
```

#### Via Servidor Local:
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server -p 8000
```

### 5. Primeiro Acesso
1. Acesse a URL da interface
2. Faça login com as credenciais configuradas
3. Comece a gerenciar as coleções

## Solução Rápida de Problemas

### "Firebase not defined"
- Verifique se o firebase-config.js está sendo carregado
- Confirme se as URLs dos scripts Firebase estão corretas

### "Permission denied"
- Verifique se o usuário está logado
- Confirme se as regras de segurança estão configuradas

### "Domain not authorized"
- Adicione o domínio em Authentication > Settings > Authorized domains

## Suporte
Para suporte técnico, consulte a documentação do Firebase ou entre em contato com o desenvolvedor.
