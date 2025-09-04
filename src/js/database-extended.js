// Extended database management with all collections
class ExtendedDatabaseManager extends DatabaseManager {
    
    // Avisos Música - Extended methods
    async saveAvisoMusica(data, id = null) {
        try {
            this.showLoading();
            
            if (id) {
                await db.collection(this.collections.avisosMsuica).doc(id).update(data);
            } else {
                await db.collection(this.collections.avisosMsuica).add(data);
            }
            
            await this.loadAvisosMsuica();
            return { success: true };
        } catch (error) {
            console.error('Erro ao salvar aviso música:', error);
            return { success: false, error: error.message };
        } finally {
            this.hideLoading();
        }
    }

    async deleteAvisoMusica(id) {
        if (!confirm('Tem certeza que deseja excluir este aviso?')) return;
        
        try {
            this.showLoading();
            await db.collection(this.collections.avisosMsuica).doc(id).delete();
            await this.loadAvisosMsuica();
            alert('Aviso excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir aviso música:', error);
            alert('Erro ao excluir aviso música');
        } finally {
            this.hideLoading();
        }
    }

    // Clero - Extended methods
    async saveClero(data, cargo) {
        try {
            this.showLoading();
            await db.collection(this.collections.clero).doc(cargo).set(data);
            await this.loadClero();
            return { success: true };
        } catch (error) {
            console.error('Erro ao salvar membro do clero:', error);
            return { success: false, error: error.message };
        } finally {
            this.hideLoading();
        }
    }

    async deleteClero(cargo) {
        if (!confirm('Tem certeza que deseja excluir este membro do clero?')) return;
        
        try {
            this.showLoading();
            await db.collection(this.collections.clero).doc(cargo).delete();
            await this.loadClero();
            alert('Membro do clero excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir membro do clero:', error);
            alert('Erro ao excluir membro do clero');
        } finally {
            this.hideLoading();
        }
    }

    // Pastorais - Extended methods
    async savePastoral(data, nome) {
        try {
            this.showLoading();
            await db.collection(this.collections.pastorais).doc(nome).set(data);
            await this.loadPastorais();
            return { success: true };
        } catch (error) {
            console.error('Erro ao salvar pastoral:', error);
            return { success: false, error: error.message };
        } finally {
            this.hideLoading();
        }
    }

    async deletePastoral(nome) {
        if (!confirm('Tem certeza que deseja excluir esta pastoral?')) return;
        
        try {
            this.showLoading();
            await db.collection(this.collections.pastorais).doc(nome).delete();
            await this.loadPastorais();
            alert('Pastoral excluída com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir pastoral:', error);
            alert('Erro ao excluir pastoral');
        } finally {
            this.hideLoading();
        }
    }

    // Horários - New methods
    async loadHorarios() {
        try {
            const snapshot = await db.collection(this.collections.horarios)
                .orderBy('ordem', 'asc')
                .get();
            
            const cardsContainer = document.getElementById('horariosCards');
            const emptyState = document.getElementById('horariosEmpty');
            cardsContainer.innerHTML = '';
            
            if (snapshot.empty) {
                emptyState.style.display = 'block';
            } else {
                emptyState.style.display = 'none';
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const card = this.createHorarioCard(doc.id, data);
                    cardsContainer.appendChild(card);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar horários:', error);
        }
    }

    createHorarioCard(id, data) {
        const card = document.createElement('div');
        card.className = 'data-card';
        
        const missas = Array.isArray(data.missas) ? data.missas.join(', ') : (data.missas || 'Nenhuma missa definida');
        
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${data.titulo || id}</h3>
                <div class="card-actions">
                    <button class="card-btn card-btn-edit" onclick="editHorario('${id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="card-btn card-btn-delete" onclick="deleteHorario('${id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-field">
                    <span class="card-label">Dia:</span>
                    <span class="card-value">${id}</span>
                </div>
                <div class="card-field">
                    <span class="card-label">Ordem:</span>
                    <span class="card-value">${data.ordem || 'Não definida'}</span>
                </div>
                <div class="card-field">
                    <span class="card-label">Missas:</span>
                    <span class="card-value">${missas}</span>
                </div>
            </div>
        `;
        return card;
    }

    async saveHorario(data, dia) {
        try {
            this.showLoading();
            await db.collection(this.collections.horarios).doc(dia).set(data);
            await this.loadHorarios();
            return { success: true };
        } catch (error) {
            console.error('Erro ao salvar horário:', error);
            return { success: false, error: error.message };
        } finally {
            this.hideLoading();
        }
    }

    async deleteHorario(dia) {
        if (!confirm('Tem certeza que deseja excluir este horário?')) return;
        
        try {
            this.showLoading();
            await db.collection(this.collections.horarios).doc(dia).delete();
            await this.loadHorarios();
            alert('Horário excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir horário:', error);
            alert('Erro ao excluir horário');
        } finally {
            this.hideLoading();
        }
    }

    // Capelas - New methods
    async loadCapelas() {
        try {
            const snapshot = await db.collection(this.collections.capelas).get();
            
            const cardsContainer = document.getElementById('capelasCards');
            const emptyState = document.getElementById('capelasEmpty');
            cardsContainer.innerHTML = '';
            
            if (snapshot.empty) {
                emptyState.style.display = 'block';
            } else {
                emptyState.style.display = 'none';
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const card = this.createCapelaCard(doc.id, data);
                    cardsContainer.appendChild(card);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar capelas:', error);
        }
    }

    createCapelaCard(id, data) {
        const card = document.createElement('div');
        card.className = 'data-card';
        
        const imageElement = data.imagem ? 
            `<img src="${data.imagem}" alt="Imagem da ${id}" class="card-image">` : 
            '<div class="text-gray-400 text-xs">Sem imagem</div>';
        
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${id}</h3>
                <div class="card-actions">
                    <button class="card-btn card-btn-edit" onclick="editCapela('${id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="card-btn card-btn-delete" onclick="deleteCapela('${id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-field">
                    <span class="card-label">Nome:</span>
                    <span class="card-value">${id}</span>
                </div>
                <div class="card-field">
                    <span class="card-label">Imagem:</span>
                    <span class="card-value">${imageElement}</span>
                </div>
            </div>
        `;
        return card;
    }

    async saveCapela(data, nome) {
        try {
            this.showLoading();
            await db.collection(this.collections.capelas).doc(nome).set(data);
            await this.loadCapelas();
            return { success: true };
        } catch (error) {
            console.error('Erro ao salvar capela:', error);
            return { success: false, error: error.message };
        } finally {
            this.hideLoading();
        }
    }

    async deleteCapela(nome) {
        if (!confirm('Tem certeza que deseja excluir esta capela?')) return;
        
        try {
            this.showLoading();
            await db.collection(this.collections.capelas).doc(nome).delete();
            await this.loadCapelas();
            alert('Capela excluída com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir capela:', error);
            alert('Erro ao excluir capela');
        } finally {
            this.hideLoading();
        }
    }

    // Usuários - New methods (read-only)
    async loadUsuarios() {
        try {
            const snapshot = await db.collection(this.collections.usuarios)
                .orderBy('nome', 'asc')
                .get();
            
            const cardsContainer = document.getElementById('usuariosCards');
            const emptyState = document.getElementById('usuariosEmpty');
            cardsContainer.innerHTML = '';
            
            if (snapshot.empty) {
                emptyState.style.display = 'block';
            } else {
                emptyState.style.display = 'none';
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const card = this.createUsuarioCard(doc.id, data);
                    cardsContainer.appendChild(card);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        }
    }

    createUsuarioCard(id, data) {
        const card = document.createElement('div');
        card.className = 'data-card';
        
        const endereco = data.endereço || {};
        
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${data.nome || 'Nome não informado'}</h3>
                <div class="card-actions">
                    <button class="card-btn card-btn-edit" onclick="viewUsuario('${id}')" title="Visualizar">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-field">
                    <span class="card-label">Email:</span>
                    <span class="card-value">${data.email || 'Não informado'}</span>
                </div>
                <div class="card-field">
                    <span class="card-label">Celular:</span>
                    <span class="card-value">${data.celular || 'Não informado'}</span>
                </div>
                <div class="card-field">
                    <span class="card-label">Nascimento:</span>
                    <span class="card-value">${this.formatDate(data.nascimento)}</span>
                </div>
                <div class="card-field">
                    <span class="card-label">Cidade:</span>
                    <span class="card-value">${endereco.cidade || 'Não informada'}</span>
                </div>
            </div>
        `;
        return card;
    }
}

// Replace the original database manager
window.dbManager = new ExtendedDatabaseManager();

// Extended global functions
window.editAvisoMusica = async function(id) {
    const result = await window.dbManager.getDocument('avisos_musica', id);
    if (result.success) {
        openAvisoMusicaModal(result.data, id);
    } else {
        alert('Erro ao carregar aviso música');
    }
};

window.deleteAvisoMusica = function(id) {
    window.dbManager.deleteAvisoMusica(id);
};

window.editClero = async function(id) {
    const result = await window.dbManager.getDocument('clero', id);
    if (result.success) {
        openCleroModal(result.data, id);
    } else {
        alert('Erro ao carregar membro do clero');
    }
};

window.deleteClero = function(id) {
    window.dbManager.deleteClero(id);
};

window.editPastoral = async function(id) {
    const result = await window.dbManager.getDocument('conteudo_pagina_pastoral', id);
    if (result.success) {
        openPastoralModal(result.data, id);
    } else {
        alert('Erro ao carregar pastoral');
    }
};

window.deletePastoral = function(id) {
    window.dbManager.deletePastoral(id);
};

window.editHorario = async function(id) {
    const result = await window.dbManager.getDocument('horarios_missas', id);
    if (result.success) {
        openHorarioModal(result.data, id);
    } else {
        alert('Erro ao carregar horário');
    }
};

window.deleteHorario = function(id) {
    window.dbManager.deleteHorario(id);
};

window.editCapela = async function(id) {
    const result = await window.dbManager.getDocument('imagens_capelas', id);
    if (result.success) {
        openCapelaModal(result.data, id);
    } else {
        alert('Erro ao carregar capela');
    }
};

window.deleteCapela = function(id) {
    window.dbManager.deleteCapela(id);
};

window.viewUsuario = async function(id) {
    const result = await window.dbManager.getDocument('usuarios', id);
    if (result.success) {
        alert(`Usuário: ${JSON.stringify(result.data, null, 2)}`);
    } else {
        alert('Erro ao carregar usuário');
    }
};

// Administradores functions
window.openAdminModal = function() {
    const modal = document.getElementById('adminModal');
    modal.classList.remove('hidden');
    document.getElementById('adminForm').reset();
};

window.closeAdminModal = function() {
    const modal = document.getElementById('adminModal');
    modal.classList.add('hidden');
};

window.loadAdministradores = async function() {
    try {
        const administradores = await authManager.getAuthorizedUsersList();
        const cardsContainer = document.getElementById('administradoresCards');
        const emptyState = document.getElementById('administradoresEmpty');
        cardsContainer.innerHTML = '';
        
        if (administradores.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            administradores.forEach(admin => {
                const card = document.createElement('div');
                card.className = 'data-card';
                
                card.innerHTML = `
                    <div class="card-header">
                        <h3 class="card-title">${admin.name || admin.email}</h3>
                        <div class="card-actions">
                            <button class="card-btn card-btn-delete" onclick="removeAdministrador('${admin.email}')" title="Remover">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="card-field">
                            <span class="card-label">Email:</span>
                            <span class="card-value">${admin.email}</span>
                        </div>
                        <div class="card-field">
                            <span class="card-label">Nome:</span>
                            <span class="card-value">${admin.name || 'Não informado'}</span>
                        </div>
                        <div class="card-field">
                            <span class="card-label">Adicionado em:</span>
                            <span class="card-value">${admin.addedAt ? new Date(admin.addedAt.toDate()).toLocaleDateString('pt-BR') : 'Não informado'}</span>
                        </div>
                        <div class="card-field">
                            <span class="card-label">Adicionado por:</span>
                            <span class="card-value">${admin.addedBy || 'Não informado'}</span>
                        </div>
                    </div>
                `;
                cardsContainer.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar administradores:', error);
        alert('Erro ao carregar lista de administradores');
    }
};

window.removeAdministrador = async function(email) {
    if (email === authManager.currentUser.email) {
        alert('Você não pode remover seu próprio acesso de administrador.');
        return;
    }
    
    if (confirm(`Deseja realmente remover o acesso de administrador para ${email}?`)) {
        const result = await authManager.removeAuthorizedUser(email);
        if (result.success) {
            alert('Administrador removido com sucesso!');
            loadAdministradores();
        } else {
            alert(`Erro ao remover administrador: ${result.error}`);
        }
    }
};

// Event listener for admin form
document.getElementById('adminForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const name = document.getElementById('adminName').value;
    
    const result = await authManager.addAuthorizedUser(email, name);
    
    if (result.success) {
        alert('Administrador adicionado com sucesso!');
        closeAdminModal();
        loadAdministradores();
    } else {
        alert(`Erro ao adicionar administrador: ${result.error}`);
    }
});
