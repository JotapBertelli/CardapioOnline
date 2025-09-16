import React, { useEffect, useState } from 'react';
import { getProdutos, adicionarCarrinho } from '../api';

function ProdutoList() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    getProdutos().then(res => setProdutos(res.data));
  }, []);

  const handleAdicionar = (id) => {
    adicionarCarrinho(id).then(() => alert("Produto adicionado!"));
  }

  return (
    <div>
      <h2>Produtos</h2>
      <ul>
        {produtos.map(p => (
          <li key={p.id}>
            {p.nome} - R$ {p.preco.toFixed(2)}
            <button onClick={() => handleAdicionar(p.id)}>Adicionar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProdutoList;
