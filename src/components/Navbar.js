// src/components/NavBar/NavBar.js

import React from "react";
import { Link } from "react-router-dom";
import { UserClass } from "../../UserClass";

function Navbar() {
  const user = UserClass.GetUser();

  const handleLogout = () => {
    UserClass.Logout();
    window.location.href = "/";
  };

  return (
    <nav style={{ backgroundColor: "#f5f5f5", padding: "10px" }}>
      <ul
        style={{
          display: "flex",
          listStyle: "none",
          justifyContent: "space-around",
          alignItems: "center",
          margin: 0,
          padding: 0,
        }}
      >
        <li><Link to="/">Início</Link></li>
        <li><Link to="/profile">Perfil</Link></li>
        <li><Link to="/register-pet">Cadastrar Pet</Link></li>
        <li><Link to="/search-pets">Buscar Pets</Link></li>
        <li><Link to="/success-stories">Adoções Concluídas</Link></li>

        {/* Se tiver usuário logado, mostra o nome e o botão de sair */}
        {user ? (
          <>
            <li style={{ fontWeight: "bold" }}>Olá, {user.name}</li>
            <li>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "#d9534f",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                Sair
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Entrar</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
