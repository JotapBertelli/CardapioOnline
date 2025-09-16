import React from 'react';
import { menuItems } from '../data/dadosDoMenu'; // Importa nossos dados
import './MenuPage.css'; // Importa o estilo

function MenuPage() {
  return (
    <div className="menu-container">
      <header className="menu-header">
        <h1>Nosso Cardápio</h1>
        <p>Sabores da fazenda, com um toque de mestre.</p>
      </header>

      <div className="menu-grid">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item-card">
            <img src={item.imagem} alt={item.nome} className="menu-item-image" />
            <div className="menu-item-details">
              <h3 className="menu-item-name">{item.nome}</h3>
              <p className="menu-item-description">{item.descricao}</p>
              <p className="menu-item-price">{item.preco}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuPage;