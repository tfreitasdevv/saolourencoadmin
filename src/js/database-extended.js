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
            
            const tbody = document.querySelector('#horariosTable tbody');
            tbody.innerHTML = '';
            
            snapshot.forEach(doc => {
                const data = doc.data();
                const row = this.createHorarioRow(doc.id, data);
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Erro ao carregar horários:', error);
        }
    }

    createHorarioRow(id, data) {
        const row = document.createElement('tr');
        const missas = Array.isArray(data.missas) ? data.missas.join(', ') : '';
        
        row.innerHTML = `
            <td>${id}</td>
            <td>${data.titulo || ''}</td>
            <td>${data.ordem || ''}</td>
            <td>${missas}</td>
            <td>
                <button class="btn-edit" onclick="editHorario('${id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-danger" onclick="deleteHorario('${id}')">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </td>
        `;
        return row;
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
            
            const tbody = document.querySelector('#capelasTable tbody');
            tbody.innerHTML = '';
            
            snapshot.forEach(doc => {
                const data = doc.data();
                const row = this.createCapelaRow(doc.id, data);
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Erro ao carregar capelas:', error);
        }
    }

    createCapelaRow(id, data) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${id}</td>
            <td>${data.imagem ? '<img src="' + data.imagem + '" alt="Imagem">' : 'Sem imagem'}</td>
            <td>
                <button class="btn-edit" onclick="editCapela('${id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-danger" onclick="deleteCapela('${id}')">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </td>
        `;
        return row;
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
            
            const tbody = document.querySelector('#usuariosTable tbody');
            tbody.innerHTML = '';
            
            snapshot.forEach(doc => {
                const data = doc.data();
                const row = this.createUsuarioRow(doc.id, data);
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        }
    }

    createUsuarioRow(id, data) {
        const row = document.createElement('tr');
        const endereco = data.endereço || {};
        
        row.innerHTML = `
            <td>${data.nome || ''}</td>
            <td>${data.email || ''}</td>
            <td>${data.celular || ''}</td>
            <td>${this.formatDate(data.nascimento)}</td>
            <td>${endereco.cidade || ''}</td>
            <td>
                <button class="btn-edit" onclick="viewUsuario('${id}')">
                    <i class="fas fa-eye"></i> Visualizar
                </button>
            </td>
        `;
        return row;
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
        const tbody = document.querySelector('#administradoresTable tbody');
        tbody.innerHTML = '';
        
        administradores.forEach(admin => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${admin.email}</td>
                <td>${admin.name || ''}</td>
                <td>${admin.addedAt ? new Date(admin.addedAt.toDate()).toLocaleDateString('pt-BR') : ''}</td>
                <td>${admin.addedBy || ''}</td>
                <td>
                    <button class="btn-delete" onclick="removeAdministrador('${admin.email}')">
                        <i class="fas fa-trash"></i> Remover
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
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
