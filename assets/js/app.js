import renderAnimais from './modules/uiHandlers.js';
import { setupFormHandlers } from './modules/uiHandlers.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Carrega os animais iniciais
    const response = await fetch('http://localhost:3001/api/animais');
    
    if (!response.ok) {
      throw new Error('Erro ao carregar animais');
    }
    
    const animais = await response.json();
    renderAnimais(animais);
    
    // Configura os handlers de formulário
    setupFormHandlers();
    
    // Adiciona event listeners para botões de adoção
    document.addEventListener('click', async (e) => {
      if (e.target.classList.contains('btn-adopt')) {
        const animalId = e.target.dataset.id;
        try {
          const response = await fetch(`http://localhost:3001/api/animais/${animalId}/adotar`, {
            method: 'PATCH'
          });
          
          if (response.ok) {
            alert('Animal marcado como adotado com sucesso!');
            // Recarrega a lista
            const animais = await fetch('http://localhost:3001/api/animais').then(r => r.json());
            renderAnimais(animais);
          } else {
            throw new Error('Erro ao marcar como adotado');
          }
        } catch (error) {
          console.error('Erro:', error);
          alert('Erro ao processar adoção: ' + error.message);
        }
      }
    });
    
  } catch (error) {
    console.error('Erro inicial:', error);
    const container = document.getElementById('lista-animais');
    if (container) {
      container.innerHTML = `
        <p class="error-message">
          Erro ao carregar animais. Por favor, recarregue a página.
          <br><small>${error.message}</small>
        </p>
      `;
    }
  }
});