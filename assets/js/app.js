import renderAnimais from './modules/uiHandlers.js';
import { initAuthHandlers, setupRegisterHandler, setupFormHandlers } from './modules/uiHandlers.js';

// ✅ CACHE SIMPLES PARA EVITAR FALHAS
let animaisCache = null;
let lastFetchTime = 0;

async function carregarAnimaisComFallback() {
  const now = Date.now();
  
  // Usa cache se tiver menos de 30 segundos
  if (animaisCache && (now - lastFetchTime < 30000)) {
    console.log('📦 Usando cache de animais');
    return animaisCache;
  }
  
  try {
    console.log('🌐 Buscando animais do servidor...');
    const response = await fetch('https://guerreirosderua.onrender.com/api/animais', {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    
    if (response.status === 429) {
      throw new Error('Servidor ocupado. Tente novamente em alguns instantes.');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText || 'Falha na conexão'}`);
    }
    
    animaisCache = await response.json();
    lastFetchTime = now;
    console.log(`✅ ${animaisCache.length} animais carregados do servidor`);
    return animaisCache;
    
  } catch (error) {
 
    if (animaisCache) {
      console.warn('⚠️ Usando cache devido a erro de rede:', error.message);
      return animaisCache;
    }
    throw error;
  }
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


    const animais = await carregarAnimaisComFallback();
    renderAnimais(animais);
    
  } catch (error) {
    console.error('Erro ao carregar animais:', error);
    const container = document.getElementById('lista-animais');
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <p>Problema de conexão com o servidor</p>
          <small>Tente recarregar a página ou volte mais tarde.</small>
          <br>
          <button onclick="window.location.reload()" class="btn-retry">Recarregar Página</button>
        </div>
      `;
    }
  }
});

window.addEventListener('error', (e) => {
  console.error('Erro capturado:', e.error);
});


const originalFetch = window.fetch;
window.fetch = async (...args) => {
  try {
    return await originalFetch(...args);
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};