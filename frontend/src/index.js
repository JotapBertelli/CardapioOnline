import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Páginas
import MenuPage from "./pages/HomePage";
import Carrinho from "./components/Carrinho";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import PainelCozinha from './pages/PainelCozinha';


// Rota protegida
function PrivateRoute({ children }) {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Página inicial */}
          <Route path="/" element={<MenuPage />} />

          {/* Carrinho */}
          <Route path="/carrinho" element={<Carrinho />} />

          {/* Login */}
          <Route path="/login" element={<LoginPage />} />
            <Route path="/cozinha" element={<PainelCozinha />} />


          {/* Admin (rota protegida) */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
