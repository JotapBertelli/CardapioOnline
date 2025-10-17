import React, { useState, useEffect } from 'react';
import { getPedidosPendentes, atualizarStatusPedido } from '../api';
import './PainelCozinha.css';

function PainelCozinha() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [atualizandoAuto, setAtualizandoAuto] = useState(true);

  const carregarPedidos = async () => {
    try {
      const response = await getPedidosPendentes();
      setPedidos(response.data);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPedidos();

    // ✅ Atualiza automaticamente a cada 10 segundos
    const interval = setInterval(() => {
      if (atualizandoAuto) {
        carregarPedidos();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [atualizandoAuto]);

  const handleAtualizarStatus = async (pedidoId, novoStatus) => {
    try {
      await atualizarStatusPedido(pedidoId, novoStatus);
      await carregarPedidos();

      // ✅ Notificação sonora (opcional)
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {}); // Ignora erro se não tiver áudio
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do pedido');
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'pendente': 'badge-pendente',
      'em_preparo': 'badge-preparo',
      'pronto': 'badge-pronto',
      'entregue': 'badge-entregue'
    };
    return classes[status] || '';
  };

  const formatarTempo = (dataPedido) => {
    const agora = new Date();
    const pedido = new Date(dataPedido);
    const diffMs = agora - pedido;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins === 1) return '1 minuto atrás';
    if (diffMins < 60) return `${diffMins} minutos atrás`;

    const diffHoras = Math.floor(diffMins / 60);
    if (diffHoras === 1) return '1 hora atrás';
    return `${diffHoras} horas atrás`;
  };

  if (loading) {
    return (
      <div className="painel-cozinha">
        <h1>Carregando pedidos...</h1>
      </div>
    );
  }

  return (
    <div className="painel-cozinha">
      <div className="painel-header">
        <h1>🍳 Painel da Cozinha</h1>
        <div className="header-info">
          <span className="total-pedidos">{pedidos.length} pedidos ativos</span>
          <button
            className={`auto-refresh-btn ${atualizandoAuto ? 'ativo' : ''}`}
            onClick={() => setAtualizandoAuto(!atualizandoAuto)}
          >
            {atualizandoAuto ? '🔄 Auto-atualização ON' : '⏸ Auto-atualização OFF'}
          </button>
          <button className="refresh-btn" onClick={carregarPedidos}>
            🔄 Atualizar
          </button>
        </div>
      </div>

      {pedidos.length === 0 ? (
        <div className="sem-pedidos">
          <h2>✅ Nenhum pedido pendente</h2>
          <p>Aguardando novos pedidos...</p>
        </div>
      ) : (
        <div className="pedidos-grid">
          {pedidos.map(pedido => (
            <div key={pedido.id} className={`pedido-card ${pedido.status}`}>
              <div className="pedido-header">
                <div>
                  <h2>Pedido #{pedido.id}</h2>
                  <span className="pedido-tempo">{formatarTempo(pedido.data_pedido)}</span>
                </div>
                <span className={`status-badge ${getStatusBadgeClass(pedido.status)}`}>
                  {pedido.status_display}
                </span>
              </div>

              <div className="cliente-info">
                <p><strong>Cliente:</strong> {pedido.nome_cliente}</p>
                <p><strong>Telefone:</strong> {pedido.telefone}</p>
                <p>
                  <strong>Tipo:</strong> {' '}
                  {pedido.tipo_entrega === 'delivery' ? '🛵 Delivery' : '🏪 Retirada'}
                </p>
                {pedido.tipo_entrega === 'delivery' && pedido.endereco && (
                  <p><strong>Endereço:</strong> {pedido.endereco}</p>
                )}
              </div>

              <div className="itens-pedido">
                <h3>Itens:</h3>
                {pedido.itens.map(item => (
                  <div key={item.id} className="item-pedido">
                    <span className="item-quantidade">{item.quantidade}x</span>
                    <span className="item-nome">{item.produto_nome}</span>
                    {item.observacoes && (
                      <span className="item-obs">({item.observacoes})</span>
                    )}
                  </div>
                ))}
              </div>

              {pedido.observacoes && (
                <div className="pedido-observacoes">
                  <strong>⚠️ Observações:</strong>
                  <p>{pedido.observacoes}</p>
                </div>
              )}

              <div className="pedido-total">
                <strong>Total: R$ {parseFloat(pedido.total).toFixed(2)}</strong>
              </div>

              <div className="pedido-acoes">
                {pedido.status === 'pendente' && (
                  <button
                    className="btn-iniciar"
                    onClick={() => handleAtualizarStatus(pedido.id, 'em_preparo')}
                  >
                    👨‍🍳 Iniciar Preparo
                  </button>
                )}

                {pedido.status === 'em_preparo' && (
                  <button
                    className="btn-pronto"
                    onClick={() => handleAtualizarStatus(pedido.id, 'pronto')}
                  >
                    ✅ Marcar como Pronto
                  </button>
                )}

                {pedido.status === 'pronto' && (
                  <button
                    className="btn-entregar"
                    onClick={() => handleAtualizarStatus(pedido.id, 'entregue')}
                  >
                    📦 Marcar como Entregue
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PainelCozinha;