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

        // Confissão form
        document.getElementById('confissaoForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleConfissaoSubmit();
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
                    showError('Erro ao fazer upload da imagem');
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
                showSuccess(this.currentEditingId ? 'Aviso atualizado com sucesso!' : 'Aviso criado com sucesso!');
                this.closeModal('avisoModal');
                this.resetAvisoForm();
            } else {
                showError('Erro ao salvar aviso: ' + result.error);
            }
        } catch (error) {
            console.error('Erro no submit do aviso:', error);
            showError('Erro ao salvar aviso');
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
                showSuccess(this.currentEditingId ? 'Aviso música atualizado com sucesso!' : 'Aviso música criado com sucesso!');
                this.closeModal('avisoMusicaModal');
                this.resetAvisoMusicaForm();
            } else {
                showError('Erro ao salvar aviso música: ' + result.error);
            }
        } catch (error) {
            console.error('Erro no submit do aviso música:', error);
            showError('Erro ao salvar aviso música');
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
                    showError('Erro ao fazer upload da imagem');
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
                showSuccess('Membro do clero salvo com sucesso!');
                this.closeModal('cleroModal');
                this.resetCleroForm();
            } else {
                showError('Erro ao salvar membro do clero: ' + result.error);
            }
        } catch (error) {
            console.error('Erro no submit do clero:', error);
            showError('Erro ao salvar membro do clero');
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
                showSuccess('Pastoral salva com sucesso!');
                this.closeModal('pastoralModal');
                this.resetPastoralForm();
            } else {
                showError('Erro ao salvar pastoral: ' + result.error);
            }
        } catch (error) {
            console.error('Erro no submit da pastoral:', error);
            showError('Erro ao salvar pastoral');
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
                showSuccess('Horário salvo com sucesso!');
                this.closeModal('horarioModal');
                this.resetHorarioForm();
            } else {
                showError('Erro ao salvar horário: ' + result.error);
            }
        } catch (error) {
            console.error('Erro no submit do horário:', error);
            showError('Erro ao salvar horário');
        }
    }

    async handleConfissaoSubmit() {
        try {
            const titulo = document.getElementById('confissaoTitulo').value;
            const texto = document.getElementById('confissaoTexto').value;
            const id = document.getElementById('confissaoId').value;

            const confissaoData = {
                titulo: titulo,
                texto: texto
            };

            await window.dbManager.saveConfissao(id, confissaoData);
            this.closeModal('confissaoModal');
            this.resetConfissaoForm();
        } catch (error) {
            console.error('Erro no submit da confissão:', error);
            showError('Erro ao salvar confissão');
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

    resetConfissaoForm() {
        document.getElementById('confissaoForm').reset();
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
    showInfo('Modal de Capelas será implementado em breve');
};

window.openMusicaModal = function(data = null, id = null) {
    showInfo('Modal de Músicas será implementado em breve');
};

window.openConfissaoModal = function(data = null, id = null) {
    const modal = document.getElementById('confissaoModal');
    const title = document.getElementById('confissaoModalTitle');
    
    if (data && id) {
        // Edit mode
        title.textContent = 'Editar Confissão';
        document.getElementById('confissaoTitulo').value = data.titulo || '';
        document.getElementById('confissaoTexto').value = data.texto || '';
        document.getElementById('confissaoId').value = id;
        app.currentEditingId = id;
    } else {
        // Create mode (não deve ser usado para confissões, mas incluído por completude)
        title.textContent = 'Nova Confissão';
        app.resetConfissaoForm();
    }
    
    modal.classList.remove('hidden');
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

// ====================================
// SISTEMA DE NOTIFICAÇÕES TOAST
// ====================================

class ToastManager {
    constructor() {
        this.container = document.getElementById('toast-container');
        this.toasts = new Map();
        this.toastId = 0;
    }

    // Criar um toast
    show(message, type = 'info', options = {}) {
        const id = ++this.toastId;
        const toast = this.createToast(id, message, type, options);
        
        this.container.appendChild(toast);
        this.toasts.set(id, toast);
        
        // Mostrar o toast com animação
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto-hide após duração especificada
        const duration = options.duration || this.getDefaultDuration(type);
        if (duration > 0) {
            setTimeout(() => {
                this.hide(id);
            }, duration);
        }
        
        return id;
    }

    // Criar elemento do toast
    createToast(id, message, type, options) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.setAttribute('data-toast-id', id);
        
        const icon = this.getIcon(type);
        const title = options.title || this.getDefaultTitle(type);
        
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="toastManager.hide(${id})">&times;</button>
            ${options.showProgress !== false ? '<div class="toast-progress"></div>' : ''}
        `;
        
        // Adicionar barra de progresso se necessário
        if (options.showProgress !== false) {
            const duration = options.duration || this.getDefaultDuration(type);
            if (duration > 0) {
                const progress = toast.querySelector('.toast-progress');
                progress.style.width = '100%';
                progress.style.transition = `width ${duration}ms linear`;
                setTimeout(() => {
                    progress.style.width = '0%';
                }, 50);
            }
        }
        
        return toast;
    }

    // Esconder toast
    hide(id) {
        const toast = this.toasts.get(id);
        if (toast) {
            toast.classList.remove('show');
            toast.classList.add('hide');
            
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
                this.toasts.delete(id);
            }, 300);
        }
    }

    // Limpar todos os toasts
    clear() {
        this.toasts.forEach((toast, id) => {
            this.hide(id);
        });
    }

    // Obter ícone baseado no tipo
    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    // Obter título padrão baseado no tipo
    getDefaultTitle(type) {
        const titles = {
            success: 'Sucesso',
            error: 'Erro',
            warning: 'Atenção',
            info: 'Informação'
        };
        return titles[type] || titles.info;
    }

    // Obter duração padrão baseada no tipo
    getDefaultDuration(type) {
        const durations = {
            success: 4000,
            error: 6000,
            warning: 5000,
            info: 4000
        };
        return durations[type] || durations.info;
    }

    // Métodos de conveniência
    success(message, options = {}) {
        return this.show(message, 'success', options);
    }

    error(message, options = {}) {
        return this.show(message, 'error', options);
    }

    warning(message, options = {}) {
        return this.show(message, 'warning', options);
    }

    info(message, options = {}) {
        return this.show(message, 'info', options);
    }
}

// Instância global do gerenciador de toasts
window.toastManager = new ToastManager();

// Funções de conveniência globais
window.showToast = function(message, type = 'info', options = {}) {
    return toastManager.show(message, type, options);
};

window.showSuccess = function(message, options = {}) {
    return toastManager.success(message, options);
};

window.showError = function(message, options = {}) {
    return toastManager.error(message, options);
};

window.showWarning = function(message, options = {}) {
    return toastManager.warning(message, options);
};

window.showInfo = function(message, options = {}) {
    return toastManager.info(message, options);
};

// Initialize tooltips and other UI enhancements
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin App initialized');
});
