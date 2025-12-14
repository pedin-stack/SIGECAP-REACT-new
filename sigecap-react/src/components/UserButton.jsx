import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Para garantir acesso às classes btn-custom

const UserButton = ({ isActive = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/users');
  };

  // Define as classes baseadas se a página está ativa ou não
  const buttonClass = isActive 
    ? "btn btn-custom fw-bold rounded-pill px-4" // Estilo Ativo (Dourado)
    : "btn btn-dark border-custom-accent rounded-pill px-4"; // Estilo Padrão (Escuro)

  return (
    <button 
      className={buttonClass}
      onClick={handleClick}
    >
      User
    </button>
  );
};

export default UserButton;