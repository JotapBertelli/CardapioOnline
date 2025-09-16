import React, { useEffect, useState } from 'react';
import { getCarrinho, removerCarrinho } from '../api';

function Carrinho() {
  const [itens, setItens] = useState([]);

  const carregarCarrinho = () => getCarrinho().then(res => setItens(res.data));
  useEffect(() => { carregarCarrinho(); }, []);

  const handleRemover = (id) => {
    removerCarrinho(id).then(() => carregarCarrinho());
  }

  return (
    <div>
      <h2>Carrinho</h2>
      <ul>
        {itens.map(i => (
          <li key={i.id}>
            {i.produto.nome} x {i.quantidade}
            <button onClick={() => handleRemover(i.produto.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Carrinho;
