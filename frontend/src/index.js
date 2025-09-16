import React from 'react';
import MenuPage from './pages/HomePage'; // CORRIGIDO: Estamos importando a página do menu

function App() {
  return (
    <div className="App">
      <MenuPage /> {/* CORRIGIDO: Estamos exibindo a página do menu */}
    </div>
  );
}

export default App;