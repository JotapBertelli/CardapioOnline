import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar o token de autenticação
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
export const loginAdmin = (username, password) => {
  return axios.post(`${API_URL}/token/`, { username, password });
};


// --- Funções para o Banco de Imagens e Categorias ---
export const getBancoDeImagens = () => apiClient.get('/banco-imagens/');
export const getCategorias = () => apiClient.get('/categorias/');


// --- Funções para o Cardápio (Menu) ---
export const getMenuItems = () => apiClient.get('/menu-items/');
export const createMenuItem = (itemData) => apiClient.post('/menu-items/', itemData);
export const removeMenuItem = (itemId) => apiClient.delete(`/menu-items/${itemId}/`);
export const updateMenuItem = (itemId, itemData) => apiClient.patch(`/menu-items/${itemId}/`, itemData);


// --- Funções para o Carrinho (Cart) ---
export const getCartItems = () => apiClient.get('/cart-items/');
export const addCartItem = (produtoId, observacoes = null, finalPrice = null, adicionalId = null) => {
  return apiClient.post('/cart-items/', {
    produto_id: produtoId,
    observacoes,
    final_price: finalPrice,
    adicional_escolhido_id: adicionalId
  });
};
export const updateCartItem = (cartItemId, quantidade) => apiClient.patch(`/cart-items/${cartItemId}/`, { quantidade });
export const removeCartItem = (cartItemId) => apiClient.delete(`/cart-items/${cartItemId}/`);


// --- Funções de Pedido (Order) ---

// ✅ Cria um novo pedido
export const createOrder = (pedidoData) => {
  return apiClient.post('/pedidos/', pedidoData);
};

// ✅ Busca todos os pedidos
export const getOrders = () => {
  return apiClient.get('/pedidos/');
};

// ✅ Busca apenas pedidos pendentes/em preparo (para cozinha)
export const getPedidosPendentes = () => {
  return apiClient.get('/pedidos/pendentes/');
};

// ✅ Atualiza o status de um pedido
export const atualizarStatusPedido = (pedidoId, novoStatus) => {
  return apiClient.patch(`/pedidos/${pedidoId}/atualizar_status/`, {
    status: novoStatus
  });
};

// ✅ Busca um pedido específico
export const getPedido = (pedidoId) => {
  return apiClient.get(`/pedidos/${pedidoId}/`);
};