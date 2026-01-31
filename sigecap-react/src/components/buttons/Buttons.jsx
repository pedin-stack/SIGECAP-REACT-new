import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 

//BOTÃO DE CRIAR
export const CreateButton = ({ onClick, label = "Criar", ...props }) => {
  return (
    <button 
      type="button" 
      className="btn btn-success" 
      onClick={onClick} 
      {...props}
    >
      {label}
    </button>
  );
};

//BOTÃO DE EDITAR
export const EditButton = ({ onClick, label = "Editar", ...props }) => {
  return (
    <button 
      type="button" 
      className="btn btn-warning" 
      onClick={onClick} 
      {...props}
    >
      {label}
    </button>
  );
};

// BOTÃO DE EXCLUIR
export const ExcludeButton = ({ onClick, label = "Excluir", ...props }) => {
  return (
    <button 
      type="button" 
      className="btn btn-danger" 
      onClick={onClick} 
      {...props}
    >
      {label}
    </button>
  );
};

//BOTÃO DE CANCELAR
export const CancelButton = ({ onClick, label = "Cancelar", ...props }) => {
  return (
    <button 
      type="button" 
      className="btn btn-secondary" 
      onClick={onClick} 
      {...props}
    >
      {label}
    </button>
  );
};

//BOTÃO DE AÇÃO PERSONALIZADA
export const ActionButton = ({ onClick, label = "Ação", ...props }) => {
  
  const customStyle = {
    backgroundColor: '#dcb046', 
    borderColor: '#dcb046',
    color: '#000', 
    fontWeight: '600' 
  };

  return (
    <button 
      type="button" 
      className="btn" 
      style={customStyle}
      onClick={onClick} 
      {...props}
    >
      {label}
    </button>
  );
};