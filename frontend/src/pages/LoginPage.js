import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api";
import "./LoginPage.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    loginAdmin(username, password)
      .then(response => {
        const token = response.data.token;
        localStorage.setItem("authToken", token);
        navigate("/admin");
      })
      .catch(error => {
        setError("Nome de utilizador ou senha incorretos!");
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Acesso Administrativo</h2>
        <p>Digite as suas credenciais para continuar.</p>
        <input
          type="text"
          placeholder="Nome de utilizador"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'A entrar...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;

