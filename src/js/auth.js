// Authentication management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.authorizedUsers = [];
        this.initAuthListener();
        this.loadAuthorizedUsers();
    }

    async loadAuthorizedUsers() {
        try {
            const snapshot = await db.collection('administradores').get();
            this.authorizedUsers = [];
            snapshot.forEach(doc => {
                this.authorizedUsers.push(doc.data().email.toLowerCase());
            });
            console.log('Usuários autorizados carregados:', this.authorizedUsers);
        } catch (error) {
            console.error('Erro ao carregar usuários autorizados:', error);
        }
    }

    isUserAuthorized(email) {
        return this.authorizedUsers.includes(email.toLowerCase());
    }

    initAuthListener() {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                // Aguarda o carregamento dos usuários autorizados se ainda não foram carregados
                if (this.authorizedUsers.length === 0) {
                    await this.loadAuthorizedUsers();
                }
                
                if (this.isUserAuthorized(user.email)) {
                    this.currentUser = user;
                    this.showAdminPanel();
                    document.getElementById('userEmail').textContent = user.email;
                } else {
                    // Usuário não autorizado - fazer logout e mostrar erro
                    await auth.signOut();
                    this.showUnauthorizedError();
                }
            } else {
                this.currentUser = null;
                this.showLoginForm();
            }
        });
    }

    async login(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            // A verificação de autorização será feita no authStateChanged
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async logout() {
        try {
            await auth.signOut();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    showUnauthorizedError() {
        document.getElementById('loginForm').style.display = 'flex';
        document.getElementById('adminPanel').style.display = 'none';
        const errorDiv = document.getElementById('authError');
        errorDiv.textContent = 'Acesso negado. Você não tem permissão para acessar o painel administrativo.';
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontWeight = 'bold';
    }

    showLoginForm() {
        document.getElementById('loginForm').style.display = 'flex';
        document.getElementById('adminPanel').style.display = 'none';
        // Limpar mensagem de erro ao mostrar o formulário novamente
        const errorDiv = document.getElementById('authError');
        if (errorDiv) {
            errorDiv.textContent = '';
        }
    }

    showAdminPanel() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'flex';
        // Load initial data
        window.dbManager.loadAllData();
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Métodos para gerenciar administradores autorizados
    async addAuthorizedUser(email, name = '') {
        try {
            await db.collection('administradores').add({
                email: email.toLowerCase(),
                name: name,
                addedAt: firebase.firestore.FieldValue.serverTimestamp(),
                addedBy: this.currentUser ? this.currentUser.email : 'system'
            });
            await this.loadAuthorizedUsers();
            return { success: true };
        } catch (error) {
            console.error('Erro ao adicionar administrador:', error);
            return { success: false, error: error.message };
        }
    }

    async removeAuthorizedUser(email) {
        try {
            const snapshot = await db.collection('administradores')
                .where('email', '==', email.toLowerCase())
                .get();
            
            const deletePromises = [];
            snapshot.forEach(doc => {
                deletePromises.push(doc.ref.delete());
            });
            
            await Promise.all(deletePromises);
            await this.loadAuthorizedUsers();
            return { success: true };
        } catch (error) {
            console.error('Erro ao remover administrador:', error);
            return { success: false, error: error.message };
        }
    }

    async getAuthorizedUsersList() {
        try {
            const snapshot = await db.collection('administradores')
                .orderBy('email', 'asc')
                .get();
            
            const users = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                users.push({
                    id: doc.id,
                    email: data.email,
                    name: data.name || '',
                    addedAt: data.addedAt,
                    addedBy: data.addedBy
                });
            });
            
            return users;
        } catch (error) {
            console.error('Erro ao buscar lista de administradores:', error);
            return [];
        }
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Auth form handler
document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('authError');
    
    errorDiv.textContent = '';
    
    const result = await authManager.login(email, password);
    
    if (!result.success) {
        errorDiv.textContent = `Erro ao fazer login: ${result.error}`;
    }
});

// Logout button handler
document.getElementById('logoutBtn').addEventListener('click', async () => {
    const result = await authManager.logout();
    if (!result.success) {
        showError(`Erro ao sair: ${result.error}`);
    }
});
