import renderAnimais from './modules/uiHandlers.js';
import { initAuthHandlers, setupRegisterHandler, setupFormHandlers } from './modules/uiHandlers.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Inicializa todos os handlers de autenticação
  initAuthHandlers();
  
  // Configura handlers de formulários
  setupRegisterHandler();
  setupFormHandlers(); 

  try {
    // Carrega os animais iniciais
    const response = await fetch('https://guerreirosderua.onrender.com/api/animais');
    
    if (!response.ok) {
      throw new Error('Erro ao carregar animais');
    }
    
    const animais = await response.json();
    renderAnimais(animais);
    
    // Adiciona event listeners para botões de adoção
    // document.addEventListener('click', async (e) => {
    //   if (e.target.classList.contains('btn-adopt')) {
    //     const animalId = e.target.dataset.id;
    //     try {
    //       const authToken = localStorage.getItem('authToken');
    //       const response = await fetch(`https://guerreirosderua.onrender.com/api/animais/${animalId}/adotar`, {
    //         method: 'PATCH',
    //         headers: {
    //           'Authorization': `Bearer ${authToken}`
    //         }
    //       });
          
    //       if (response.ok) {
    //         alert('Animal marcado como adotado com sucesso!');
    //         const animais = await fetch('https://guerreirosderua.onrender.com/api/animais').then(r => r.json());
    //         renderAnimais(animais);
    //       }
    //     } catch (error) {
    //       console.error('Erro:', error);
    //       alert('Erro ao processar adoção: ' + error.message);
    //     }
    //   }
    // });
    
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