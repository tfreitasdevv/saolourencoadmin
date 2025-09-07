# Implementação da Coleção "Confissões"

## Resumo
Foi implementada uma nova funcionalidade para gerenciar a coleção "confissões" no Firebase, permitindo a administração de 4 seções de confissão com IDs fixos: `primeira_secao`, `segunda_secao`, `terceira_secao` e `quarta_secao`.

## Estrutura da Coleção
- **Nome da coleção**: `confissoes`
- **Documentos esperados**: 4 documentos com IDs fixos
- **Estrutura de cada documento**:
  - `titulo` (string): Título da seção
  - `texto` (string): Texto da confissão

## Alterações Implementadas

### 1. Database Manager (`src/js/database.js`)
- ✅ Adicionada `confissoes: 'confissoes'` ao objeto `collections`
- ✅ Adicionada chamada `await this.loadConfissoes()` em `loadAllData()`
- ✅ Implementada função `async loadConfissoes()`
- ✅ Implementada função `createConfissaoCard(id, data)`
- ✅ Implementada função `async saveConfissao(id, data)`
- ✅ Adicionada função global `window.editConfissao(id)`

### 2. Interface HTML (`src/pages/index.html`)
- ✅ Adicionado link de navegação no menu mobile: `data-section="confissoes"`
- ✅ Adicionado link de navegação no menu desktop: `data-section="confissoes"`
- ✅ Criada seção `confissoes-section` com container para cards
- ✅ Adicionado modal `confissaoModal` para edição
- ✅ Utilizando ícone `fa-cross` para representar confissões

### 3. Aplicação Principal (`src/js/app.js`)
- ✅ Adicionado handler de formulário em `initFormHandlers()`
- ✅ Implementada função `async handleConfissaoSubmit()`
- ✅ Implementada função `resetConfissaoForm()`
- ✅ Adicionada função global `window.openConfissaoModal(data, id)`

## Como Usar

### 1. Acesso à Seção
1. Faça login na interface administrativa
2. Clique em "Confissões" no menu lateral (ícone de cruz)
3. A seção exibirá os cards das confissões cadastradas

### 2. Editar uma Confissão
1. Clique no botão "Editar" (ícone de lápis) em qualquer card
2. O modal de edição será aberto com os dados atuais
3. Modifique o título e/ou texto conforme necessário
4. Clique em "Salvar" para confirmar as alterações

### 3. Estrutura dos Cards
Cada card exibe:
- **Título da Seção**: Nome amigável baseado no ID
- **Título**: Campo editável do documento
- **Texto**: Prévia do texto (limitado a 150 caracteres)
- **ID**: Identificador único do documento

## IDs e Títulos das Seções
- `primeira_secao` → "Primeira Seção"
- `segunda_secao` → "Segunda Seção"
- `terceira_secao` → "Terceira Seção"
- `quarta_secao` → "Quarta Seção"

## Características Especiais

### 1. IDs Fixos
- Os documentos têm IDs predefinidos e não podem ser alterados
- Não há funcionalidade de criação/exclusão, apenas edição
- O campo ID no modal é somente leitura

### 2. Ordenação
- Os documentos são carregados em ordem alfabética por ID
- Isso garante que sempre apareçam na sequência: primeira, segunda, terceira, quarta

### 3. Validação
- Ambos os campos (título e texto) são obrigatórios
- O formulário não será enviado se algum campo estiver vazio

## Próximos Passos
Para testar a funcionalidade:

1. **Criar os documentos no Firebase**:
   ```javascript
   // Execute no console do Firebase ou através de script
   db.collection('confissoes').doc('primeira_secao').set({
     titulo: 'Primeira Seção',
     texto: 'Texto da primeira seção de confissão.'
   });
   
   db.collection('confissoes').doc('segunda_secao').set({
     titulo: 'Segunda Seção', 
     texto: 'Texto da segunda seção de confissão.'
   });
   
   db.collection('confissoes').doc('terceira_secao').set({
     titulo: 'Terceira Seção',
     texto: 'Texto da terceira seção de confissão.'
   });
   
   db.collection('confissoes').doc('quarta_secao').set({
     titulo: 'Quarta Seção',
     texto: 'Texto da quarta seção de confissão.'
   });
   ```

2. **Configurar Regras do Firestore** (se necessário):
   Certifique-se de que as regras permitem leitura e escrita na coleção `confissoes`.

3. **Testar a Funcionalidade**:
   - Acesse a seção Confissões
   - Verifique se os 4 cards aparecem
   - Teste a edição de cada seção
   - Confirme se as alterações são salvas corretamente

## Observações
- A implementação segue o padrão estabelecido pelas outras coleções do projeto
- Utiliza as mesmas funções de notificação (`showSuccess`, `showError`) já existentes
- Mantém consistência visual e de UX com o resto da aplicação
- Logs de debug foram incluídos para facilitar troubleshooting
