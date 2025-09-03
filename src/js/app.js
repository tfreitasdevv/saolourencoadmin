// Main application logic
class AdminApp {
    constructor() {
        this.currentSection = 'avisos';
        this.currentEditingId = null;
        this.initEventListeners();
    }

    initEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
                this.setActiveNavLink(link);
            });
        });

        // Form submissions
        this.initFormHandlers();
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
            
            // Load data for specific sections
            if (sectionName === 'administradores') {
                window.loadAdministradores();
            }
        }
    }

    setActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    initFormHandlers() {
        // Aviso form
        document.getElementById('avisoForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleAvisoSubmit();
        });

        // Aviso Música form
        document.getElementById('avisoMusicaForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleAvisoMusicaSubmit();
        });

        // Clero form
        document.getElementById('cleroForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleCleroSubmit();
        });

        // Pastoral form
        document.getElementById('pastoralForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handlePastoralSubmit();
        });

        // Horário form
        document.getElementById('horarioForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleHorarioSubmit();
        });

        // Image preview handlers
        document.getElementById('avisoImagem').addEventListener('change', (e) => {
            this.previewImage(e.target, 'avisoImagemPreview');
        });

        document.getElementById('cleroImagem').addEventListener('change', (e) => {
            this.previewImage(e.target, 'cleroImagemPreview');
        });
    }

    async handleAvisoSubmit() {
        const form = document.getElementById('avisoForm');
        const formData = new FormData(form);
        
        try {
            // Get form values
            const titulo = document.getElementById('avisoTitulo').value;
            const descricao = document.getElementById('avisoDescricao').value;
            const prioridade = parseInt(document.getElementById('avisoPrioridade').value);
            const imagemFile = document.getElementById('avisoImagem').files[0];

            let imagemUrl = '';
            
            // Upload image if provided
            if (imagemFile) {
                const uploadResult = await window.dbManager.uploadImage(
                    imagemFile, 
                    `Imagens/Avisos/${Date.now()}_${imagemFile.name}`
                );
                
                if (uploadResult.success) {
                    imagemUrl = uploadResult.url;
                } else {
                    alert('Erro ao fazer upload da imagem');
                    return;
                }
            }

            // Prepare data
            const avisoData = {
                titulo: titulo,
                descricao: descricao,
                prioridade: prioridade,
                data: firebase.firestore.Timestamp.now(),
                imagem: imagemUrl // Sempre incluir o campo imagem, mesmo que vazio
            };

            // Save to database
            const result = await window.dbManager.saveAviso(avisoData, this.currentEditingId);
            
            if (result.success) {
                alert(this.currentEditingId ? 'Aviso atualizado com sucesso!' : 'Aviso criado com sucesso!');
                this.closeModal('avisoModal');
                this.resetAvisoForm();
            } else {
                alert('Erro ao salvar aviso: ' + result.error);
            }
        } catch (error) {
            console.error('Erro no submit do aviso:', error);
            alert('Erro ao salvar aviso');
        }
    }

    async handleAvisoMusicaSubmit() {
        try {
            const titulo = document.getElementById('avisoMusicaTitulo').value;
            const descricao = document.getElementById('avisoMusicaDescricao').value;
            const prioridade = parseInt(document.getElementById('avisoMusicaPrioridade').value);

            const avisoData = {
                titulo: titulo,
                descricao: descricao,
                prioridade: prioridade,
                data: firebase.firestore.Timestamp.now()
            };

            const result = await window.dbManager.saveAvisoMusica(avisoData, this.currentEditingId);
            
            if (result.success) {
                alert(this.currentEditingId ? 'Aviso música atualizado com sucesso!' : 'Aviso música criado com sucesso!');
                this.closeModal('avisoMusicaModal');
                this.resetAvisoMusicaForm();
            } else {
                alert('Erro ao salvar aviso música: ' + result.error);
            }
        } catch (error) {
            console.error('Erro no submit do aviso música:', error);
            alert('Erro ao salvar aviso música');
        }
    }

    async handleCleroSubmit() {
        try {
            const cargo = document.getElementById('cleroCargo').value;
            const nome = document.getElementById('cleroNome').value;
            const dataOrdenacao = document.getElementById('cleroDataOrdenacao').value;
            const historia = document.getElementById('cleroHistoria').value;
            const imagemFile = document.getElementById('cleroImagem').files[0];

            let imagemUrl = '';
            
            if (imagemFile) {
                const uploadResult = await window.dbManager.uploadImage(
                    imagemFile, 
                    `Imagens/Clero/${Date.now()}_${imagemFile.name}`
                );
                
                if (uploadResult.success) {
                    imagemUrl = uploadResult.url;
                } else {
                    alert('Erro ao fazer upload da imagem');
                    return;
                }
            }

            const cleroData = {
                nome: nome,
                'data ordenação': dataOrdenacao,
                historia: historia
            };

            if (imagemUrl) {
                cleroData.imagem = imagemUrl;
            }

            const result = await window.dbManager.saveClero(cleroData, cargo);
            
            if (result.success) {
                alert('Membro do clero salvo com sucesso!');
                this.closeModal('cleroModal');
                this.resetCleroForm();
            } else {
                alert('Erro ao salvar membro do clero: ' + result.error);
            }
        } catch (error) {
            console.error('Erro no submit do clero:', error);
            alert('Erro ao salvar membro do clero');
        }
    }

    async handlePastoralSubmit() {
        try {
            const nome = document.getElementById('pastoralNome').value;
            const contato = document.getElementById('pastoralContato').value;
            const coordenacao = document.getElementById('pastoralCoordenacao').value;
            const texto = document.getElementById('pastoralTexto').value;

            const pastoralData = {
                contato: contato,
                coordenacao: coordenacao,
                texto: texto
            };

            const result = await window.dbManager.savePastoral(pastoralData, nome);
            
            if (result.success) {
                alert('Pastoral salva com sucesso!');
                this.closeModal('pastoralModal');
                this.resetPastoralForm();
            } else {
                alert('Erro ao salvar pastoral: ' + result.error);
            }
        } catch (error) {
            console.error('Erro no submit da pastoral:', error);
            alert('Erro ao salvar pastoral');
        }
    }

    async handleHorarioSubmit() {
        try {
            const dia = document.getElementById('horarioDia').value;
            const titulo = document.getElementById('horarioTitulo').value;
            const ordem = parseInt(document.getElementById('horarioOrdem').value);
            const missasText = document.getElementById('horarioMissas').value;
            
            const missas = missasText.split('\n').filter(m => m.trim() !== '');

            const horarioData = {
                titulo: titulo,
                ordem: ordem,
                missas: missas
            };

            const result = await window.dbManager.saveHorario(horarioData, dia);
            
            if (result.success) {
                alert('Horário salvo com sucesso!');
                this.closeModal('horarioModal');
                this.resetHorarioForm();
            } else {
                alert('Erro ao salvar horário: ' + result.error);
            }
        } catch (error) {
            console.error('Erro no submit do horário:', error);
            alert('Erro ao salvar horário');
        }
    }

    previewImage(input, previewId) {
        const preview = document.getElementById(previewId);
        preview.innerHTML = '';

        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '200px';
                img.style.maxHeight = '200px';
                img.style.borderRadius = '8px';
                preview.appendChild(img);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    resetAvisoForm() {
        document.getElementById('avisoForm').reset();
        document.getElementById('avisoImagemPreview').innerHTML = '';
        this.currentEditingId = null;
    }

    resetAvisoMusicaForm() {
        document.getElementById('avisoMusicaForm').reset();
        this.currentEditingId = null;
    }

    resetCleroForm() {
        document.getElementById('cleroForm').reset();
        document.getElementById('cleroImagemPreview').innerHTML = '';
        this.currentEditingId = null;
    }

    resetPastoralForm() {
        document.getElementById('pastoralForm').reset();
        this.currentEditingId = null;
    }

    resetHorarioForm() {
        document.getElementById('horarioForm').reset();
        this.currentEditingId = null;
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }
}

// Initialize app
const app = new AdminApp();

// Global modal functions
window.openAvisoModal = function(data = null, id = null) {
    const modal = document.getElementById('avisoModal');
    const title = document.getElementById('avisoModalTitle');
    
    if (data && id) {
        // Edit mode
        title.textContent = 'Editar Aviso Paroquial';
        document.getElementById('avisoTitulo').value = data.titulo || '';
        document.getElementById('avisoDescricao').value = data.descricao || '';
        document.getElementById('avisoPrioridade').value = data.prioridade || '';
        app.currentEditingId = id;
        
        // Show current image if exists
        if (data.imagem) {
            const preview = document.getElementById('avisoImagemPreview');
            preview.innerHTML = `<img src="${data.imagem}" style="max-width: 200px; max-height: 200px; border-radius: 8px;">`;
        }
    } else {
        // Create mode
        title.textContent = 'Novo Aviso Paroquial';
        app.resetAvisoForm();
    }
    
    modal.style.display = 'block';
};

window.openAvisoMusicaModal = function(data = null, id = null) {
    const modal = document.getElementById('avisoMusicaModal');
    const title = document.getElementById('avisoMusicaModalTitle');
    
    if (data && id) {
        title.textContent = 'Editar Aviso Música';
        document.getElementById('avisoMusicaTitulo').value = data.titulo || '';
        document.getElementById('avisoMusicaDescricao').value = data.descricao || '';
        document.getElementById('avisoMusicaPrioridade').value = data.prioridade || '';
        app.currentEditingId = id;
    } else {
        title.textContent = 'Novo Aviso Música';
        app.resetAvisoMusicaForm();
    }
    
    modal.style.display = 'block';
};

window.openCleroModal = function(data = null, id = null) {
    const modal = document.getElementById('cleroModal');
    const title = document.getElementById('cleroModalTitle');
    
    if (data && id) {
        title.textContent = 'Editar Membro do Clero';
        document.getElementById('cleroCargo').value = id;
        document.getElementById('cleroNome').value = data.nome || '';
        document.getElementById('cleroDataOrdenacao').value = data['data ordenação'] || '';
        document.getElementById('cleroHistoria').value = data.historia || '';
        app.currentEditingId = id;
        
        if (data.imagem) {
            const preview = document.getElementById('cleroImagemPreview');
            preview.innerHTML = `<img src="${data.imagem}" style="max-width: 200px; max-height: 200px; border-radius: 8px;">`;
        }
    } else {
        title.textContent = 'Novo Membro do Clero';
        app.resetCleroForm();
    }
    
    modal.style.display = 'block';
};

window.openPastoralModal = function(data = null, id = null) {
    const modal = document.getElementById('pastoralModal');
    const title = document.getElementById('pastoralModalTitle');
    
    if (data && id) {
        title.textContent = 'Editar Pastoral';
        document.getElementById('pastoralNome').value = id;
        document.getElementById('pastoralContato').value = data.contato || '';
        document.getElementById('pastoralCoordenacao').value = data.coordenacao || '';
        document.getElementById('pastoralTexto').value = data.texto || '';
        app.currentEditingId = id;
    } else {
        title.textContent = 'Nova Pastoral';
        app.resetPastoralForm();
    }
    
    modal.style.display = 'block';
};

window.openHorarioModal = function(data = null, id = null) {
    const modal = document.getElementById('horarioModal');
    const title = document.getElementById('horarioModalTitle');
    
    if (data && id) {
        title.textContent = 'Editar Horário';
        document.getElementById('horarioDia').value = id;
        document.getElementById('horarioTitulo').value = data.titulo || '';
        document.getElementById('horarioOrdem').value = data.ordem || '';
        document.getElementById('horarioMissas').value = Array.isArray(data.missas) ? data.missas.join('\n') : '';
        app.currentEditingId = id;
    } else {
        title.textContent = 'Novo Horário';
        app.resetHorarioForm();
    }
    
    modal.style.display = 'block';
};

window.openCapelaModal = function(data = null, id = null) {
    alert('Modal de Capelas será implementado em breve');
};

window.openMusicaModal = function(data = null, id = null) {
    alert('Modal de Músicas será implementado em breve');
};

window.closeModal = function(modalId) {
    app.closeModal(modalId);
};

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Utility functions
window.truncateText = function(text, maxLength = 100) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

window.formatFirebaseDate = function(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('pt-BR');
};

// Initialize tooltips and other UI enhancements
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin App initialized');
});
