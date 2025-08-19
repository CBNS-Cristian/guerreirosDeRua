import renderAnimais from './modules/uiHandlers.js';
import { initAuthHandlers, setupRegisterHandler, setupFormHandlers } from './modules/uiHandlers.js';

document.addEventListener('DOMContentLoaded', async () => {
  initAuthHandlers();
  setupRegisterHandler();
  setupFormHandlers(); 

  try {
    const response = await fetch('https://guerreirosderua.onrender.com/api/animais');
    
    // Tratamento específico para erro 429
    if (response.status === 429) {
      throw new Error('Servidor ocupado. Recarregue a página em alguns instantes.');
    }
    
    if (!response.ok) {
      throw new Error('Erro ao carregar animais');
    }
    
    const animais = await response.json();
    renderAnimais(animais);
    
  } catch (error) {
    console.error('Erro inicial:', error);
    const container = document.getElementById('lista-animais');
    if (container) {
      container.innerHTML = `
        <p class="error-message">
          ${error.message}
          <br><small>Tente recarregar a página.</small>
        </p>
      `;
    }
  }
});

const API_BASE_URL = 'https://guerreirosderua.onrender.com/api/animais';

export const AnimalAPI = {
  async listarAnimais() {
    const response = await fetch(API_BASE_URL);
    return response.json();
  },

  async cadastrarAnimal(formData) {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      body: formData
    });
    return response.json();
  },

  async marcarComoAdotado(id) {
    const response = await fetch(`${API_BASE_URL}/${id}/adotar`, {
      method: 'PATCH'
    });
    return response.json();
  }
};