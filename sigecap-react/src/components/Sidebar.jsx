import React from 'react';
import '../App.css';
import logoImg from '../assets/images/DeMoaly-coat-of-arms.png';
import { useNavigate } from 'react-router-dom';     


const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    // Adicionei 'position-relative' para que o botão absoluto obedeça aos limites desta caixa
    <nav 
      className={`sidebar-container bg-custom-surface d-flex flex-column p-3 position-relative ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
      style={{ transition: 'width 0.3s ease' }}
    >
      
      <button 
        onClick={toggleSidebar} 
        // btn-custom: Amarelo | rounded-circle: Redondo | shadow-sm: Sombra leve
        className="btn btn-custom rounded-circle p-0 d-flex align-items-center justify-content-center border-0"
        style={{ 
          width: '24px',      
          height: '24px', 
          position: 'absolute', 
          right: '-12px',       
          top: '28px',         
          zIndex: 1050,         
          cursor: 'pointer'
        }}
      >
        {/* Ícone (Seta) */}
        {isCollapsed ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-dark">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        ) : (
    
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-dark">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        )}
      </button>


      {/* Cabeçalho da Sidebar */}
      <div className="d-flex align-items-center mb-5 overflow-hidden text-nowrap">
        {/* Logo */}
        <img 
          src={logoImg} 
          alt="Logo" 
          style={{ width: '40px', minWidth: '40px' }} 
        />
        
        {/* Texto (Só aparece se expandido) */}
        <div className={`ms-3 chapter-info transition-opacity ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
          <div className="fw-bold text-white" style={{ fontSize: '0.9rem' }}>Liberdade Harmoniosa</div>
          <div className="small text-custom-secondary" style={{ fontSize: '0.75rem' }}>Capítulo nº 387</div>
        </div>
      </div>


      {/* Menu Principal */}
      <ul className="nav nav-pills flex-column gap-2">
        <li className="nav-item" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <a href="#" className="nav-link nav-link-custom p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span className="ms-3 link-text">Dashboard</span>
          </a>
        </li>

       <li className="nav-item" onClick={() => navigate('/events')} style={{ cursor: 'pointer' }}>
         <a className="nav-link nav-link-custom p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span className="ms-3 link-text">Eventos</span>
          </a>
        </li>

        <li className="nav-item">
          <a href="#" className="nav-link nav-link-custom p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span className="ms-3 link-text">Membros</span>
          </a>
        </li>

        <li className="nav-item" onClick={() => navigate('/treasury')} style={{ cursor: 'pointer' }}>
          <a className="nav-link nav-link-custom p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            <span className="ms-3 link-text">Tesouraria</span>
          </a>
        </li>
      </ul>

      {/* Rodapé (Configurações e Sair) */}
      <div className="mt-auto pt-3 border-top border-secondary">
        <a href="#" className="nav-link nav-link-custom p-3 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          <span className="ms-3 link-text">Configurações</span>
        </a>

        <button 
          onClick={handleLogout} 
          className="nav-link nav-link-custom w-100 text-start border-0 bg-transparent p-3 text-danger"
          style={{ cursor: 'pointer' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
            <line x1="12" y1="2" x2="12" y2="12"></line>
          </svg>
          <span className="ms-3 link-text">Finalizar Sessão</span>
        </button>
      </div>

    </nav>
  );
};

export default Sidebar;