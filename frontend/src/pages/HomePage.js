import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. Importar as funções da API que vamos usar
import { getMenuItems, getCartItems, addCartItem } from '../api';
import './MenuPage.css'; // Usaremos o CSS do layout mais completo

function HomePage() {
  // --- ESTADOS VINDOS DA API ---
  const [menuItems, setMenuItems] = useState([]); // Para guardar os pratos do cardápio
  const [cartItems, setCartItems] = useState([]);   // Para guardar os itens do carrinho
  const [loading, setLoading] = useState(true);     // Para mostrar a mensagem "A carregar..."

  // --- ESTADOS DE UI (Interface do Utilizador) ---
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const navigate = useNavigate();

  // 2. FUNÇÃO PARA CARREGAR TODOS OS DADOS DA API DE UMA SÓ VEZ
  const carregarDados = () => {
    // Usamos Promise.all para fazer as duas requisições em paralelo
    Promise.all([getMenuItems(), getCartItems()])
      .then(([menuResponse, cartResponse]) => {
        setMenuItems(menuResponse.data);
        setCartItems(cartResponse.data);
      })
      .catch(error => {
        console.error("Erro ao carregar dados da API:", error);
      })
      .finally(() => {
        setLoading(false); // Esconde a mensagem "A carregar..." no final
      });
  };

  // 3. useEffect para chamar a função carregarDados() assim que a página abre
  useEffect(() => {
    carregarDados();
  }, []);

  // 4. FUNÇÃO CORRIGIDA PARA ADICIONAR AO CARRINHO
  const handleAdicionarCarrinho = (item) => {
    addCartItem(item.id)
      .then(() => {
        // SUCESSO! Em vez de manipular o estado localmente,
        // simplesmente pedimos os dados do carrinho atualizados da API.
        // Isso garante que o contador do botão flutuante estará sempre correto.
        getCartItems().then(response => setCartItems(response.data));
        // alert("Produto adicionado ao carrinho!"); // Opcional: pode descomentar para ter um alerta
      })
      .catch((error) => {
        console.error("Erro ao adicionar item no carrinho:", error);
        alert("Erro ao adicionar item no carrinho!");
      });
  };

  const irParaCarrinho = () => {
    navigate('/carrinho');
  };

  // --- LÓGICA DE CÁLCULO E FILTRO (BASEADA NOS DADOS DA API) ---
  const totalItensCarrinho = cartItems.reduce((total, item) => total + item.quantidade, 0);
  const categorias = ['todos', ...new Set(menuItems.map(item => item.categoria))];
  const itensFiltrados = selectedCategory === 'todos'
    ? menuItems
    : menuItems.filter(item => item.categoria === selectedCategory);

  // Se estiver a carregar, mostra uma mensagem simples
  if (loading) {
    return <h2 style={{ textAlign: 'center', padding: '50px' }}>A carregar o cardápio...</h2>;
  }

  return (
    <div className="menu-container">
      {/* Header */}
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="highlight">Sabores</span> Autênticos
          </h1>
          <p className="hero-subtitle">
            Da fazenda para a sua mesa, com ingredientes frescos e receitas tradicionais
          </p>
        </div>
        <div className="hero-image">
          {/* Pode manter uma imagem estática ou carregar da API se quiser */}
          <img src="/Img/interior-restaurante.jpg" alt="Imagem de pratos" />
        </div>
      </header>

      {/* Carrinho Flutuante (agora funciona com os dados reais da API) */}
      {totalItensCarrinho > 0 && (
        <div className="carrinho-flutuante">
          <button className="carrinho-btn" onClick={irParaCarrinho}>
            🛒 {totalItensCarrinho} itens
          </button>
        </div>
      )}

      {/* Filtros */}
      <section className="filtros-section">
        <h2>Nosso Cardápio</h2>
        <div className="filtros-container">
          {categorias.map(categoria => (
            <button
              key={categoria}
              className={`filtro-btn ${selectedCategory === categoria ? 'ativo' : ''}`}
              onClick={() => setSelectedCategory(categoria)}
            >
              {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Grid de Itens (agora com dados da API) */}


<section className="menu-grid">
  {itensFiltrados.map((item) => (
    <div key={item.id} className="menu-item-card">
      <div className="card-image-container">
        <img
          // ✅ CORREÇÃO APLICADA AQUI
          src={item.imagem_url || '/placeholder-food.jpg'}
          alt={item.nome}
          className="menu-item-image"
        />
      </div>
      <div className="menu-item-content">
        <h3 className="menu-item-name">{item.nome}</h3>
        <span className="menu-item-price">
          R$ {parseFloat(item.preco).toFixed(2)}
        </span>
        <p className="menu-item-description">{item.descricao}</p>
        <button
          className="add-carrinho-btn"
          onClick={() => handleAdicionarCarrinho(item)}
        >
          Adicionar +
        </button>
      </div>
    </div>
  ))}
</section>
    </div>
  );
}

export default HomePage;

