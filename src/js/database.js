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
        console.log('🔄 Iniciando carregamento de todos os dados...');
        console.log('📊 Firebase app:', window.firebase.app());
        console.log('🗄️ Firestore instance:', window.db);
        
        try {
            console.log('🎯 Carregando Avisos...');
            await this.loadAvisos();
            console.log('✅ Avisos carregados com sucesso');
        } catch (error) {
            console.error('❌ Erro ao carregar Avisos:', error);
        }
        
        try {
            console.log('🎵 Carregando Avisos Música...');
            await this.loadAvisosMsuica();
            console.log('✅ Avisos Música carregados com sucesso');
        } catch (error) {
            console.error('❌ Erro ao carregar Avisos Música:', error);
        }
        
        try {
            await this.loadClero();
            await this.loadPastorais();
            await this.loadHorarios();
            await this.loadCapelas();
            await this.loadMusicas();
            await this.loadUsuarios();
            console.log('✅ Todas as outras coleções carregadas');
        } catch (error) {
            console.error('❌ Erro ao carregar outras coleções:', error);
        }
    }

    // Avisos Paroquiais
    async loadAvisos() {
        try {
            console.log('🎯 [DEBUG] Iniciando carregamento de avisos...');
            console.log('🎯 [DEBUG] db disponível:', !!window.db);
            console.log('🎯 [DEBUG] this.collections.avisos:', this.collections.avisos);
            
            this.showLoading();
            
            const cardsContainer = document.getElementById('avisosCards');
            const emptyState = document.getElementById('avisosEmpty');
            
            console.log('🎯 [DEBUG] Elementos DOM encontrados:', { cardsContainer, emptyState });
            
            if (!cardsContainer) {
                throw new Error('Elemento avisosCards não encontrado');
            }
            
            console.log('🎯 [DEBUG] Executando consulta Firebase...');
            const snapshot = await db.collection(this.collections.avisos)
                .get();
            
            console.log('🎯 [DEBUG] Snapshot obtido:', snapshot.size, 'documentos');
            cardsContainer.innerHTML = '';
            
            if (snapshot.empty) {
                console.log('📭 [DEBUG] Nenhum aviso encontrado, mostrando estado vazio');
                if (emptyState) emptyState.style.display = 'block';
            } else {
                console.log('📄 [DEBUG] Renderizando', snapshot.size, 'avisos');
                if (emptyState) emptyState.style.display = 'none';
                snapshot.forEach(doc => {
                    const data = doc.data();
                    console.log('📄 [DEBUG] Processando aviso:', doc.id, data);
                    const card = this.createAvisoCard(doc.id, data);
                    cardsContainer.appendChild(card);
                });
            }
        } catch (error) {
            console.error('❌ [DEBUG] Erro ao carregar avisos:', error);
            console.error('❌ [DEBUG] Stack trace:', error.stack);
            alert('Erro ao carregar avisos: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    createAvisoCard(id, data) {
        const card = document.createElement('div');
        card.className = 'data-card';
        
        // Corrigir o tratamento da prioridade para evitar erro toLowerCase
        let priorityClass = 'priority-baixa';
        if (data.prioridade && typeof data.prioridade === 'string') {
            priorityClass = `priority-${data.prioridade.toLowerCase()}`;
        } else if (data.prioridade && typeof data.prioridade === 'number') {
            priorityClass = `priority-${data.prioridade}`;
        }
        
        const imageElement = data.imagem ? 
            `<img src="${data.imagem}" alt="Imagem do aviso" class="card-image">` : 
            '<div class="text-gray-400 text-xs">Sem imagem</div>';
        
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${data.titulo || 'Sem título'}</h3>
                <div class="card-actions">
                    <button class="card-btn card-btn-edit" onclick="editAviso('${id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="card-btn card-btn-delete" onclick="deleteAviso('${id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-field">
                    <span class="card-label">Descrição:</span>
                    <span class="card-value">${data.descricao ? (data.descricao.replace(/\\n/g, ' ').length > 100 ? data.descricao.replace(/\\n/g, ' ').substring(0, 100) + '...' : data.descricao.replace(/\\n/g, ' ')) : 'Sem descrição'}</span>
                </div>
                <div class="card-field">
                    <span class="card-label">Data:</span>
                    <span class="card-value">${this.formatDate(data.data)}</span>
                </div>
                <div class="card-field">
                    <span class="card-label">Prioridade:</span>
                    <span class="card-value">
                        <span class="priority-badge ${priorityClass}">${data.prioridade || 'Não definida'}</span>
                    </span>
                </div>
                <div class="card-field">
                    <span class="card-label">Imagem:</span>
                    <span class="card-value">${imageElement}</span>
                </div>
            </div>
        `;
        return card;
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
            console.log('🎵 [DEBUG] Iniciando carregamento de avisos música...');
            console.log('🎵 [DEBUG] db disponível:', !!window.db);
            console.log('🎵 [DEBUG] this.collections.avisosMsuica:', this.collections.avisosMsuica);
            
            const cardsContainer = document.getElementById('avisosMusicaCards');
            const emptyState = document.getElementById('avisosMusicaEmpty');
            
            console.log('🎵 [DEBUG] Elementos DOM encontrados:', { cardsContainer, emptyState });
            
            if (!cardsContainer) {
                throw new Error('Elemento avisosMusicaCards não encontrado');
            }
            
            console.log('🎵 [DEBUG] Executando consulta Firebase...');
            const snapshot = await db.collection(this.collections.avisosMsuica)
                .get();
            
            console.log('🎵 [DEBUG] Snapshot avisos música obtido:', snapshot.size, 'documentos');
            cardsContainer.innerHTML = '';
            
            if (snapshot.empty) {
                console.log('📭 [DEBUG] Nenhum aviso música encontrado, mostrando estado vazio');
                if (emptyState) emptyState.style.display = 'block';
            } else {
                console.log('📄 [DEBUG] Renderizando', snapshot.size, 'avisos música');
                if (emptyState) emptyState.style.display = 'none';
                snapshot.forEach(doc => {
                    const data = doc.data();
                    console.log('📄 [DEBUG] Processando aviso música:', doc.id, data);
                    const card = this.createAvisoMusicaCard(doc.id, data);
                    cardsContainer.appendChild(card);
                });
            }
        } catch (error) {
            console.error('❌ [DEBUG] Erro ao carregar avisos música:', error);
            console.error('❌ [DEBUG] Stack trace:', error.stack);
            alert('Erro ao carregar avisos música: ' + error.message);
        }
    }

    createAvisoMusicaCard(id, data) {
        const card = document.createElement('div');
        card.className = 'data-card';
        
        // Corrigir o tratamento da prioridade para evitar erro toLowerCase
        let priorityClass = 'priority-baixa';
        if (data.prioridade && typeof data.prioridade === 'string') {
            priorityClass = `priority-${data.prioridade.toLowerCase()}`;
        } else if (data.prioridade && typeof data.prioridade === 'number') {
            priorityClass = `priority-${data.prioridade}`;
        }
        
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${data.titulo || 'Sem título'}</h3>
                <div class="card-actions">
                    <button class="card-btn card-btn-edit" onclick="editAvisoMusica('${id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="card-btn card-btn-delete" onclick="deleteAvisoMusica('${id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-field">
                    <span class="card-label">Descrição:</span>
                    <span class="card-value">${data.descricao ? (data.descricao.replace(/\\n/g, ' ').length > 100 ? data.descricao.replace(/\\n/g, ' ').substring(0, 100) + '...' : data.descricao.replace(/\\n/g, ' ')) : 'Sem descrição'}</span>
                </div>
                <div class="card-field">
                    <span class="card-label">Data:</span>
                    <span class="card-value">${this.formatDate(data.data)}</span>
                </div>
                <div class="card-field">
                    <span class="card-label">Prioridade:</span>
                    <span class="card-value">
                        <span class="priority-badge ${priorityClass}">${data.prioridade || 'Não definida'}</span>
                    </span>
                </div>
            </div>
        `;
        return card;
    }

    // Clero
    async loadClero() {
        try {
            const snapshot = await db.collection(this.collections.clero).get();
            
            const cardsContainer = document.getElementById('cleroCards');
            const emptyState = document.getElementById('cleroEmpty');
            cardsContainer.innerHTML = '';
            
            if (snapshot.empty) {
                emptyState.style.display = 'block';
            } else {
                emptyState.style.display = 'none';
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const card = this.createCleroCard(doc.id, data);
                    cardsContainer.appendChild(card);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar clero:', error);
        }
    }

    createCleroCard(id, data) {
        const card = document.createElement('div');
        card.className = 'data-card';
        
        const imageElement = data.imagem ? 
            `<img src="${data.imagem}" alt="Foto de ${data.nome}" class="card-image">` : 
            '<div class="text-gray-400 text-xs">Sem foto</div>';
        
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${data.nome || 'Nome não informado'}</h3>
                <div class="card-actions">
                    <button class="card-btn card-btn-edit" onclick="editClero('${id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="card-btn card-btn-delete" onclick="deleteClero('${id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-field">
                    <span class="card-label">Cargo:</span>
                    <span class="card-value">${id || 'Não definido'}</span>
                </div>
                <div class="card-field">
                    <span class="card-label">Ordenação:</span>
                    <span class="card-value">${data['data ordenação'] || 'Não informada'}</span>
                </div>
                <div class="card-field">
                    <span class="card-label">História:</span>
                    <span class="card-value">${data.historia ? (data.historia.length > 100 ? data.historia.substring(0, 100) + '...' : data.historia) : 'Sem história'}</span>
                </div>
                <div class="card-field">
                    <span class="card-label">Foto:</span>
                    <span class="card-value">${imageElement}</span>
                </div>
            </div>
        `;
        return card;
    }

    // Pastorais
    async loadPastorais() {
        try {
            const snapshot = await db.collection(this.collections.pastorais).get();
            
            const cardsContainer = document.getElementById('pastoraisCards');
            const emptyState = document.getElementById('pastoraisEmpty');
            cardsContainer.innerHTML = '';
            
            if (snapshot.empty) {
                emptyState.style.display = 'block';
            } else {
                emptyState.style.display = 'none';
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const card = this.createPastoralCard(doc.id, data);
                    cardsContainer.appendChild(card);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar pastorais:', error);
        }
    }

    createPastoralCard(id, data) {
        const card = document.createElement('div');
        card.className = 'data-card';
        
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${id || 'Nome não informado'}</h3>
                <div class="card-actions">
                    <button class="card-btn card-btn-edit" onclick="editPastoral('${id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="card-btn card-btn-delete" onclick="deletePastoral('${id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-field">
                    <span class="card-label">Contato:</span>
                    <span class="card-value">${data.contato || 'Não informado'}</span>
                </div>
                <div class="card-field">
                    <span class="card-label">Coordenação:</span>
                    <span class="card-value">${data.coordenacao || 'Não informada'}</span>
                </div>
                <div class="card-field">
                    <span class="card-label">Descrição:</span>
                    <span class="card-value">${data.texto ? (data.texto.length > 100 ? data.texto.substring(0, 100) + '...' : data.texto) : 'Sem descrição'}</span>
                </div>
            </div>
        `;
        return card;
    }

    // Músicas do Mês
    async loadMusicas() {
        try {
            const snapshot = await db.collection(this.collections.musicas).get();
            
            const cardsContainer = document.getElementById('musicasCards');
            const emptyState = document.getElementById('musicasEmpty');
            cardsContainer.innerHTML = '';
            
            if (snapshot.empty) {
                emptyState.style.display = 'block';
            } else {
                emptyState.style.display = 'none';
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const card = this.createMusicaCard(doc.id, data);
                    cardsContainer.appendChild(card);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar músicas:', error);
        }
    }

    createMusicaCard(id, data) {
        const card = document.createElement('div');
        card.className = 'data-card';
        
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">Músicas de ${data.mes || id}</h3>
                <div class="card-actions">
                    <button class="card-btn card-btn-edit" onclick="editMusica('${id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="card-btn card-btn-delete" onclick="deleteMusica('${id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-field">
                    <span class="card-label">ID:</span>
                    <span class="card-value">${id}</span>
                </div>
                <div class="card-field">
                    <span class="card-label">Mês:</span>
                    <span class="card-value">${data.mes || 'Não informado'}</span>
                </div>
                <div class="card-field">
                    <span class="card-label">Quantidade:</span>
                    <span class="card-value">${data.quantidade || 'Não informada'}</span>
                </div>
            </div>
        `;
        return card;
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
