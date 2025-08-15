// Renderiza a lista de animais
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
  const dataNow = Date.now()
  container.innerHTML = animais.map(animal => `
    <article class="animal-card">
      <div class="animal-image">
        <img src="http://localhost:3001/uploads/${animal.foto || 'sem-imagem.jpg'}" alt="${animal.nome || 'Animal'}">
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
        ${!animal.adotado ? `<button class="btn-adopt" data-id="${animal.id}">Quero adotar</button>` : ''}
      </div>
    </article>
  `).join('');
}

// Configura os handlers do formulário
export function setupFormHandlers() {
  const form = document.getElementById('form-cadastro');
  if (!form) return;

  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'loading-indicator';
  loadingIndicator.textContent = 'Enviando...';
  loadingIndicator.style.display = 'none';
  form.parentNode.insertBefore(loadingIndicator, form.nextSibling);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validação básica
    const nome = form.nome.value.trim();
    const tipo = form.tipo.value;
    const foto = form.foto.files[0];
    
    if (!nome || !tipo) {
      alert('Nome e tipo são obrigatórios!');
      return;
    }
    
    if (!foto) {
      alert('Selecione uma foto do animal!');
      return;
    }

    const formData = new FormData(form);
    
    try {
      // Mostra indicador de carregamento
      loadingIndicator.style.display = 'block';
      form.querySelector('button[type="submit"]').disabled = true;

      const response = await fetch('http://localhost:3001/api/animais', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao cadastrar animal');
      }

      // Feedback visual
      alert('Animal cadastrado com sucesso!');
      form.reset();
      
      // Recarrega a lista de animais
      const animaisResponse = await fetch('http://localhost:3001/api/animais');
      const animais = await animaisResponse.json();
      renderAnimais(animais);

    } catch (error) {
      console.error('Erro no cadastro:', error);
      alert(`Erro: ${error.message}`);
    } finally {
      // Esconde indicador de carregamento
      loadingIndicator.style.display = 'none';
      form.querySelector('button[type="submit"]').disabled = false;
    }
  });
}