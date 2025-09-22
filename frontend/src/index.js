import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importe as páginas
import MenuPage from './pages/HomePage';
import Carrinho from './components/Carrinho';
import AdminPage from './pages/AdminPage'; // ✅ importa a página administrativa

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Página inicial */}
          <Route path="/" element={<MenuPage />} />

          {/* Carrinho */}
          <Route path="/carrinho" element={<Carrinho />} />

          {/* Página administrativa */}
          <Route path="/admin" element={<AdminPage />} /> {/* ✅ nova rota */}
        </Routes>
      </div>
    </Router>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
