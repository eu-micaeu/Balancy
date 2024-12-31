import React, { useEffect, useState } from "react";
import './Main.css';

function Main() {
  const [menuItems, setMenuItems] = useState([]); // Estado para armazenar os itens do menu
  const [error, setError] = useState(null); // Estado para capturar erros

  const getCookie = (name) => {
    // Função para obter o valor de um cookie pelo nome
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((c) => c.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
  };

  useEffect(() => {
    // Função para buscar os dados da rota GET /menu
    const fetchMenu = async () => {
      try {
        const token = getCookie("authToken"); // Substitua "authToken" pelo nome correto do cookie
        if (!token) {
          throw new Error("Token de autenticação não encontrado");
        }

        const response = await fetch("http://localhost:8080/menu", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho Authorization
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar o menu");
        }

        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMenu();
  }, []); // Executa apenas uma vez ao montar o componente

  return (
    <main>
      <h1>Menu</h1>
      {error ? (
        <p className="error">{error}</p> // Mostra mensagem de erro, se houver
      ) : (
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>{item.name}</li> // Renderiza os itens do menu
          ))}
        </ul>
      )}
    </main>
  );
}

export default Main;
