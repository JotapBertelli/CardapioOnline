import axios from 'axios';

// URL base da sua API Django.
const API_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

// --- Funções para o Cardápio (Menu) ---

// Busca todos os itens do cardápio
export const getMenuItems = () => {
  return apiClient.get('/menu-items/');
};

// Cria um novo item no cardápio (usado pela AdminPage)
// Nota: 'formData' é usado para permitir o upload de imagens
export const createMenuItem = (formData) => {
  return apiClient.post('/menu-items/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Apaga um item do cardápio (usado pela AdminPage)
export const removeMenuItem = (itemId) => {
  return apiClient.delete(`/menu-items/${itemId}/`);
};


// --- Funções para o Carrinho (Cart) ---

// Busca todos os itens do carrinho
export const getCartItems = () => {
  return apiClient.get('/cart-items/');
};

// Adiciona um item ao carrinho
// Corrigido para usar a rota padrão do DRF e enviar o ID do produto
export const addCartItem = (produtoId) => {
  return apiClient.post('/cart-items/', { produto: produtoId });
};

// Atualiza a quantidade de um item no carrinho
export const updateCartItem = (cartItemId, quantidade) => {
  return apiClient.patch(`/cart-items/${cartItemId}/`, { quantidade });
};

// Remove um item do carrinho
export const removeCartItem = (cartItemId) => {
  return apiClient.delete(`/cart-items/${cartItemId}/`);
};

