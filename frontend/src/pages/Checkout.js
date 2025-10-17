import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api';
import './Checkout.css';

function Checkout({ itensCarrinho, subtotal, onVoltar }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome_cliente: '',
    telefone: '',
    endereco: '',
    tipo_entrega: 'retirada',
    observacoes: ''
  });

  const taxaEntrega = formData.tipo_entrega === 'delivery' ? 5.00 : 0;
  const total = subtotal + taxaEntrega;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepara os itens do pedido
      const itens = itensCarrinho.map(item => ({
        produto_id: item.produto.id,
        quantidade: item.quantidade,
        observacoes: item.addons || ''
      }));

      // Envia o pedido
      const pedidoData = {
        ...formData,
        itens
      };

      const response = await createOrder(pedidoData);

      alert(`✅ Pedido #${response.data.id} realizado com sucesso!\n\nAguarde, em breve seu pedido estará pronto.`);
      navigate('/'); // Volta para home
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      alert('❌ Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <button onClick={onVoltar} className="voltar-btn">← Voltar ao Carrinho</button>

        <h1>Finalizar Pedido</h1>

        <form onSubmit={handleSubmit} className="checkout-form">
          {/* Dados do Cliente */}
          <div className="form-section">
            <h2>Seus Dados</h2>

            <div className="form-group">
              <label htmlFor="nome_cliente">Nome Completo *</label>
              <input
                type="text"
                id="nome_cliente"
                name="nome_cliente"
                value={formData.nome_cliente}
                onChange={handleChange}
                required
                placeholder="Digite seu nome"
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefone">Telefone/WhatsApp *</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                required
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          {/* Tipo de Entrega */}
          <div className="form-section">
            <h2>Tipo de Entrega</h2>

            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="tipo_entrega"
                  value="retirada"
                  checked={formData.tipo_entrega === 'retirada'}
                  onChange={handleChange}
                />
                <span>🏪 Retirar no Local (Grátis)</span>
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  name="tipo_entrega"
                  value="delivery"
                  checked={formData.tipo_entrega === 'delivery'}
                  onChange={handleChange}
                />
                <span>🛵 Delivery (+R$ 5,00)</span>
              </label>
            </div>
          </div>

          {/* Endereço (só aparece se for delivery) */}
          {formData.tipo_entrega === 'delivery' && (
            <div className="form-section">
              <h2>Endereço de Entrega</h2>

              <div className="form-group">
                <label htmlFor="endereco">Endereço Completo *</label>
                <textarea
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Rua, número, complemento, bairro"
                />
              </div>
            </div>
          )}

          {/* Observações */}
          <div className="form-section">
            <h2>Observações</h2>

            <div className="form-group">
              <label htmlFor="observacoes">Alguma observação sobre o pedido?</label>
              <textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                rows="3"
                placeholder="Ex: Sem cebola, ponto da carne, etc."
              />
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="resumo-checkout">
            <h2>Resumo do Pedido</h2>
            <div className="resumo-linha">
              <span>Subtotal ({itensCarrinho.length} {itensCarrinho.length === 1 ? 'item' : 'itens'})</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="resumo-linha">
              <span>Taxa de Entrega</span>
              <span>R$ {taxaEntrega.toFixed(2)}</span>
            </div>
            <div className="resumo-total">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Botão de Finalizar */}
          <button
            type="submit"
            className="finalizar-pedido-btn"
            disabled={loading}
          >
            {loading ? 'Enviando...' : '✅ Confirmar Pedido'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;