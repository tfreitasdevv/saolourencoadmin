// Funções utilitárias para conversão de quebras de linha
function convertLineBreaksToFlutter(text) {
    // Converte quebras de linha naturais (\n) em string literal "\n" para o Flutter
    return text.replace(/\n/g, '\\n');
}

function convertLineBreaksFromFlutter(text) {
    // Converte string literal "\n" de volta em quebras de linha naturais
    return text.replace(/\\n/g, '\n');
}

function convertLineBreaksToHTML(text) {
    // Converte string literal "\n" em quebras de linha HTML para exibição
    return text.replace(/\\n/g, '<br>');
}

// Main application logic
class AdminApp {
    constructor() {
        this.currentSection = 'avisos';
        this.currentEditingId = null;
        this.mobileMenuOpen = false;
        this.initEventListeners();
        this.initMobileMenu();
    }

    initEventListeners() {
        // Navigation (both desktop and mobile)
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
                this.setActiveNavLink(link);
                
                // Close mobile menu when selecting an item
                if (link.classList.contains('mobile-nav-link')) {
                    this.closeMobileMenu();
                }
            });
        });

        // Form submissions
        this.initFormHandlers();
    }

    initMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const closeMobileMenu = document.getElementById('closeMobileMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        const mobileMenu = document.getElementById('mobileMenu');

        // Open mobile menu
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                this.openMobileMenu();
            });
        }

        // Close mobile menu
        if (closeMobileMenu) {
            closeMobileMenu.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Close menu when clicking overlay
        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Close menu on window resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    openMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        
        if (mobileMenu && mobileMenuOverlay) {
            mobileMenu.classList.add('open');
            mobileMenuOverlay.classList.add('active');
            this.mobileMenuOpen = true;
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        
        if (mobileMenu && mobileMenuOverlay) {
            mobileMenu.classList.remove('open');
            mobileMenuOverlay.classList.remove('active');
            this.mobileMenuOpen = false;
            
            // Restore body scroll
            document.body.style.overflow = '';
        }
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('block');
            section.classList.add('hidden');
        });

        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('block');
            this.currentSection = sectionName;
            
            // Load data for specific sections
            if (sectionName === 'administradores') {
                window.loadAdministradores();
            }
        }
    }

    setActiveNavLink(activeLink) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        activeLink.classList.add('active');
        
        // Also activate corresponding link in other menu (desktop/mobile)
        const section = activeLink.dataset.section;
        document.querySelectorAll(`[data-section="${section}"]`).forEach(link => {
            link.classList.add('active');
        });
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
            const descricao = convertLineBreaksToFlutter(document.getElementById('avisoDescricao').value);
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
            const descricao = convertLineBreaksToFlutter(document.getElementById('avisoMusicaDescricao').value);
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
            const historia = convertLineBreaksToFlutter(document.getElementById('cleroHistoria').value);
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
                'data_ordenação': dataOrdenacao,
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
            const contato = convertLineBreaksToFlutter(document.getElementById('pastoralContato').value);
            const coordenacao = document.getElementById('pastoralCoordenacao').value;
            const texto = convertLineBreaksToFlutter(document.getElementById('pastoralTexto').value);

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
        const modal = document.getElementById(modalId);
        modal.classList.add('hidden');
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('hidden');
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
        document.getElementById('avisoDescricao').value = convertLineBreaksFromFlutter(data.descricao || '');
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
    
    modal.classList.remove('hidden');
};

window.openAvisoMusicaModal = function(data = null, id = null) {
    const modal = document.getElementById('avisoMusicaModal');
    const title = document.getElementById('avisoMusicaModalTitle');
    
    if (data && id) {
        title.textContent = 'Editar Aviso Música';
        document.getElementById('avisoMusicaTitulo').value = data.titulo || '';
        document.getElementById('avisoMusicaDescricao').value = convertLineBreaksFromFlutter(data.descricao || '');
        document.getElementById('avisoMusicaPrioridade').value = data.prioridade || '';
        app.currentEditingId = id;
    } else {
        title.textContent = 'Novo Aviso Música';
        app.resetAvisoMusicaForm();
    }
    
    modal.classList.remove('hidden');
};

window.openCleroModal = function(data = null, id = null) {
    const modal = document.getElementById('cleroModal');
    const title = document.getElementById('cleroModalTitle');
    
    if (data && id) {
        title.textContent = 'Editar Membro do Clero';
        document.getElementById('cleroCargo').value = id;
        document.getElementById('cleroNome').value = data.nome || '';
        document.getElementById('cleroDataOrdenacao').value = data['data ordenação'] || '';
        document.getElementById('cleroHistoria').value = convertLineBreaksFromFlutter(data.historia || '');
        app.currentEditingId = id;
        
        if (data.imagem) {
            const preview = document.getElementById('cleroImagemPreview');
            preview.innerHTML = `<img src="${data.imagem}" style="max-width: 200px; max-height: 200px; border-radius: 8px;">`;
        }
    } else {
        title.textContent = 'Novo Membro do Clero';
        app.resetCleroForm();
    }
    
    modal.classList.remove('hidden');
};

window.openPastoralModal = function(data = null, id = null) {
    const modal = document.getElementById('pastoralModal');
    const title = document.getElementById('pastoralModalTitle');
    
    if (data && id) {
        title.textContent = 'Editar Pastoral';
        document.getElementById('pastoralNome').value = id;
        document.getElementById('pastoralContato').value = convertLineBreaksFromFlutter(data.contato || '');
        document.getElementById('pastoralCoordenacao').value = data.coordenacao || '';
        document.getElementById('pastoralTexto').value = convertLineBreaksFromFlutter(data.texto || '');
        app.currentEditingId = id;
    } else {
        title.textContent = 'Nova Pastoral';
        app.resetPastoralForm();
    }
    
    modal.classList.remove('hidden');
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
    
    modal.classList.remove('hidden');
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

// Close modal when clicking outside - DESABILITADO para melhor UX
// Os modais agora só fecham pelos botões "Cancelar" ou "Fechar"
/*
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    });
});
*/

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
