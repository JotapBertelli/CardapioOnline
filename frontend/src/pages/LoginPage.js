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
      .catch(() => {
        setError("Nome de utilizador ou senha incorretos!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Área Administrativa</h2>
        <p>Digite suas credenciais para continuar</p>

        <div className="input-group">
          <i className="fa-solid fa-user"></i>
          <input
            type="text"
            placeholder="Nome de utilizador"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <i className="fa-solid fa-lock"></i>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
