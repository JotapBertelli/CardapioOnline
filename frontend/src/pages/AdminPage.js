import React, { useState, useEffect } from 'react';
// ✅ Importamos as funções da API
import { getMenuItems, createMenuItem, removeMenuItem } from '../api';
import './AdminPage.css';

function AdminPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para o formulário de novo item
  const [newItem, setNewItem] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    imagem: null,
  });

  // Carrega os itens do menu quando a página é aberta
  useEffect(() => {
    carregarItens();
  }, []);

  const carregarItens = () => {
    setLoading(true);
    getMenuItems()
      .then(response => {
        setMenuItems(response.data);
      })
      .catch(error => console.error("Erro ao carregar o cardápio:", error))
      .finally(() => setLoading(false));
  };

  // Lida com a alteração dos campos do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  // Lida com a seleção da imagem
  const handleFileChange = (e) => {
    setNewItem(prev => ({ ...prev, imagem: e.target.files[0] }));
  };

  // Lida com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();

    // Cria um FormData para enviar a imagem
    const formData = new FormData();
    formData.append('nome', newItem.nome);
    formData.append('descricao', newItem.descricao);
    formData.append('preco', newItem.preco);
    formData.append('categoria', newItem.categoria);
    if (newItem.imagem) {
      formData.append('imagem', newItem.imagem);
    }

    createMenuItem(formData)
      .then(() => {
        alert('Produto adicionado com sucesso!');
        // Limpa o formulário e recarrega a lista
        setNewItem({ nome: '', descricao: '', preco: '', categoria: '', imagem: null });
        e.target.reset(); // Limpa o campo de ficheiro
        carregarItens();
      })
      .catch(error => {
        console.error("Erro ao adicionar produto:", error);
        alert('Falha ao adicionar o produto.');
      });
  };

  // Lida com a remoção de um item
  const handleRemove = (itemId) => {
    if (window.confirm('Tem a certeza de que quer apagar este item?')) {
      removeMenuItem(itemId)
        .then(() => {
          alert('Item apagado com sucesso!');
          carregarItens();
        })
        .catch(error => {
          console.error("Erro ao apagar item:", error);
          alert('Falha ao apagar o item.');
        });
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-form-section">
        <h1>Gestão de Cardápio</h1>
        <form onSubmit={handleSubmit} className="admin-form">
          <h2>Adicionar Novo Prato</h2>
          <input name="nome" value={newItem.nome} onChange={handleInputChange} placeholder="Nome do Prato" required />
          <textarea name="descricao" value={newItem.descricao} onChange={handleInputChange} placeholder="Descrição" required />
          <input name="preco" type="number" step="0.01" value={newItem.preco} onChange={handleInputChange} placeholder="Preço (ex: 25.50)" required />
          <input name="categoria" value={newItem.categoria} onChange={handleInputChange} placeholder="Categoria (ex: Principal, Sobremesa)" required />
          <label htmlFor="imagem">Imagem do Prato</label>
          <input name="imagem" id="imagem" type="file" onChange={handleFileChange} />
          <button type="submit">Adicionar ao Cardápio</button>
        </form>
      </div>

      <div className="admin-list-section">
        <h2>Cardápio Atual</h2>
        {loading ? <p>A carregar...</p> : (
          <div className="admin-item-list">
            {menuItems.map(item => (
              <div key={item.id} className="admin-item-card">
                <img src={item.imagem || '/placeholder-food.jpg'} alt={item.nome} />
                <div className="admin-item-details">
                  <h3>{item.nome}</h3>
                  <p>R$ {parseFloat(item.preco).toFixed(2)}</p>
                  <span>Categoria: {item.categoria}</span>
                </div>
                <div className="admin-item-actions">
                  <button className="delete-btn" onClick={() => handleRemove(item.id)}>Apagar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
