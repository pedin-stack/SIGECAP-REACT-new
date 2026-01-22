import { useState, useEffect } from 'react';
import FinancialMovementService from '../api/FinancialMovementService';
import CashService from '../api/CashService';

export const useTreasury = () => {
  const [modals, setModals] = useState({
    movement: false,
    dues: false,
    manualDues: false,
    balance: false,
    reports: false,
  });

  const [feedback, setFeedback] = useState({
    success: { isOpen: false, message: '' },
    error: { isOpen: false, message: '' }
  });


  const [movements, setMovements] = useState([]);
  const [cash, setCash] = useState(null);
  const [loading, setLoading] = useState(false);

  // Recuperar usuário atual
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch (e) {
      return null;
    }
  })();

  // -Helpers de Modal 
  const toggleModal = (modalName, value) => {
    setModals(prev => ({ ...prev, [modalName]: value }));
  };

  const closeFeedback = () => {
    setFeedback({
      success: { isOpen: false, message: '' },
      error: { isOpen: false, message: '' }
    });
  };

  // Carregar Dados 
  const fetchMovements = async () => {
    try {
      const res = await FinancialMovementService.getAll();
      const data = res.data;
      setMovements(data && data.content ? data.content : data || []);
    } catch (err) {
      console.error('Erro ao carregar movimentações', err);
    }
  };

  const fetchCash = async () => {
    try {
      const res = await CashService.getCurrent();
      setCash(res.data);
    } catch (err) {
      console.error('Erro ao carregar cash', err);
    }
  };

  useEffect(() => {
    if (modals.balance) {
      fetchMovements();
      fetchCash();
    }
  }, [modals.balance]);

  // --- LSalvar Movimentação ---
  const handleCreateMovement = async (movementData) => {
    setLoading(true);
    try {
      const { file, value, description, date, type } = movementData;

      if (file) {
        const formData = new FormData();
        formData.append('supportingFile', file);
        formData.append('value', String(parseFloat(value) || 0));
        formData.append('description', description || '');
        formData.append('date', date ? new Date(date).toISOString() : new Date().toISOString());
        formData.append('type', type === 'entrada' ? 'ENTRADA' : 'SAIDA');
        formData.append('responsibleId', String(currentUser?.id || 1));

        await FinancialMovementService.createWithFile(formData);
      } else {
        const payload = {
          value: parseFloat(value) || 0,
          description: description,
          date: date ? new Date(date).toISOString() : new Date().toISOString(),
          type: type === 'entrada' ? 'ENTRADA' : 'SAIDA',
          supportingDoc: '',
          responsibleId: currentUser?.id || 1,
        };
        await FinancialMovementService.create(payload);
      }

      // Sucesso
      toggleModal('movement', false);
      setFeedback(prev => ({ ...prev, success: { isOpen: true, message: 'Movimentação registrada com sucesso!' } }));

      if (modals.balance) {
        fetchMovements();
        fetchCash();
      }

    } catch (err) {
      console.error(err);
      setFeedback(prev => ({ ...prev, error: { isOpen: true, message: 'Erro ao registrar movimentação.' } }));
    } finally {
      setLoading(false);
    }
  };

  // --- Salvar Saldo Inicial ---
  const handleSaveInitialBalance = async (initialValue) => {
    try {
      const payload = { initialValue: Number(initialValue) || 0 };
      let res;
      
      if (cash && cash.id) {
        res = await CashService.update(cash.id, payload);
      } else {
        res = await CashService.save(payload);
      }

      if (res && res.data) {
        setCash(res.data);
        setFeedback(prev => ({ ...prev, success: { isOpen: true, message: 'Saldo inicial atualizado!' } }));
      }
    } catch (err) {
      console.error(err);
      setFeedback(prev => ({ ...prev, error: { isOpen: true, message: 'Erro ao salvar saldo inicial.' } }));
    }
  };

  return {
    modals,
    toggleModal,
    feedback,
    closeFeedback,
    movements,
    cash,
    loading,
    handleCreateMovement,
    handleSaveInitialBalance
  };
};