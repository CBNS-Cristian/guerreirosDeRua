# 🐾 Guerreiros de Rua - Frontend

Frontend para o sistema de adoção de animais Guerreiros de Rua, desenvolvido com HTML, CSS e JavaScript puro.

## 🌐 Deploy
**URL de Produção:** https://cbns-cristian.github.io/guerreirosDeRua/

## 🚀 Funcionalidades

- Listagem de animais disponíveis para adoção
- Sistema de autenticação de usuários
- Formulário de cadastro de animais (após login)
- Formulário de adoção via WhatsApp
- Design responsivo
- Modal de login e registro

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização e animações
- **JavaScript ES6+** - Funcionalidades dinâmicas
- **GitHub Pages** - Deploy e hospedagem
- **Render API** - Backend externo

## 📦 Estrutura Principal do Projeto

guerreirosDeRua/
├── index.html # Página principal
├── html/
│ ├── gatil.html 
│ ├── canil.html
│ ├── cadastrarAnimal.html # Cadastro (requer login)
│ └── sobre.html 
├── css/
│ └── styles.css 
├── js/
│ ├── app.js 
│ └── auth.js
├── modules/
│ └── uiHandlers.js 
└── images/ # Imagens locais

## 🔌 Integração com Backend
O frontend consome a API RESTful hospedada no Render:

## Base URL: https://guerreirosderua.onrender.com/api

Endpoints:

GET /animais - Listar animais
POST /animais - Cadastrar animal (autenticado)
PATCH /animais/:id/adotar - Marcar como adotado