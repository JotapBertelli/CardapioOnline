import React, { useEffect, useState } from 'react';
import { getCartItems, removeCartItem, updateCartItem } from '../api';
import Checkout from '../pages/Checkout'; // ✅ NOVO
import './Carrinho.css';

const LixeiraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

function Carrinho() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarCheckout, setMostrarCheckout] = useState(false); // ✅ NOVO

  const carregarCarrinho = () => {
    setLoading(true);
    getCartItems()
      .then(response => setItens(response.data))
      .catch(error => console.error("Erro ao buscar o carrinho:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregarCarrinho();
  }, []);

  const handleAtualizarQuantidade = (itemId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      handleRemover(itemId);
      return;
    }
    updateCartItem(itemId, novaQuantidade)
      .then(() => carregarCarrinho())
      .catch(error => console.error("Erro ao atualizar item:", error));
  };

  const handleRemover = (itemId) => {
    removeCartItem(itemId)
      .then(() => carregarCarrinho())
      .catch(error => console.error("Erro ao remover item:", error));
  };

  const calcularSubtotal = () => {
    if (!itens || itens.length === 0) return 0;
    return itens.reduce((total, item) => {
      // Usa final_price se existir, senão calcula manualmente
      const precoItem = item.final_price
        ? parseFloat(item.final_price)
        : parseFloat(item.produto.preco);
      return total + (precoItem * item.quantidade);
    }, 0);
  };

  // ✅ NOVO: Se está no checkout, mostra componente de checkout
  if (mostrarCheckout) {
    return (
      <Checkout
        itensCarrinho={itens}
        subtotal={calcularSubtotal()}
        onVoltar={() => setMostrarCheckout(false)}
      />
    );
  }

  if (loading) return <div className="carrinho-container"><h2>A carregar pedido...</h2></div>;
  if (itens.length === 0) return <div className="carrinho-container carrinho-vazio"><h2>O seu cesto está vazio</h2><p>Adicione produtos para continuar.</p></div>;

  return (
    <div className="carrinho-container modo-totem">
      <div className="lista-produtos">
        <h1>Revise o seu Pedido</h1>
        {itens.map(item => {
          const produto = item.produto || {};
          const imagem = produto.imagem_url || '/placeholder-food.jpg';
          const nome = produto.nome || 'Produto Desconhecido';
          const precoBase = parseFloat(produto.preco || 0);
          const precoFinal = item.final_price ? parseFloat(item.final_price) : precoBase;
          const adicional = item.adicional_info;

          return (
            <div key={item.id} className="carrinho-item">
              <img src={imagem} alt={nome} className="item-imagem" />
              <div className="item-detalhes">
                <h3>{nome}</h3>
                <p className="item-preco">R$ {precoBase.toFixed(2)}</p>
                {/* ✅ NOVO: Mostra o adicional escolhido */}
                {adicional && (
                  <p className="item-adicional">
                    + {adicional.nome}
                    {parseFloat(adicional.preco) > 0 && ` (+R$ ${parseFloat(adicional.preco).toFixed(2)})`}
                  </p>
                )}
                {/* ✅ NOVO: Mostra observações */}
                {item.observacoes && (
                  <p className="item-observacoes">
                    Obs: {item.observacoes}
                  </p>
                )}
              </div>
              <div className="item-acoes">
                <div className="quantidade-controle">
                  <button onClick={() => handleAtualizarQuantidade(item.id, item.quantidade - 1)}>-</button>
                  <span>{item.quantidade}</span>
                  <button onClick={() => handleAtualizarQuantidade(item.id, item.quantidade + 1)}>+</button>
                </div>
                <strong className="item-subtotal">R$ {(precoFinal * item.quantidade).toFixed(2)}</strong>
                <button onClick={() => handleRemover(item.id)} className="remover-btn">
                  <LixeiraIcon />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="resumo-pedido">
        <h2>Resumo</h2>
        <div className="resumo-linha">
          <span>Subtotal</span>
          <span>R$ {calcularSubtotal().toFixed(2)}</span>
        </div>
        <div className="resumo-linha">
          <span>Taxa de Serviço</span>
          <span>R$ 0.00</span>
        </div>
        <div className="resumo-total">
          <h3>Total a Pagar</h3>
          <h3>R$ {calcularSubtotal().toFixed(2)}</h3>
        </div>
        {/* ✅ ALTERADO: Agora chama setMostrarCheckout */}
        <button
          className="finalizar-btn"
          onClick={() => setMostrarCheckout(true)}
        >
          Enviar pedido
        </button>
      </div>
    </div>
  );
}

export default Carrinho;