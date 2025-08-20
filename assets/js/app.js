import renderAnimais from './modules/uiHandlers.js';
import { initAuthHandlers, setupRegisterHandler, setupFormHandlers } from './modules/uiHandlers.js';

document.addEventListener('DOMContentLoaded', async () => {
  initAuthHandlers();
  setupRegisterHandler();
  setupFormHandlers(); 

  try {
    const container = document.getElementById('lista-animais');
    if (container) {
      container.innerHTML = '<div class="loading">Carregando animais...</div>';
    }

    const response = await fetch('https://guerreirosderua.onrender.com/api/animais', {
      headers: { 'Cache-Control': 'no-cache' }
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
          <p>${error.message}</p>
          <small>Se o problema persistir, entre em contato com o suporte.</small>
          <br>
          <button onclick="window.location.reload()" class="btn-retry">Tentar Novamente</button>
        </div>
      `;
    }
  }
});