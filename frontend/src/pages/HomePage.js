import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMenuItems, getCartItems, addCartItem } from "../api";
import ModalPersonalizacao from "../components/ModalPersonalizacao";
import "./MenuPage.css";

/**
 * 🎨 TOTEM PROFISSIONAL - ESTILO ABRAHAOO V2
 * HomePage - Componente principal do menu interativo
 * Design moderno e profissional com animações suaves
 */

function HomePage() {
  // ================================
  // 🎯 ESTADOS DO COMPONENTE
  // ================================
  const [menuItems, setMenuItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [produtoParaPersonalizar, setProdutoParaPersonalizar] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [expandedSection, setExpandedSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isWaiterCalled, setIsWaiterCalled] = useState(false);

  const navigate = useNavigate();

  // ================================
  // 🔄 CARREGAMENTO DE DADOS
  // ================================
  const carregarDados = async () => {
    try {
      setLoading(true);
      const [menuResponse, cartResponse] = await Promise.all([
        getMenuItems(),
        getCartItems(),
      ]);

      setMenuItems(menuResponse.data);
      setCartItems(cartResponse.data);
    } catch (error) {
      console.error("Erro ao carregar dados da API:", error);
      showNotification("Erro ao carregar o cardápio", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // ================================
  // 📢 SISTEMA DE NOTIFICAÇÕES
  // ================================
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // ================================
  // 🛒 MANIPULAÇÃO DO CARRINHO
  // ================================
  const handleAdicionarCarrinho = async (item) => {
    // Verifica se o produto tem adicionais
    if (item.adicionais && item.adicionais.length > 0) {
      setProdutoParaPersonalizar(item);
      return;
    }

    try {
      await addCartItem(item.id, null, null);
      const response = await getCartItems();
      setCartItems(response.data);
      showNotification(`${item.nome} adicionado ao carrinho!`, "success");
    } catch (error) {
      console.error("Erro ao adicionar item no carrinho:", error);
      showNotification("Erro ao adicionar item no carrinho!", "error");
    }
  };

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

      const produto = menuItems.find(item => item.id === dados.produto_id);
      showNotification(
        `${produto?.nome || 'Produto'} personalizado adicionado!`,
        "success"
      );
    } catch (error) {
      console.error("Erro ao adicionar item personalizado:", error);
      showNotification("Erro ao adicionar item no carrinho!", "error");
    }
  };

  // ================================
  // 🚀 NAVEGAÇÃO
  // ================================
  const irParaCarrinho = () => {
    navigate("/carrinho");
  };

  // ================================
  // 🔢 CÁLCULOS
  // ================================
  const totalItensCarrinho = cartItems.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  const totalValorCarrinho = cartItems.reduce(
    (total, item) => total + (parseFloat(item.preco) * item.quantidade),
    0
  );

  // ================================
  // 📋 ESTRUTURA DO MENU
  // ================================
  const menuStructure = {
    destaques: {
      nome: "Destaques",
      icon: <img src="/img/estrela.png" alt="Logo" width={29}/>,
      categorias: [],
      standalone: true
    },
    pratos: {
      nome: "Pratos",
      icon: <img src="/img/prato.png" alt="Logo" width={70}/>,
      categorias: ["entradas", "pratos_quentes", "sobremesas"],
      standalone: false
    },
    bebidas: {
      nome: "Bebidas",
      icon: <img src="/img/cerveja.png" alt="Logo" width={70}/>,
      categorias: ["bebidas", "bebidas_alcoolicas", "drinks"],
      standalone: false
    },
    porcoes: {
      nome: "Porções",
      icon: <img src="/img/bandeja.png" alt="Logo" width={70}/>,
      categorias: ["porcoes"],
      standalone: false
    }
  };

  // ================================
  // 🎯 MANIPULAÇÃO DE SEÇÕES
  // ================================
  const toggleSection = (section) => {
    if (menuStructure[section]?.standalone) {
      setSelectedCategory(section);
      setExpandedSection(null);
      return;
    }

    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleCategorySelect = (categoria) => {
    setSelectedCategory(categoria);
  };

  // ================================
  // 🔍 BUSCA
  // ================================
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchTerm("");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // ================================
  // 👋 CHAMAR GARÇOM
  // ================================
  const chamarGarcom = () => {
    setIsWaiterCalled(true);
    showNotification("Garçom chamado com sucesso! Aguarde um momento.", "success");

    setTimeout(() => {
      setIsWaiterCalled(false);
    }, 30000); // Reset após 30 segundos
  };

  // ================================
  // 🎨 FORMATAÇÃO
  // ================================
  const formatarCategoria = (categoria) => {
    return categoria
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatarPreco = (preco) => {
    return `R$ ${parseFloat(preco).toFixed(2).replace('.', ',')}`;
  };

  // ================================
  // 🔍 FILTRAGEM DE ITENS
  // ================================
  const itensFiltrados = menuItems.filter(item => {
    // Filtro por categoria
    const categoriaMatch = selectedCategory === "todos" ||
                          selectedCategory === "destaques" ||
                          item.categoria === selectedCategory;

    // Filtro por busca
    const searchMatch = !searchTerm ||
                       item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.descricao.toLowerCase().includes(searchTerm.toLowerCase());

    return categoriaMatch && searchMatch;
  });

  // ================================
  // 📊 ESTATÍSTICAS DO MENU
  // ================================
  const getCategoriasComItens = () => {
    const categorias = new Set(menuItems.map(item => item.categoria));
    return Array.from(categorias);
  };

  const getItensCount = (categoria) => {
    return menuItems.filter(item => item.categoria === categoria).length;
  };

  // ================================
  // 🎬 LOADING STATE
  // ================================
  if (loading) {
    return (
      <div className="menu-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2 className="loading-text">Carregando o cardápio...</h2>
          <p style={{
            color: 'var(--text-tertiary)',
            fontSize: 'var(--font-size-sm)',
            marginTop: 'var(--spacing-md)'
          }}>
            Preparando as melhores opções para você
          </p>
        </div>
      </div>
    );
  }

  // ================================
  // 🎨 RENDERIZAÇÃO PRINCIPAL
  // ================================
  return (
    <div className="menu-container">
      {/* ================================
          📱 HEADER PROFISSIONAL
      ================================ */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-logo">

    <img src="/img/shop.png" alt="Logo" />

</div>

          <div>
            <h1 className="hero-title">
              <span className="highlight">Mesa</span>
              <span className="table-badge">002</span>
            </h1>
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-tertiary)',
              marginTop: 'var(--spacing-xs)'
            }}>
              Bem-vindo ao nosso cardápio digital
            </p>
          </div>
        </div>

        <div className="header-actions">
          {/* Botão de Busca */}
          <button
            className="action-btn"
            onClick={toggleSearch}
            aria-label="Buscar no cardápio"
          >
            <span className="action-btn-icon"><img src="/img/lupa.png" alt="Logo" width={23}/></span>
            <span>Buscar</span>
          </button>

          {/* Botão Chamar Garçom */}
          <button
            className="action-btn"
            onClick={chamarGarcom}
            disabled={isWaiterCalled}
            style={{
              opacity: isWaiterCalled ? 0.5 : 1,
              cursor: isWaiterCalled ? 'not-allowed' : 'pointer'
            }}
            aria-label="Chamar garçom"
          >
            <span className="action-btn-icon"><img src="/img/garcom.png" alt="Logo" width={23}/></span>
            <span>{isWaiterCalled ? 'Chamando...' : 'Garçom'}</span>
          </button>

          {/* Carrinho Flutuante */}
          {totalItensCarrinho > 0 && (
            <div className="carrinho-flutuante">
              <button
                className="carrinho-btn"
                onClick={irParaCarrinho}
                aria-label={`Ver carrinho com ${totalItensCarrinho} itens`}
              >
                <span><img src="/img/carrinho.png" alt="Logo" width={23}/></span>
                <span className="carrinho-count">{totalItensCarrinho}</span>
                <span style={{ fontSize: 'var(--font-size-xs)', opacity: 0.9 }}>

                </span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ================================
          🔍 BARRA DE BUSCA EXPANDÍVEL
      ================================ */}
      {isSearchOpen && (
        <div style={{
          padding: 'var(--spacing-xl) var(--spacing-2xl)',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-default)',
          animation: 'slideDown 0.3s ease'
        }}>
          <input
            type="text"
            placeholder="Buscar pratos, bebidas..."
            value={searchTerm}
            onChange={handleSearch}
            autoFocus
            style={{
              width: '100%',
              padding: 'var(--spacing-md) var(--spacing-xl)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--text-primary)',
              fontSize: 'var(--font-size-base)',
              outline: 'none',
              transition: 'all var(--transition-base)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary-500)';
              e.target.style.boxShadow = 'var(--shadow-glow)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-default)';
              e.target.style.boxShadow = 'none';
            }}
          />

          {searchTerm && (
            <p style={{
              marginTop: 'var(--spacing-md)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-tertiary)'
            }}>
              {itensFiltrados.length} resultado(s) encontrado(s)
            </p>
          )}
        </div>
      )}

      {/* ================================
          📋 NOTIFICAÇÕES
      ================================ */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: 'var(--spacing-2xl)',
          right: 'var(--spacing-2xl)',
          background: notification.type === 'success'
            ? 'linear-gradient(135deg, var(--primary-500), var(--primary-600))'
            : 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white',
          padding: 'var(--spacing-lg) var(--spacing-2xl)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 1000,
          animation: 'slideDown 0.3s ease',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 600,
          maxWidth: '400px'
        }}>
          {notification.message}
        </div>
      )}

      {/* ================================
          📋 LAYOUT PRINCIPAL
      ================================ */}
      <div className="content-wrapper">
        {/* ================================
            🎯 SIDEBAR DE FILTROS
        ================================ */}
        <aside className="filtros-section">
          <h2>
            <span>Menu Completo</span>
          </h2>



          {/* Menu de Navegação */}
          {Object.entries(menuStructure).map(([key, section]) => (
            <div key={key} className="menu-section">
              {section.standalone ? (
                /* Botão sem submenu (Destaques) */
                <button
                  className={`filtro-btn ${
                    selectedCategory === key ? 'ativo' : ''
                  }`}
                  onClick={() => toggleSection(key)}
                  aria-label={`Filtrar por ${section.nome}`}
                >
                  <span style={{ marginRight: 'var(--spacing-sm)' }}>
                    {section.icon}
                  </span>
                  {section.nome}
                </button>
              ) : (
                /* Seção com accordion */
                <>
                  <button
                    className={`section-btn ${
                      expandedSection === key ? 'expanded' : ''
                    }`}
                    onClick={() => toggleSection(key)}
                    aria-expanded={expandedSection === key}
                    aria-label={`${expandedSection === key ? 'Recolher' : 'Expandir'} ${section.nome}`}
                  >
                    <span className="section-icon">{section.icon}</span>
                    <span className="section-name">{section.nome}</span>
                    <span className="expand-icon">
                      {expandedSection === key ? '▼' : '▶'}
                    </span>
                  </button>

                  {/* Submenu */}
                  {expandedSection === key && (
                    <div className="submenu">
                      <div className="filtros-container">
                        {section.categorias.map((categoria) => (
                          <button
                            key={categoria}
                            className={`filtro-btn ${
                              selectedCategory === categoria ? 'ativo' : ''
                            }`}
                            onClick={() => handleCategorySelect(categoria)}
                            aria-label={`Filtrar por ${formatarCategoria(categoria)}`}
                          >
                            {formatarCategoria(categoria)}
                            <span style={{
                              marginLeft: 'auto',
                              fontSize: 'var(--font-size-xs)',
                              opacity: 0.6
                            }}>
                              ({getItensCount(categoria)})
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {/* Botão Todos */}
          <div className="menu-section" style={{ marginTop: 'var(--spacing-xl)' }}>

          </div>


        </aside>

        {/* ================================
            🍽️ GRID DE ITENS DO MENU
        ================================ */}
        <section className="menu-grid">
          {/* Cabeçalho da seção */}
          <div style={{
            marginBottom: 'var(--spacing-xl)',
            paddingBottom: 'var(--spacing-xl)',
            borderBottom: '1px solid var(--border-default)'
          }}>
            <h2 style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 800,
              color: '#fff',
              marginBottom: 'var(--spacing-sm)'
            }}>
              {selectedCategory === 'todos'
                ? 'Todos os Pratos'
                : formatarCategoria(selectedCategory)}
            </h2>

            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-tertiary)'
            }}>

            </p>
          </div>

          {/* Lista de itens */}
          {itensFiltrados.length > 0 ? (
            itensFiltrados.map((item, index) => (
              <article
                key={item.id}
                className="menu-item-card"
                style={{
                  animationDelay: `${index * 50}ms`
                }}
                onClick={() => setProdutoSelecionado(item)}
                role="button"
                tabIndex={0}
                aria-label={`Ver detalhes de ${item.nome}`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setProdutoSelecionado(item);
                  }
                }}
              >
                {/* Imagem do produto */}
                <div className="card-image-container">
                  <img
                    src={item.imagem_url || "/placeholder-food.jpg"}
                    alt={item.nome}
                    className="menu-item-image"
                    loading="lazy"
                  />

                  {/* Badge de categoria */}
                  <div style={{
                    position: 'absolute',
                    top: 'var(--spacing-md)',
                    left: 'var(--spacing-md)',
                    background: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(8px)',
                    padding: 'var(--spacing-xs) var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 600,
                    color: 'var(--primary-400)',
                    border: '1px solid var(--primary-500)',
                    zIndex: 10
                  }}>
                    {formatarCategoria(item.categoria)}
                  </div>
                </div>

                {/* Conteúdo do card */}
                <div className="menu-item-content">
                  <div>
                    <div className="menu-item-header">
                      <h3 className="menu-item-name">{item.nome}</h3>
                      <span className="menu-item-price">
                        {formatarPreco(item.preco)}
                      </span>
                    </div>

                    <p className="menu-item-description">
                      {item.descricao}
                    </p>
                  </div>

                  {/* Rodapé do card */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--spacing-md)'
                  }}>
                    <button
                      className="add-carrinho-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdicionarCarrinho(item);
                      }}
                      aria-label={`Adicionar ${item.nome} ao carrinho`}
                    >
                      <span style={{ marginRight: 'var(--spacing-xs)' }}>+</span>
                      Adicionar
                    </button>

                    {/* Indicador de adicionais */}
                    {item.adicionais && item.adicionais.length > 0 && (
                      <span style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--primary-400)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)'
                      }}>
                        <span>⚙️</span>
                        Personalizável
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))
          ) : (
            /* Estado vazio */
            <div className="empty-state">
              <div className="empty-state-icon"><img src="/img/lupa.png" alt="Logo" width={70}/></div>
              <p className="empty-state-text">
                Nenhum item encontrado
              </p>
              <p style={{ fontSize: 'var(--font-size-sm)' }}>
                Tente ajustar os filtros ou a busca
              </p>
            </div>
          )}
        </section>
      </div>

      {/* ================================
          🪟 MODAL DE DETALHES
      ================================ */}
      {produtoSelecionado && (
        <div
          className="modal-overlay"
          onClick={() => setProdutoSelecionado(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="modal-conteudo"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão fechar */}
            <button
              className="fechar-btn"
              onClick={() => setProdutoSelecionado(null)}
              aria-label="Fechar modal"
            >
              ✕
            </button>

            {/* Imagem */}
            <img
              src={produtoSelecionado.imagem_url || "/placeholder-food.jpg"}
              alt={produtoSelecionado.nome}
              className="modal-imagem"
            />

            {/* Informações */}
            <h2 id="modal-title">{produtoSelecionado.nome}</h2>

            {/* Badge de categoria */}
            <div style={{
              display: 'inline-block',
              background: 'var(--bg-tertiary)',
              padding: 'var(--spacing-xs) var(--spacing-md)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 600,
              color: 'var(--primary-400)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              {formatarCategoria(produtoSelecionado.categoria)}
            </div>

            <p className="descricao">{produtoSelecionado.descricao}</p>

            <p className="preco">
              {formatarPreco(produtoSelecionado.preco)}
            </p>

            {/* Informação sobre adicionais */}
            {produtoSelecionado.adicionais && produtoSelecionado.adicionais.length > 0 && (
              <div style={{
                background: 'var(--bg-tertiary)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--spacing-xl)',
                border: '1px solid var(--border-default)'
              }}>
                <p style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--text-secondary)',
                  margin: 0
                }}>
                  ⚙️ Este item pode ser personalizado com adicionais
                </p>
              </div>
            )}

            {/* Botão adicionar */}
            <button
              className="add-btn"
              onClick={async () => {
                await handleAdicionarCarrinho(produtoSelecionado);
                if (!produtoSelecionado.adicionais || produtoSelecionado.adicionais.length === 0) {
                  setProdutoSelecionado(null);
                }
              }}
            >
              <span style={{ marginRight: 'var(--spacing-sm)' }}>🛒</span>
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      )}

      {/* ================================
          🎨 MODAL DE PERSONALIZAÇÃO
      ================================ */}
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