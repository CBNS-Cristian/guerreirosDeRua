import renderAnimais from './modules/uiHandlers.js';
import { initAuthHandlers, setupRegisterHandler, setupFormHandlers } from './modules/uiHandlers.js';

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const API_URL = 'https://guerreirosderua.onrender.com/api/animais';


async function fetchComProxy(url, options = {}) {
  try {
    console.log('🔗 Tentando conexão direta...');
    const response = await fetch(url, {
      ...options,
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (response.ok) return response;
    
  } catch (error) {
    console.log('❌ Conexão direta falhou, usando proxy...');
    

    try {
      const proxyUrl = CORS_PROXY + url;
      const response = await fetch(proxyUrl, {
        ...options,
        headers: {
          ...options.headers,
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      if (response.ok) return response;
      
    } catch (proxyError) {
      console.error('❌ Proxy também falhou:', proxyError);
    }
  }
  
  throw new Error('Falha na conexão após tentativas');
}

document.addEventListener('DOMContentLoaded', async () => {
  initAuthHandlers();
  setupRegisterHandler();
  setupFormHandlers(); 

  try {
    const container = document.getElementById('lista-animais');
    if (container) {
      container.innerHTML = '<div class="loading">Carregando animais...</div>';
    }

    const response = await fetchComProxy(API_URL, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (response.status === 429) {
      throw new Error('Servidor ocupado. Tente novamente em alguns instantes.');
    }
    
    if (!response.ok) {
      throw new Error('Erro ao carregar animais. Tente recarregar a página.');
    }
    
    const animais = await response.json();
    renderAnimais(animais);
    
  } catch (error) {
    console.error('Erro:', error);
    const container = document.getElementById('lista-animais');
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <p>Problema de conexão</p>
          <small>Recarregue a página ou tente novamente mais tarde.</small>
          <br>
          <button onclick="window.location.reload()" class="btn-retry">🔄 Recarregar</button>
        </div>
      `;
    }
  }
});


let tentativas = 0;
function tentarNovamente() {
  if (tentativas < 3) {
    tentativas++;
    console.log(`🔄 Tentativa ${tentativas} de recarregamento automático...`);
    setTimeout(() => window.location.reload(), 2000);
  }
}


window.addEventListener('error', () => tentarNovamente());