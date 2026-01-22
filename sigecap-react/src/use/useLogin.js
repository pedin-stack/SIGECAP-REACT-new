import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../api/AuthService'; 

export const useLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [errorModal, setErrorModal] = useState({ 
    isOpen: false, 
    message: '' 
  });

  const [successModal, setSuccessModal] = useState({ 
    isOpen: false, 
    message: '' 
  });

  // Fecha o modal de erro
  const closeErrorModal = () => {
    setErrorModal({ ...errorModal, isOpen: false });
  };

  const closeSuccessModal = () => {
    setSuccessModal({ ...successModal, isOpen: false });
    navigate('/dashboard'); 
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = await AuthService.login(email, password);

      const token = data?.token || data?.accessToken || data?.authToken;
      const user = data?.user || data?.userResponse || data?.userResponseDTO || data;
  
      AuthService.setSession(token, user);

      setSuccessModal({
        isOpen: true,
        message: 'Login realizado com sucesso! Seja bem-vindo.'
      });

    } catch (err) {
      console.error('Erro no login', err);
      setErrorModal({
        isOpen: true,
        message: 'Erro ao efetuar login. Verifique suas credenciais e tente novamente.'
      });

    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    loading,
    errorModal,      
    closeErrorModal,
    successModal,
    closeSuccessModal
  };
};