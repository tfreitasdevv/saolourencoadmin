// Firebase configuration - TEMPLATE SEGURO
// Para usar este arquivo:
// 1. Copie .env.example para .env
// 2. Preencha as credenciais reais no arquivo .env
// 3. Use este template como firebase-config.js

// Função para carregar variáveis do .env (para desenvolvimento local)
function getEnvVar(name) {
    // Em produção, use variáveis de ambiente do servidor
    // Em desenvolvimento, você pode definir diretamente ou usar um bundler como Vite
    return window[name] || process?.env?.[name] || '';
}

// Firebase configuration
const firebaseConfig = {
    apiKey: getEnvVar('VITE_FIREBASE_API_KEY') || "SUA_API_KEY_AQUI",
    authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN') || "seu-projeto.firebaseapp.com",
    projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID') || "seu-projeto-id",
    storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET') || "seu-projeto.appspot.com",
    messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID') || "123456789",
    appId: getEnvVar('VITE_FIREBASE_APP_ID') || "1:123456789:web:abcdef123456"
};

// Verificar se todas as configurações estão presentes
const requiredConfigs = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingConfigs = requiredConfigs.filter(key => !firebaseConfig[key] || firebaseConfig[key].includes('SEU') || firebaseConfig[key].includes('seu-'));

if (missingConfigs.length > 0) {
    console.error('❌ Firebase: Configurações ausentes:', missingConfigs);
    console.error('📝 Configure o arquivo .env com suas credenciais do Firebase');
    alert('Erro: Configure as credenciais do Firebase. Veja o console para detalhes.');
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Make db available globally
window.db = db;
window.auth = auth;
window.storage = storage;

console.log('🔥 Firebase initialized successfully');
