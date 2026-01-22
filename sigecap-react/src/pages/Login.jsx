// 1. ADICIONE O 'useState' AQUI NA IMPORTAÇÃO
import React, { useState } from 'react'; 
import '../App.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import logoImg from '../assets/images/DeMoaly-coat-of-arms.png';

import { useLogin } from '../use/useLogin'; 
import ExceptionModal from '../components/modals/errorModal'; 
import SuccessModal from '../components/modals/successModal'; 

const Login = () => {
  // Dados que vêm do Hook de Lógica
  const { 
    email, setEmail, password, setPassword, handleLogin, loading,
    errorModal, closeErrorModal, successModal, closeSuccessModal
  } = useLogin();

  // 2. ESTADO LOCAL APENAS PARA O 'OLHO' (VISUAL)
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-custom-main">
      <div className="card bg-custom-surface p-4 shadow-lg border-0" style={{ width: '100%', maxWidth: '480px' }}>
        <div className="card-body">
          
          <div className="text-center mb-4">
            <img src={logoImg} alt="Logo" className="mb-3 w-25 img-fluid"/>
            <h3 className="fw-bold mb-1 text-white">Sistema Integrado</h3>
            <p className="text-custom-secondary small">Capítulo Liberdade Harmoniosa nº 387</p>
          </div>

          <form onSubmit={handleLogin}>
            
            <div className="mb-3">
              <label htmlFor="userEmail" className="form-label text-custom-accent fw-bold small">Usuário ou E-mail</label>
              <input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                type="text" 
                className="form-control form-control-custom py-2" 
                id="userEmail" 
                placeholder="Digite seu e-mail"
              />
            </div>

            {/* --- MUDANÇA AQUI NO CAMPO DE SENHA --- */}
            <div className="mb-4">
              <label htmlFor="userPassword" className="form-label text-custom-accent fw-bold small">
                Senha
              </label>
              
              {/* Container com position relative para segurar o botão absoluto */}
              <div className="position-relative">
                <input 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  type={showPassword ? "text" : "password"} 
                  className="form-control form-control-custom py-2" 
                  id="userPassword" 
                  placeholder="Digite sua senha"
                  style={{ 
                    paddingRight: '45px' // Espaço extra na direita para o texto não ficar baixo do ícone
                  }} 
                />
                
                {/* Botão flutuante (Absolute) */}
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ 
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)', // Centraliza verticalmente exato
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6c757d' // Cor do ícone
                  }}
                >
                  {showPassword ? (
                    // Ícone OLHO ABERTO
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    // Ícone OLHO FECHADO
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {/* --- FIM DA MUDANÇA --- */}

            <button type="submit" className="btn btn-custom w-100 py-2 mb-3 fw-bold" disabled={loading}>
              {loading ? 'ENTRANDO...' : 'ENTRAR'}
            </button>

            <div className="text-center">
              <a href="#" className="text-custom-secondary text-decoration-none small">Esqueceu sua senha?</a>
            </div>

          </form>
        </div>
      </div>

      <ExceptionModal isOpen={errorModal.isOpen} onClose={closeErrorModal} message={errorModal.message} />
      <SuccessModal isOpen={successModal.isOpen} onClose={closeSuccessModal} message={successModal.message} />
    </div>
  );
};

export default Login;