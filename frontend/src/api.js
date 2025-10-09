import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar o token de autenticação (está correto)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Funções de Autenticação ---
// Esta função parece correta para o seu setup de login.
export const loginAdmin = (username, password) => {
  return axios.post('http://127.0.0.1:8000/api/token/', { username, password });
};


// --- Funções para o Banco de Imagens ---

// ✅ 1. NOVA FUNÇÃO ADICIONADA
// Esta função busca a lista de imagens disponíveis para preencher o <select> no seu formulário.
export const getBancoDeImagens = () => apiClient.get('/banco-imagens/');


// --- Funções para o Cardápio (Menu) ---
export const getMenuItems = () => apiClient.get('/menu-items/');

// ✅ 2. FUNÇÃO ATUALIZADA
// Agora aceita um objeto 'itemData' e o envia como JSON. Não usamos mais FormData.
export const createMenuItem = (itemData) => {
  return apiClient.post('/menu-items/', itemData);
};

export const removeMenuItem = (itemId) => apiClient.delete(`/menu-items/${itemId}/`);

// ✅ 3. FUNÇÃO ATUALIZADA
// Também foi alterada para enviar 'itemData' como JSON. Usamos PATCH para atualizações eficientes.
export const updateMenuItem = (itemId, itemData) => {
  return apiClient.patch(`/menu-items/${itemId}/`, itemData);
};


// --- Funções para o Carrinho (Cart) ---
// Nenhuma alteração necessária aqui.
export const getCartItems = () => apiClient.get('/cart-items/');

export const addCartItem = (produtoId, quantidade = 1) => {
  return axios.post("http://127.0.0.1:8000/api/cart-items/", {
    produto_id: produtoId,
    quantidade: quantidade
  });
};

export const updateCartItem = (cartItemId, quantidade) => {
  return apiClient.patch(`/cart-items/${cartItemId}/`, { quantidade });
};

export const removeCartItem = (cartItemId) => {
  return apiClient.delete(`/cart-items/${cartItemId}/`);
};