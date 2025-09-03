# Guia de Uso - Sistema de Controle de Acesso

## Visão Geral

O sistema de controle de acesso garante que apenas usuários autorizados possam acessar o painel administrativo da Paróquia São Lourenço. 

## Como Funciona

### 1. Fluxo de Autenticação

```
Usuário faz login → Sistema verifica se email está na lista de administradores → Acesso permitido/negado
```

### 2. Primeira Configuração

**⚠️ IMPORTANTE:** Antes de usar o sistema pela primeira vez, você DEVE configurar o primeiro administrador.

1. Acesse: `setup-admin.html`
2. Insira o email e nome do primeiro administrador
3. Clique em "Configurar Administrador"
4. Crie uma conta no Firebase Auth com esse email
5. Agora você pode acessar o painel principal

### 3. Gerenciando Administradores

#### Adicionar Novo Administrador:
1. Faça login no painel principal
2. Vá para a seção "Administradores"
3. Clique em "Adicionar Administrador"
4. Insira email e nome (opcional)
5. O novo administrador precisa criar uma conta no Firebase Auth

#### Remover Administrador:
1. Na seção "Administradores"
2. Clique em "Remover" ao lado do administrador
3. Confirme a ação
4. **Nota:** Você não pode remover seu próprio acesso

### 4. Coleção no Firebase

O sistema cria uma coleção chamada `administradores` com os seguintes campos:

```javascript
{
  email: "admin@exemplo.com",      // Email do administrador (sempre em minúsculas)
  name: "Nome do Admin",           // Nome do administrador
  addedAt: timestamp,              // Quando foi adicionado
  addedBy: "quem@adicionou.com",   // Quem adicionou este administrador
  isInitialAdmin: true             // Marca o primeiro administrador (opcional)
}
```

## Cenários de Uso

### Cenário 1: Novo Sistema
1. Acesse `setup-admin.html`
2. Configure o primeiro administrador
3. Crie conta no Firebase Auth
4. Acesse o painel principal

### Cenário 2: Adicionar Mais Administradores
1. Login como administrador existente
2. Seção "Administradores" → "Adicionar"
3. Novo administrador cria conta no Firebase Auth
4. Novo administrador já pode fazer login

### Cenário 3: Usuário Não Autorizado Tenta Acessar
1. Usuário faz login com conta válida do Firebase
2. Sistema verifica lista de administradores
3. Se não estiver na lista: logout automático + mensagem de erro
4. Acesso negado

## Segurança

- **Lista Branca**: Apenas emails na coleção `administradores` têm acesso
- **Verificação Automática**: A cada login, o sistema verifica as permissões
- **Auto-logout**: Usuários não autorizados são deslogados automaticamente
- **Auditoria**: Sistema registra quem adicionou cada administrador

## Troubleshooting

### "Acesso Negado" mesmo sendo administrador
1. Verifique se seu email está exatamente igual na coleção `administradores`
2. Emails são convertidos para minúsculas automaticamente
3. Verifique no console do Firebase se a coleção existe

### Não consegue adicionar o primeiro administrador
1. Verifique a conexão com o Firebase
2. Verifique as regras do Firestore
3. Abra o console do navegador para ver erros

### Erro ao carregar lista de administradores
1. Verifique as permissões do Firestore
2. Certifique-se de que a coleção `administradores` existe
3. Verifique a conexão com o Firebase

## Regras Sugeridas do Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Administradores podem ler/escrever na coleção de administradores
    match /administradores/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Demais coleções - apenas usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Backup de Emergência

Mantenha sempre uma lista backup dos emails de administradores em local seguro. Em caso de problemas, você pode:

1. Acessar diretamente o console do Firebase
2. Criar documentos na coleção `administradores` manualmente
3. Ou usar o arquivo `setup-admin.html` para recriar a configuração
