# Interface Administrativa - Paróquia São Lourenço

Esta é uma interface web administrativa para gerenciar as coleções do Firebase do aplicativo da Paróquia São Lourenço.

## ⚠️ IMPORTANTE - Sistema de Controle de Acesso

A partir desta versão, **nem todos os usuários cadastrados no Firebase Auth têm acesso ao painel administrativo**. O acesso é controlado através de uma lista de administradores autorizados.

### Configuração Inicial

1. **Primeiro Administrador**: Acesse `setup-admin.html` para configurar o primeiro administrador do sistema
2. **Administradores Subsequentes**: Podem ser adicionados através do painel administrativo na seção "Administradores"

### Como Funciona o Controle de Acesso

- Apenas usuários listados na coleção `administradores` podem acessar o painel
- Quando um usuário faz login, o sistema verifica se seu email está na lista de administradores autorizados
- Se não estiver autorizado, o login é rejeitado com uma mensagem de "Acesso negado"
- Administradores podem adicionar/remover outros administradores (exceto eles mesmos)

## Estrutura do Projeto

```
saolourencoadmin/
├── index.html              # Página principal
├── setup-admin.html        # Configuração do primeiro administrador
├── styles.css              # Estilos CSS
├── firebase-config.js      # Configuração do Firebase
├── auth.js                 # Gerenciamento de autenticação e controle de acesso
├── database.js            # Operações básicas do banco de dados
├── database-extended.js   # Operações extendidas para todas as coleções
├── app.js                 # Lógica principal da aplicação
└── README.md              # Este arquivo
```

## Funcionalidades

### Autenticação
- Login com email e senha usando Firebase Auth
- Logout seguro
- Verificação de estado de autenticação

### Gerenciamento de Coleções

#### 1. Avisos Paroquiais (`avisos`)
- **Campos:**
  - `titulo` (string)
  - `descrição` (string)
  - `data` (timestamp)
  - `prioridade` (number)
  - `imagem` (string - URL do Storage)
- **Operações:** Criar, Editar, Excluir, Listar
- **Upload de imagem:** Pasta `Imagens/Avisos` no Storage

#### 2. Avisos Música (`avisos_musica`)
- **Campos:**
  - `titulo` (string)
  - `descrição` (string)
  - `data` (timestamp)
  - `prioridade` (number)
- **Operações:** Criar, Editar, Excluir, Listar

#### 3. Clero (`clero`)
- **Campos:**
  - `nome` (string)
  - `data ordenação` (string)
  - `historia` (string)
  - `imagem` (string - URL do Storage)
- **ID do documento:** Cargo (ex: "pároco")
- **Operações:** Criar, Editar, Excluir, Listar
- **Upload de imagem:** Pasta `Imagens/Clero` no Storage

#### 4. Pastorais (`conteudo_pagina_pastoral`)
- **Campos:**
  - `contato` (string)
  - `coordenação` (string)
  - `texto` (string)
- **ID do documento:** Nome da pastoral
- **Operações:** Criar, Editar, Excluir, Listar

#### 5. Horários das Missas (`horarios_missas`)
- **Campos:**
  - `titulo` (string)
  - `ordem` (number)
  - `missas` (array de strings)
- **ID do documento:** Dia da semana
- **Operações:** Criar, Editar, Excluir, Listar

#### 6. Capelas (`imagens_capelas`)
- **Campos:**
  - `imagem` (string - URL do Storage)
- **ID do documento:** Nome da capela
- **Operações:** Criar, Editar, Excluir, Listar

#### 7. Usuários (`usuarios`) - Somente Leitura
- **Campos:**
  - `nome` (string)
  - `email` (string)
  - `celular` (string)
  - `nascimento` (timestamp)
  - `endereço` (map com campos: bairro, cidade, complemento, estado, logradouro, numero)
  - `sexo` (string)
- **Operações:** Visualizar apenas

#### 8. Administradores (`administradores`) - Controle de Acesso
- **Campos:**
  - `email` (string) - Email do administrador autorizado
  - `name` (string) - Nome do administrador
  - `addedAt` (timestamp) - Data/hora quando foi adicionado
  - `addedBy` (string) - Email de quem adicionou este administrador
  - `isInitialAdmin` (boolean) - Marca o primeiro administrador do sistema
- **Operações:** Adicionar, Remover, Listar
- **Restrições:** Administradores não podem remover a si mesmos

#### 9. Músicas do Mês (`musicas_mes_corrente`) - Estrutura Complexa
- **Campos:** Estrutura complexa com missas e horários
- **ID do documento:** Padrão `mês_ano_diasemana`
- **Operações:** Criar, Editar, Excluir, Listar

## Como Usar

### 1. Configuração Inicial

1. **Clonar e Configurar:**
   ```bash
   git clone https://github.com/tfreitasdevv/saolourencoadmin.git
   cd saolourencoadmin
   
   # Executar script de configuração
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Configurar Credenciais do Firebase:**
   ```bash
   # Editar o arquivo .env com suas credenciais
   nano .env
   # ou
   code .env
   ```
   
   Preencha com suas credenciais do Firebase Console:
   ```env
   VITE_FIREBASE_API_KEY=sua_api_key_real
   VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=seu-projeto-id
   # ... etc
   ```

3. **Configurar Primeiro Administrador:**
   - Acesse o Firebase Console > Firestore
   - Crie a coleção `administradores` com seu email
   - Crie uma conta no Firebase Auth com o mesmo email

### 2. Hospedagem

Você pode hospedar esta interface de várias formas:

#### Firebase Hosting (Recomendado)
```bash
# No diretório saolourencoadmin
firebase init hosting
firebase deploy
```

#### Servidor Local
```bash
# Usando Python (Python 3)
python -m http.server 8000

# Usando Node.js (com http-server)
npx http-server -p 8000
```

#### Hospedagem Web
- Faça upload de todos os arquivos para seu servidor web
- Certifique-se de que o domínio está autorizado no Firebase Console

### 3. Acesso à Interface

1. **Configuração Inicial (Primeira vez):**
   - Acesse `setup-admin.html` para configurar o primeiro administrador
   - Crie uma conta no Firebase Auth com o email configurado

2. **Login Regular:**
   - Acesse `index.html` (página principal)
   - Faça login com uma conta de administrador autorizada
   - Se não tiver permissão, receberá uma mensagem de "Acesso negado"

3. **Gerenciar Administradores:**
   - Na seção "Administradores" do painel, você pode:
     - Adicionar novos administradores
     - Remover administradores existentes (exceto você mesmo)
     - Visualizar quem adicionou cada administrador

## 🔒 **Segurança**

### **Variáveis de Ambiente**
- ✅ Credenciais do Firebase protegidas em arquivos `.env`
- ✅ Templates seguros para configuração
- ✅ `.gitignore` configurado para não expor segredos

### **Controle de Acesso**
- ✅ Lista branca de administradores autorizados
- ✅ Verificação automática a cada login
- ✅ Auto-logout para usuários não autorizados

### **Arquivos Sensíveis (NÃO commitados)**
- `.env` - Credenciais reais
- `firebase-config.js` - Configuração com credenciais

### **Arquivos Seguros (Commitados)**
- `.env.example` - Template sem credenciais
- `firebase-config.template.js` - Template seguro
- `setup.sh` - Script de configuração automática
   - Após o login, você será redirecionado para o painel administrativo

2. **Navegação:**
   - Use o menu lateral para navegar entre as diferentes seções
   - Cada seção corresponde a uma coleção do Firebase

3. **Operações:**
   - **Criar:** Clique no botão "Novo" em cada seção
   - **Editar:** Clique no botão "Editar" na linha desejada
   - **Excluir:** Clique no botão "Excluir" na linha desejada
   - **Upload de Imagens:** Use os campos de arquivo nos formulários

## Segurança

### Regras do Firestore
Configure as regras do Firestore para permitir apenas usuários autenticados:

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

### Regras do Storage
Configure as regras do Storage para permitir uploads autenticados:

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

## Personalização

### Adicionar Novas Coleções
1. Adicione a nova coleção em `database-extended.js`
2. Crie os métodos `load`, `save` e `delete`
3. Adicione a seção correspondente no HTML
4. Implemente o modal e formulário
5. Adicione os manipuladores de eventos em `app.js`

### Modificar Estilos
- Edite o arquivo `styles.css` para personalizar a aparência
- As cores principais podem ser alteradas nas variáveis CSS

### Adicionar Validações
- Implemente validações adicionais nos métodos de submit em `app.js`
- Use bibliotecas como Joi ou Yup para validações mais complexas

## Solução de Problemas

### Erro de Autenticação
- Verifique se o domínio está autorizado no Firebase Console
- Confirme se as credenciais no `firebase-config.js` estão corretas

### Erro de Permissão no Firestore
- Verifique as regras de segurança do Firestore
- Certifique-se de que o usuário está autenticado

### Erro de Upload de Imagem
- Verifique as regras de segurança do Storage
- Confirme se o bucket do Storage está configurado corretamente

### Interface não Carrega
- Verifique o console do navegador para erros JavaScript
- Confirme se todos os arquivos estão sendo carregados corretamente

## Contribuição

Para contribuir com melhorias:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Implemente suas modificações
4. Teste thoroughly
5. Envie um pull request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
