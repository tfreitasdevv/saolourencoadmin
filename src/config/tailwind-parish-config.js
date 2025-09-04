/**
 * CONFIGURAÇÃO CUSTOMIZADA DO TAILWIND CSS
 * Paróquia São Lourenço - Sistema Administrativo
 */

// Configuração das cores da paróquia
const parishColors = {
    'parish-blue': {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#667eea', // Cor principal azul da paróquia
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
    },
    'parish-purple': {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#764ba2', // Cor principal roxa da paróquia
        600: '#9333ea',
        700: '#7c3aed',
        800: '#6b21a8',
        900: '#581c87',
    },
    'parish-gray': {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#2c3e50', // Cor escura principal
        900: '#34495e', // Cor escura secundária
    }
};

// Configuração principal do Tailwind para a paróquia
const parishTailwindConfig = {
    theme: {
        extend: {
            colors: parishColors,
            // Gradientes pré-definidos
            backgroundImage: {
                'parish-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'header-gradient': 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            },
            // Espaçamentos específicos para modais
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            },
            // Bordas arredondadas personalizadas
            borderRadius: {
                'modal': '16px',
            },
            // Sombras customizadas
            boxShadow: {
                'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                'parish': '0 4px 12px rgba(102, 126, 234, 0.4)',
            },
            // Animações personalizadas
            animation: {
                'modal-fade-in': 'modalFadeIn 0.3s ease-out',
                'modal-fade-out': 'modalFadeOut 0.2s ease-in',
                'modal-slide-in': 'modalSlideIn 0.3s ease-out',
                'modal-slide-out': 'modalSlideOut 0.2s ease-in',
            }
        }
    }
};

// Função para aplicar a configuração
function applyParishTailwindConfig() {
    if (typeof tailwind !== 'undefined') {
        tailwind.config = parishTailwindConfig;
    }
}

// Aplicar automaticamente se o Tailwind estiver disponível
if (typeof window !== 'undefined') {
    window.parishTailwindConfig = parishTailwindConfig;
    window.parishColors = parishColors;
    
    // Aplicar quando o documento estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyParishTailwindConfig);
    } else {
        applyParishTailwindConfig();
    }
}

// Exportar para uso em Node.js se necessário
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        parishTailwindConfig,
        parishColors,
        applyParishTailwindConfig
    };
}
