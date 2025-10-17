import React, { useState } from 'react';
import './ModalPersonalizacao.css';

function ModalPersonalizacao({ produto, onClose, onAdicionar }) {
  const [adicionalSelecionado, setAdicionalSelecionado] = useState(null);
  const [observacoes, setObservacoes] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  const calcularPrecoTotal = () => {
    let preco = parseFloat(produto.preco);

    if (adicionalSelecionado) {
      const adicional = produto.adicionais.find(a => a.id === adicionalSelecionado);
      if (adicional) {
        preco += parseFloat(adicional.preco_adicional);
      }
    }

    return preco * quantidade;
  };

  const handleAdicionar = () => {
    onAdicionar({
      produto_id: produto.id,
      quantidade,
      adicional_escolhido_id: adicionalSelecionado,
      observacoes: observacoes.trim() || null,
      final_price: calcularPrecoTotal()
    });
    onClose();
  };

  const temAdicionais = produto.adicionais && produto.adicionais.length > 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-personalizacao" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-header">
          <img
            src={produto.imagem_url || '/placeholder-food.jpg'}
            alt={produto.nome}
            className="modal-produto-imagem"
          />
          <div className="modal-produto-info">
            <h2>{produto.nome}</h2>
            <p className="modal-produto-descricao">{produto.descricao}</p>
            <p className="modal-produto-preco">R$ {parseFloat(produto.preco).toFixed(2)}</p>
          </div>
        </div>

        <div className="modal-body">
          {/* Adicionais */}
          {temAdicionais && (
            <div className="personalizacao-secao">
              <h3>Escolha uma opção:</h3>
              <div className="adicionais-lista">
                {produto.adicionais.map(adicional => (
                  <label key={adicional.id} className="adicional-opcao">
                    <input
                      type="radio"
                      name="adicional"
                      value={adicional.id}
                      checked={adicionalSelecionado === adicional.id}
                      onChange={() => setAdicionalSelecionado(adicional.id)}
                    />
                    <span className="adicional-nome">{adicional.nome}</span>
                    {adicional.preco_adicional > 0 && (
                      <span className="adicional-preco">
                        +R$ {parseFloat(adicional.preco_adicional).toFixed(2)}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Observações */}
          <div className="personalizacao-secao">
            <h3>Observações (opcional):</h3>
            <textarea
              className="observacoes-textarea"
              placeholder="Ex: Sem açúcar, bem gelado..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows="3"
            />
          </div>

          {/* Quantidade */}
          <div className="personalizacao-secao">
            <h3>Quantidade:</h3>
            <div className="quantidade-controle">
              <button
                onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                className="quantidade-btn"
              >
                -
              </button>
              <span className="quantidade-valor">{quantidade}</span>
              <button
                onClick={() => setQuantidade(quantidade + 1)}
                className="quantidade-btn"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="preco-total">
            <span>Total:</span>
            <span className="preco-valor">R$ {calcularPrecoTotal().toFixed(2)}</span>
          </div>
          <button
            className="btn-adicionar-carrinho"
            onClick={handleAdicionar}
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalPersonalizacao;