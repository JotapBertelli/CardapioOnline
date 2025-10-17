import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMenuItems, getCartItems, addCartItem } from "../api";
import ModalPersonalizacao from "../components/ModalPersonalizacao"; // ✅ NOVO
import "./MenuPage.css";

function HomePage() {
  const [menuItems, setMenuItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [produtoParaPersonalizar, setProdutoParaPersonalizar] = useState(null); // ✅ NOVO
  const [selectedCategory, setSelectedCategory] = useState("todos");

  const navigate = useNavigate();

  const carregarDados = async () => {
    try {
      const [menuResponse, cartResponse] = await Promise.all([
        getMenuItems(),
        getCartItems(),
      ]);
      setMenuItems(menuResponse.data);
      setCartItems(cartResponse.data);
    } catch (error) {
      console.error("Erro ao carregar dados da API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // ✅ ATUALIZADO: Verifica se o produto tem adicionais
  const handleAdicionarCarrinho = async (item) => {
    // Se o produto tem adicionais, abre o modal de personalização
    if (item.adicionais && item.adicionais.length > 0) {
      setProdutoParaPersonalizar(item);
      return;
    }

    // Se não tem adicionais, adiciona direto
    try {
      await addCartItem(item.id, null, null);
      const response = await getCartItems();
      setCartItems(response.data);
    } catch (error) {
      console.error("Erro ao adicionar item no carrinho:", error);
      alert("Erro ao adicionar item no carrinho!");
    }
  };

  // ✅ NOVO: Adiciona item personalizado ao carrinho
  const handleAdicionarPersonalizado = async (dados) => {
    try {
      await addCartItem(
        dados.produto_id,
        dados.observacoes,
        dados.final_price,
        dados.adicional_escolhido_id
      );
      const response = await getCartItems();
      setCartItems(response.data);
      setProdutoParaPersonalizar(null);
    } catch (error) {
      console.error("Erro ao adicionar item personalizado:", error);
      alert("Erro ao adicionar item no carrinho!");
    }
  };

  const irParaCarrinho = () => navigate("/carrinho");

  const totalItensCarrinho = cartItems.reduce(
    (total, item) => total + item.quantidade,
    0
  );
  const categorias = ["todos", ...new Set(menuItems.map((item) => item.categoria))];

  const itensFiltrados =
    selectedCategory === "todos"
      ? menuItems
      : menuItems.filter((item) => item.categoria === selectedCategory);

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", padding: "50px" }}>
        Carregando o cardápio...
      </h2>
    );
  }

  return (
    <div className="menu-container">
      {/* HERO */}
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="highlight">Sabores</span> Autênticos
          </h1>
          <p className="hero-subtitle">
            Da Fazenda para a sua mesa, com ingredientes frescos e receitas
            tradicionais.
          </p>
        </div>
        <div className="hero-image">
          <img
            src={`${process.env.PUBLIC_URL}/Img/restaurante.jpg`}
            alt="Imagem de pratos"
            loading="lazy"
          />
        </div>
      </header>

      {/* CARRINHO FLUTUANTE */}
      {totalItensCarrinho > 0 && (
        <div className="carrinho-flutuante">
          <button className="carrinho-btn" onClick={irParaCarrinho}>
            🛒 {totalItensCarrinho} itens
          </button>
        </div>
      )}

      {/* FILTROS */}
      <section className="filtros-section">
        <h2>Nosso Cardápio</h2>
        <div className="filtros-container">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              className={`filtro-btn ${
                selectedCategory === categoria ? "ativo" : ""
              }`}
              onClick={() => setSelectedCategory(categoria)}
            >
              {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* GRID DE ITENS */}
      <section className="menu-grid">
        {itensFiltrados.map((item) => (
          <div
            key={item.id}
            className="menu-item-card"
            onClick={() => setProdutoSelecionado(item)}
          >
            <div className="card-image-container">
              <img
                src={item.imagem_url}
                alt={item.nome}
                className="menu-item-image"
                loading="lazy"
              />
            </div>

            <div className="menu-item-content">
              <h3 className="menu-item-name">{item.nome}</h3>
              <span className="menu-item-price">
                R$ {parseFloat(item.preco).toFixed(2)}
              </span>
              <p className="menu-item-description">{item.descricao}</p>

              {/* ✅ ATUALIZADO: Mostra botão diferente se tem adicionais */}
              <button
                className="add-carrinho-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdicionarCarrinho(item);
                }}
              >
                {item.adicionais && item.adicionais.length > 0
                  ? "Personalizar +"
                  : "Adicionar +"}
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* MODAL DE PRODUTO (visualização simples) */}
      {produtoSelecionado && (
        <div
          className="modal-overlay"
          onClick={() => setProdutoSelecionado(null)}
        >
          <div
            className="modal-conteudo"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="fechar-btn"
              onClick={() => setProdutoSelecionado(null)}
            >
              ✕
            </button>

            <img
              src={produtoSelecionado.imagem_url || "/placeholder-food.jpg"}
              alt={produtoSelecionado.nome}
              className="modal-imagem"
            />

            <h2>{produtoSelecionado.nome}</h2>
            <p className="descricao">{produtoSelecionado.descricao}</p>
            <p className="preco">
              R$ {parseFloat(produtoSelecionado.preco).toFixed(2)}
            </p>

            <button
              className="add-btn"
              onClick={async () => {
                await handleAdicionarCarrinho(produtoSelecionado);
                setProdutoSelecionado(null);
              }}
            >
              {produtoSelecionado.adicionais && produtoSelecionado.adicionais.length > 0
                ? "Personalizar"
                : "Adicionar ao Carrinho"}
            </button>
          </div>
        </div>
      )}

      {/* ✅ NOVO: MODAL DE PERSONALIZAÇÃO */}
      {produtoParaPersonalizar && (
        <ModalPersonalizacao
          produto={produtoParaPersonalizar}
          onClose={() => setProdutoParaPersonalizar(null)}
          onAdicionar={handleAdicionarPersonalizado}
        />
      )}
    </div>
  );
}

export default HomePage;