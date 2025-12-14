import React from 'react';
import '../App.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import logoImg from '../assets/images/DeMoaly-coat-of-arms.png';
import { useNavigate } from 'react-router-dom';
const Login = () => {

  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault(); 

    navigate('/dashboard'); 
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-custom-main">
      <div 
        className="card bg-custom-surface p-4 shadow-lg border-0" 
        style={{ width: '100%', maxWidth: '480px' }}
      >

        <div className="card-body">
          <div className="text-center mb-4">
            <img 
              src={logoImg}
              alt="Logo do Capítulo" 
              className="mb-3 w-25 img-fluid"
            />
            <h3 className="fw-bold mb-1 text-white">Sistema Integrado</h3>
            <p className="text-custom-secondary small">Capítulo Liberdade Harmoniosa nº 387</p>
          </div>

          <form onSubmit={handleLogin}>
            
            <div className="mb-3">
              <label htmlFor="userEmail" className="form-label text-custom-accent fw-bold small">
                Usuário ou E-mail
              </label>
              <input type="text" className="form-control form-control-custom py-2" id="userEmail" />
            </div>

            <div className="mb-4">
              <label htmlFor="userPassword" className="form-label text-custom-accent fw-bold small">
                Senha
              </label>
              <input type="password" className="form-control form-control-custom py-2" id="userPassword" />
            </div>

            <button type="submit" className="btn btn-custom w-100 py-2 mb-3 fw-bold">
              ENTRAR
            </button>

            <div className="text-center">
              <a href="#" className="text-custom-secondary text-decoration-none small">
                Esqueceu sua senha?
              </a>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;