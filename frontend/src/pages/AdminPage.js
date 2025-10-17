import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getMenuItems, createMenuItem, removeMenuItem, updateMenuItem, getBancoDeImagens } from '../api';
import './AdminPage.css';

// Ícones SVG
const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const IconDelete = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

function AdminPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [bancoDeImagens, setBancoDeImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    nome: '', descricao: '', preco: '', categoria: '', disponivel: true, imagem_selecionada: '',
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    } else {
      carregarDadosIniciais();
    }
  }, [navigate]);

  const carregarDadosIniciais = async () => {
    setLoading(true);
    try {
      const [menuResponse, imagensResponse] = await Promise.all([
        getMenuItems(),
        getBancoDeImagens(),
      ]);
      setMenuItems(menuResponse.data);
      setBancoDeImagens(imagensResponse.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      if (error.response && error.response.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const carregarItensDoMenu = async () => {
    const response = await getMenuItems();
    setMenuItems(response.data);
  };

  const handleInputChange = (e, setState) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e, setState) => {
    const { name, checked } = e.target;
    setState(prev => ({ ...prev, [name]: checked }));
  };

// ✅ CORREÇÃO 1: Ajustar handleSubmit para enviar null corretamente
const handleSubmit = async (e) => {
  e.preventDefault();
  const dataParaEnviar = {
    ...newItem,
    preco: parseFloat(newItem.preco),
    // ✅ Converte string vazia para null, ou mantém o número
    imagem_selecionada: newItem.imagem_selecionada ? parseInt(newItem.imagem_selecionada) : null,
  };
  try {
    await createMenuItem(dataParaEnviar);
    setNewItem({ nome: '', descricao: '', preco: '', categoria: '', disponivel: true, imagem_selecionada: '' });
    await carregarItensDoMenu();
    alert("Produto adicionado com sucesso!");
  } catch (error) {
    console.error(error.response?.data);
    alert("Falha ao adicionar o produto.");
  }
};

  // ✅ CORREÇÃO 2: Ajustar handleUpdateSubmit
const handleUpdateSubmit = async (e) => {
  e.preventDefault();
  const dataParaEnviar = {
    nome: editingItem.nome,
    descricao: editingItem.descricao,
    preco: parseFloat(editingItem.preco),
    categoria: editingItem.categoria,
    disponivel: editingItem.disponivel,
    // ✅ Converte string vazia para null, ou mantém o número
    imagem_selecionada: editingItem.imagem_selecionada ? parseInt(editingItem.imagem_selecionada) : null,
  };
  try {
    await updateMenuItem(editingItem.id, dataParaEnviar);
    setEditingItem(null);
    await carregarItensDoMenu();
    alert("Produto atualizado com sucesso!");
  } catch (error) {
    console.error(error.response?.data);
    alert("Falha ao atualizar o produto.");
  }
};

  const handleRemove = async (itemId) => {
    if (!window.confirm('Tem certeza que quer apagar este item?')) return;
    try {
      await removeMenuItem(itemId);
      await carregarItensDoMenu();
      alert("Item apagado com sucesso!");
    } catch {
      alert("Falha ao apagar o item.");
    }
  };

const openEditModal = (item) => {
  setEditingItem({
    ...item,
    // ✅ Se tiver imagem_selecionada, pega o ID dela (pode vir como objeto)
    imagem_selecionada: item.imagem_selecionada?.id || item.imagem_selecionada || ''
  });
};

  return (
    <div className="admin-container">
      {/* Modal de edição */}
      {editingItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleUpdateSubmit}>
              <h2>Editar Prato</h2>
              <input name="nome" value={editingItem.nome} onChange={(e) => handleInputChange(e, setEditingItem)} placeholder="Nome do Prato" required />
              <textarea name="descricao" value={editingItem.descricao} onChange={(e) => handleInputChange(e, setEditingItem)} placeholder="Descrição" required />
              <input name="preco" type="number" step="0.01" value={editingItem.preco} onChange={(e) => handleInputChange(e, setEditingItem)} placeholder="Preço" required />
              <select name="categoria" value={editingItem.categoria} onChange={(e) => handleInputChange(e, setEditingItem)} required>
                <option value="">Selecione a categoria</option>
                <option value="entradas">Entradas</option>
                <option value="porcoes">Porções</option>
                <option value="pratos_quentes">Pratos Quentes</option>
                <option value="bebidas">Bebidas</option>
                <option value="bebidas_alcoolicas">Bebidas Alcoólicas</option>
                <option value="drinks">Drinks</option>
                <option value="sobremesas">Sobremesas</option>
              </select>
              <label className="checkbox-label">
                Disponível
                <input type="checkbox" name="disponivel" checked={editingItem.disponivel} onChange={(e) => handleCheckboxChange(e, setEditingItem)} />
              </label>

              <label htmlFor="edit-imagem_selecionada">Imagem do Prato</label>
              <select name="imagem_selecionada" id="edit-imagem_selecionada" value={editingItem.imagem_selecionada} onChange={(e) => handleInputChange(e, setEditingItem)}>
                <option value="">-- Sem Imagem --</option>
                {bancoDeImagens.map(img => (
                  <option key={img.id} value={img.id}>{img.titulo}</option>
                ))}
              </select>

              <div className="modal-actions">
                <button type="button" onClick={() => setEditingItem(null)}>Cancelar</button>
                <button type="submit">Guardar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulário de adicionar */}
      <div className="admin-form-section">
        <div className="admin-header">
          <h1>Gestão de Cardápio</h1>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </div>
        <form onSubmit={handleSubmit} className="admin-form">
          <h2>Adicionar Novo Prato</h2>
          <input name="nome" value={newItem.nome} onChange={(e) => handleInputChange(e, setNewItem)} placeholder="Nome do Prato" required />
          <textarea name="descricao" value={newItem.descricao} onChange={(e) => handleInputChange(e, setNewItem)} placeholder="Descrição" required />
          <input name="preco" type="number" step="0.01" value={newItem.preco} onChange={(e) => handleInputChange(e, setNewItem)} placeholder="Preço (ex: 25.50)" required />
          <select name="categoria" value={newItem.categoria} onChange={(e) => handleInputChange(e, setNewItem)} required>
            <option value="">Selecione a categoria</option>
            <option value="entradas">Entradas</option>
            <option value="porcoes">Porções</option>
            <option value="pratos_quentes">Pratos Quentes</option>
            <option value="bebidas">Bebidas</option>
            <option value="bebidas_alcoolicas">Bebidas Alcoólicas</option>
            <option value="drinks">Drinks</option>
            <option value="sobremesas">Sobremesas</option>
          </select>
          <label className="checkbox-label">
            Disponível
            <input type="checkbox" name="disponivel" checked={newItem.disponivel} onChange={(e) => handleCheckboxChange(e, setNewItem)} />
          </label>

          <label htmlFor="imagem_selecionada">Imagem do Prato</label>
          <select name="imagem_selecionada" id="imagem_selecionada" value={newItem.imagem_selecionada} onChange={(e) => handleInputChange(e, setNewItem)}>
            <option value="">-- Selecione uma Imagem --</option>
            {bancoDeImagens.map(img => (
              <option key={img.id} value={img.id}>{img.titulo}</option>
            ))}
          </select>

          <button type="submit">Adicionar ao Cardápio</button>
        </form>
      </div>

      {/* Lista de itens */}
      <div className="admin-list-section">
        <h2>Cardápio Atual</h2>
        {loading ? <p>A carregar...</p> : (
          <div className="admin-item-list">
            {menuItems.map(item => (
              <div key={item.id} className="admin-item-card">
                <img
                 src={item.imagem_url || '/placeholder-food.jpg'}

                  alt={item.nome}
                />
                <div className="admin-item-details">
                  <h3>{item.nome}</h3>
                  <p>R$ {parseFloat(item.preco).toFixed(2)}</p>
                  <span>{item.categoria}</span>
                </div>
                <div className="admin-item-actions">
                  <button className="icon-btn edit-btn" onClick={() => openEditModal(item)}><IconEdit /></button>
                  <button className="icon-btn delete-btn" onClick={() => handleRemove(item.id)}><IconDelete /></button>
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
