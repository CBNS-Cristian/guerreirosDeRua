const API_BASE_URL = 'http://localhost:3001/api/animais';

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