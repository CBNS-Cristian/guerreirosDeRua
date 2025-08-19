export default function renderAnimais(animais, tipoFiltro = null) {
  const container = document.getElementById('lista-animais');
  
  if (!container) {
    console.error('Elemento lista-animais não encontrado');
    return;
  }

  if (!animais || !Array.isArray(animais)) {
    container.innerHTML = '<p class="no-animals">Nenhum animal disponível no momento</p>';
    return;
  }

  container.innerHTML = animais.map(animal => `
    <article class="animal-card">
      <div class="animal-image">
        <img src="https://guerreirosderua.onrender.com/uploads/${animal.foto || 'sem-imagem.jpg'}" alt="${animal.nome || 'Animal'}">
        <span class="badge ${animal.adotado ? 'adopted' : 'available'}">
          ${animal.adotado ? 'Adotado' : 'Disponível'}
        </span>
      </div>
      <div class="animal-info">
        <h3>${animal.nome || 'Sem nome'}</h3>
        <ul class="animal-details">
          <li><strong>Tipo:</strong> ${animal.tipo || 'Não especificado'}</li>
          <li><strong>Nascimento:</strong> ${animal.nascimento ? new Date(animal.nascimento).toLocaleDateString() : 'Desconhecido'}</li>
          <li><strong>Resgate:</strong> ${animal.data_resgate ? new Date(animal.data_resgate).toLocaleDateString() : 'Desconhecido'}</li>
          <li><strong>Descrição:</strong> ${animal.descricao || 'Sem descrição'}</li>
        </ul>
        ${!animal.adotado ? `<button class="btn-adopt" data-id="${animal.id}" data-name="${animal.nome || 'Animal'}">Quero adotar</button>` : ''}
      </div>
    </article>
  `).join('');

  // Adiciona event listeners aos botões de adoção
  document.querySelectorAll('.btn-adopt').forEach(button => {
    button.addEventListener('click', (e) => {
      const animalId = e.target.getAttribute('data-id');
      const animalName = e.target.getAttribute('data-name');
      
      // Verifica se o usuário está logado
      const isAuthenticated = !!localStorage.getItem('authToken');
      
      if (isAuthenticated) {
        // Usuário logado: marca como adotado no banco
        marcarComoAdotado(animalId, animalName);
      } else {
        // Usuário não logado: mostra formulário WhatsApp
        showAdoptionForm(animalId, animalName);
      }
      
      e.stopPropagation();
    });
  });
}

// Função para marcar animal como adotado (apenas para usuários logados)
async function marcarComoAdotado(animalId, animalName) {
  const authToken = localStorage.getItem('authToken');
  
  if (!authToken) {
    alert('Erro de autenticação. Faça login novamente.');
    return;
  }

  try {
    const response = await fetch(`https://guerreirosderua.onrender.com/api/animais/${animalId}/adotar`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao marcar como adotado');
    }

    alert(`O animal ${animalName} foi marcado como adotado com sucesso!`);
    
    // Recarrega a lista de animais para atualizar a interface
    const animaisResponse = await fetch('https://guerreirosderua.onrender.com/api/animais');
    const animais = await animaisResponse.json();
    renderAnimais(animais);

  } catch (error) {
    console.error('Erro ao marcar como adotado:', error);
    alert(`Erro: ${error.message}`);
  }
}

// Função para mostrar o formulário de adoção (apenas para usuários não logados)
function showAdoptionForm(animalId, animalName) {
  // Criar o modal do formulário
  const modal = document.createElement('div');
  modal.className = 'modal-adoption';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Formulário de Adoção</h2>
      <p>Preencha os dados para entrar em contato sobre a adoção do ${animalName}</p>
      <form id="adoption-form">
        <input type="hidden" id="animal-id" value="${animalId}">
        <div class="form-group">
          <label for="adopter-name">Seu nome completo:</label>
          <input type="text" id="adopter-name" required>
        </div>
        <div class="form-group">
          <label for="adopter-phone">Telefone/WhatsApp:</label>
          <input type="tel" id="adopter-phone" required>
        </div>
        <div class="form-group">
          <label for="adopter-email">E-mail:</label>
          <input type="email" id="adopter-email" required>
        </div>
        <div class="form-group">
          <label for="adopter-address">Endereço:</label>
          <textarea id="adopter-address" rows="2" required></textarea>
        </div>
        <div class="form-group">
          <label for="adoption-message">Mensagem (opcional):</label>
          <textarea id="adoption-message" rows="3" placeholder="Conte um pouco sobre você e por que quer adotar este animal"></textarea>
        </div>
        <button type="submit" class="btn-submit">Enviar para WhatsApp</button>
      </form>
    </div>
  `;

  // Adicionar o modal ao documento
  document.body.appendChild(modal);

  // Mostrar o modal
  setTimeout(() => modal.classList.add('active'), 10);

  // Fechar o modal ao clicar no X
  modal.querySelector('.close-modal').addEventListener('click', () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  });

  // Fechar o modal ao clicar fora dele
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    }
  });

  // Processar o formulário
  const form = modal.querySelector('#adoption-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    processAdoptionForm(animalId, animalName);
  });
}

// Função para processar o formulário e redirecionar para o WhatsApp
function processAdoptionForm(animalId, animalName) {
  // Obter os valores do formulário
  const name = document.getElementById('adopter-name').value;
  const phone = document.getElementById('adopter-phone').value;
  const email = document.getElementById('adopter-email').value;
  const address = document.getElementById('adopter-address').value;
  const message = document.getElementById('adoption-message').value;

  // Número de telefone da ONG '5581996483609'
  const ongPhoneNumber = '5581999773241'; 

  // Criar a mensagem para o WhatsApp
  const whatsappMessage = `Olá! Gostaria de adotar o animal ${animalName}.\n\n*Meus dados:*\nNome: ${name}\nTelefone: ${phone}\nE-mail: ${email}\nEndereço: ${address}\n\n${message ? `*Mensagem:*\n${message}` : ''}`;

  // Codificar a mensagem para URL
  const encodedMessage = encodeURIComponent(whatsappMessage);

  // Redirecionar para o WhatsApp
  window.open(`https://wa.me/${ongPhoneNumber}?text=${encodedMessage}`, '_blank');

  // Fechar o modal
  const modal = document.querySelector('.modal-adoption');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  }
}

// Configura os handlers do formulário de animais
export function setupFormHandlers() {
  const form = document.getElementById('form-cadastro');
  if (!form) return;

  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);
  const cleanForm = document.getElementById('form-cadastro');

  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'loading-indicator';
  loadingIndicator.textContent = 'Enviando...';
  loadingIndicator.style.display = 'none';
  cleanForm.parentNode.insertBefore(loadingIndicator, cleanForm.nextSibling);

  cleanForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(cleanForm);
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
      alert('Você precisa estar logado para cadastrar animais!');
      return;
    }

    try {
      loadingIndicator.style.display = 'block';
      cleanForm.querySelector('button[type="submit"]').disabled = true;

      const response = await fetch('https://guerreirosderua.onrender.com/api/animais', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao cadastrar animal');
      }

      alert('Animal cadastrado com sucesso!');
      cleanForm.reset();
      
      // Atualiza a lista de animais
      const animaisResponse = await fetch('https://guerreirosderua.onrender.com/api/animais');
      const animais = await animaisResponse.json();
      renderAnimais(animais);

    } catch (error) {
      console.error('Erro no cadastro:', error);
      alert(`Erro: ${error.message}`);
    } finally {
      loadingIndicator.style.display = 'none';
      cleanForm.querySelector('button[type="submit"]').disabled = false;
    }
  });
}

// Funções de Autenticação
export async function fazerLogin(email, senha) {
    const loginData = {
        email: email.trim(),
        senha: senha.trim()
    };

    try {
        const response = await fetch('https://guerreirosderua.onrender.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erro na autenticação');
        }

        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify({
            id: data.user.id,
            nome: data.user.nome,
            email: data.user.email
        }));
        
        return data.user;

    } catch (error) {
        console.error('Erro no login:', error);
        throw error;
    }
}

export function setupLoginHandler() {
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginError.textContent = '';

      try {
        const email = document.getElementById('loginEmail').value;
        const senha = document.getElementById('loginSenha').value;
        
        await fazerLogin(email, senha);
        
        const modal = document.getElementById('loginModal');
        if (modal) modal.style.display = 'none';
        
        updateAuthUI();
        
        if (window.location.pathname.includes('admin.html')) {
          window.location.reload();
        }
      } catch (error) {
        loginError.textContent = error.message;
      }
    });
  }
}


export function setupRegisterHandler() {
  const registerForm = document.getElementById('registerUserForm');
  
  if (registerForm) {

    const newForm = registerForm.cloneNode(true);
    registerForm.parentNode.replaceChild(newForm, registerForm);
    
    const form = document.getElementById('registerUserForm');
    const submitButton = form.querySelector('button[type="submit"]');

    const handleSubmit = async (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      
      const formData = {
        nome: document.getElementById('user-nome').value.trim(),
        email: document.getElementById('user-email').value.trim().toLowerCase(),
        senha: document.getElementById('user-senha').value,
        confirmarSenha: document.getElementById('user-confirmarSenha').value,
        tipo: document.getElementById('user-tipo').value || 'padrao'
      };

      // Validações
      if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha) {
        alert('Todos os campos são obrigatórios!');
        return;
      }

      if (formData.senha !== formData.confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
      }

      if (formData.senha.length < 6) {
        alert('A senha deve ter no mínimo 6 caracteres!');
        return;
      }

      try {
        submitButton.disabled = true;
        submitButton.textContent = 'Cadastrando...';

        const response = await fetch('https://guerreirosderua.onrender.com/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome: formData.nome,
            email: formData.email,
            senha: formData.senha,
            tipo: formData.tipo
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao registrar usuário');
        }

        const data = await response.json();
        alert('Cadastro realizado com sucesso!');
        form.reset();
        
        // Redireciona para login após 2 segundos
        setTimeout(() => {
           window.location.href = '/guerreirosDeRua/index.html'; 
        }, 2000);

      } catch (error) {
        console.error('Erro no cadastro:', error);
        alert('Erro: ' + error.message);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Cadastrar';
      }
    };

    // Adiciona listeners
    form.addEventListener('submit', handleSubmit);
    submitButton.addEventListener('click', handleSubmit);
  }
}


export function estaAutenticado() {
  return !!localStorage.getItem('authToken'); 
}

export function fazerLogout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  window.location.href = '/guerreirosDeRua/index.html';   
}

export function updateAuthUI() {
  const isAuthenticated = estaAutenticado();
  const loginBtn = document.getElementById('openLoginModal');
  const logoutBtn = document.getElementById('logoutBtn');
  const loggedUserSection = document.getElementById('loggedUserSection');
  const cadastrarLink = document.querySelector('a[href*="cadastrarAnimal.html"]');

  if (loginBtn) loginBtn.style.display = isAuthenticated ? 'none' : 'flex';
  if (logoutBtn) logoutBtn.style.display = isAuthenticated ? 'flex' : 'none';
  if (loggedUserSection) loggedUserSection.style.display = isAuthenticated ? 'flex' : 'none';
  if (cadastrarLink) cadastrarLink.style.display = isAuthenticated ? 'block' : 'none';

  if (isAuthenticated) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usernameDisplay = document.getElementById('usernameDisplay');
    if (usernameDisplay && userData) {
      usernameDisplay.textContent = userData.email;
    }
  }
}

export function setupLogoutHandler() {
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      fazerLogout();
    });
  }
}

export function initAuthHandlers() {
  setupLoginHandler();
  setupLogoutHandler();
  updateAuthUI();
}