// Database management
class DatabaseManager {
    constructor() {
        this.collections = {
            avisos: 'avisos',
            avisosMsuica: 'avisos_musica',
            clero: 'clero',
            pastorais: 'conteudo_pagina_pastoral',
            horarios: 'horarios_missas',
            capelas: 'imagens_capelas',
            musicas: 'musicas_mes_corrente',
            usuarios: 'usuarios'
        };
    }

    // Utility functions
    showLoading() {
        document.getElementById('loading').style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    formatDate(timestamp) {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('pt-BR');
    }

    formatDateTime(timestamp) {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('pt-BR');
    }

    // Load all initial data
    async loadAllData() {
        await this.loadAvisos();
        await this.loadAvisosMsuica();
        await this.loadClero();
        await this.loadPastorais();
        await this.loadHorarios();
        await this.loadCapelas();
        await this.loadUsuarios();
    }

    // Avisos Paroquiais
    async loadAvisos() {
        try {
            this.showLoading();
            const snapshot = await db.collection(this.collections.avisos)
                .orderBy('data', 'desc')
                .get();
            
            const tbody = document.querySelector('#avisosTable tbody');
            tbody.innerHTML = '';
            
            snapshot.forEach(doc => {
                const data = doc.data();
                const row = this.createAvisoRow(doc.id, data);
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Erro ao carregar avisos:', error);
            alert('Erro ao carregar avisos');
        } finally {
            this.hideLoading();
        }
    }

    createAvisoRow(id, data) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.titulo || ''}</td>
            <td>${data.descricao ? data.descricao.substring(0, 100) + '...' : ''}</td>
            <td>${this.formatDate(data.data)}</td>
            <td>${data.prioridade || ''}</td>
            <td>${data.imagem ? '<img src="' + data.imagem + '" alt="Imagem">' : 'Sem imagem'}</td>
            <td>
                <button class="btn-edit" onclick="editAviso('${id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-danger" onclick="deleteAviso('${id}')">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </td>
        `;
        return row;
    }

    async saveAviso(avisoData, id = null) {
        try {
            this.showLoading();
            
            if (id) {
                await db.collection(this.collections.avisos).doc(id).update(avisoData);
            } else {
                await db.collection(this.collections.avisos).add(avisoData);
            }
            
            await this.loadAvisos();
            return { success: true };
        } catch (error) {
            console.error('Erro ao salvar aviso:', error);
            return { success: false, error: error.message };
        } finally {
            this.hideLoading();
        }
    }

    async deleteAviso(id) {
        if (!confirm('Tem certeza que deseja excluir este aviso?')) return;
        
        try {
            this.showLoading();
            await db.collection(this.collections.avisos).doc(id).delete();
            await this.loadAvisos();
            alert('Aviso excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir aviso:', error);
            alert('Erro ao excluir aviso');
        } finally {
            this.hideLoading();
        }
    }

    // Avisos Música
    async loadAvisosMsuica() {
        try {
            const snapshot = await db.collection(this.collections.avisosMsuica)
                .orderBy('data', 'desc')
                .get();
            
            const tbody = document.querySelector('#avisosMusicaTable tbody');
            tbody.innerHTML = '';
            
            snapshot.forEach(doc => {
                const data = doc.data();
                const row = this.createAvisoMusicaRow(doc.id, data);
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Erro ao carregar avisos música:', error);
        }
    }

    createAvisoMusicaRow(id, data) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.titulo || ''}</td>
            <td>${data.descricao ? data.descricao.substring(0, 100) + '...' : ''}</td>
            <td>${this.formatDate(data.data)}</td>
            <td>${data.prioridade || ''}</td>
            <td>
                <button class="btn-edit" onclick="editAvisoMusica('${id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-danger" onclick="deleteAvisoMusica('${id}')">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </td>
        `;
        return row;
    }

    // Clero
    async loadClero() {
        try {
            const snapshot = await db.collection(this.collections.clero).get();
            
            const tbody = document.querySelector('#cleroTable tbody');
            tbody.innerHTML = '';
            
            snapshot.forEach(doc => {
                const data = doc.data();
                const row = this.createCleroRow(doc.id, data);
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Erro ao carregar clero:', error);
        }
    }

    createCleroRow(id, data) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${id}</td>
            <td>${data.nome || ''}</td>
            <td>${data['data ordenação'] || ''}</td>
            <td>${data.historia ? data.historia.substring(0, 100) + '...' : ''}</td>
            <td>${data.imagem ? '<img src="' + data.imagem + '" alt="Imagem">' : 'Sem imagem'}</td>
            <td>
                <button class="btn-edit" onclick="editClero('${id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-danger" onclick="deleteClero('${id}')">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </td>
        `;
        return row;
    }

    // Pastorais
    async loadPastorais() {
        try {
            const snapshot = await db.collection(this.collections.pastorais).get();
            
            const tbody = document.querySelector('#pastoraisTable tbody');
            tbody.innerHTML = '';
            
            snapshot.forEach(doc => {
                const data = doc.data();
                const row = this.createPastoralRow(doc.id, data);
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Erro ao carregar pastorais:', error);
        }
    }

    createPastoralRow(id, data) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${id}</td>
            <td>${data.contato || ''}</td>
            <td>${data.coordenacao || ''}</td>
            <td>${data.texto ? data.texto.substring(0, 100) + '...' : ''}</td>
            <td>
                <button class="btn-edit" onclick="editPastoral('${id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-danger" onclick="deletePastoral('${id}')">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </td>
        `;
        return row;
    }

    // File upload
    async uploadImage(file, path) {
        try {
            const ref = storage.ref().child(path);
            const snapshot = await ref.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();
            return { success: true, url: downloadURL };
        } catch (error) {
            console.error('Erro ao fazer upload da imagem:', error);
            return { success: false, error: error.message };
        }
    }

    // Get document by ID
    async getDocument(collection, id) {
        try {
            const doc = await db.collection(collection).doc(id).get();
            if (doc.exists) {
                return { success: true, data: doc.data() };
            } else {
                return { success: false, error: 'Documento não encontrado' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Initialize database manager
window.dbManager = new DatabaseManager();

// Global functions for UI interactions
window.editAviso = async function(id) {
    const result = await window.dbManager.getDocument('avisos', id);
    if (result.success) {
        openAvisoModal(result.data, id);
    } else {
        alert('Erro ao carregar aviso');
    }
};

window.deleteAviso = function(id) {
    window.dbManager.deleteAviso(id);
};

window.editAvisoMusica = async function(id) {
    // Implementar função similar
};

window.deleteAvisoMusica = function(id) {
    // Implementar função similar
};

window.editClero = async function(id) {
    // Implementar função similar
};

window.deleteClero = function(id) {
    // Implementar função similar
};

window.editPastoral = async function(id) {
    // Implementar função similar
};

window.deletePastoral = function(id) {
    // Implementar função similar
};
