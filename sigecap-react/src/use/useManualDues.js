import { useState, useCallback } from 'react';
import UserService from '../api/UserService';
import MonthlyDuesService from '../api/MonthlyDuesService';

export default function useManualDues() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusModal, setStatusModal] = useState({ isOpen: false, type: 'success', message: '' });

  const loadMembers = useCallback(async () => {
    setLoading(true);
    try {
      // Tenta endpoint específico de status, se disponível
      let data = null;
      try {
        data = await UserService.findByStatus(true);
      } catch (err) {
        // Fallback para buscar todos e filtrar
        const fallback = await UserService.findAll(0, 500);
        data = fallback;
      }

      const raw = Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []);
      const list = raw.map((u) => ({ id: u.id ?? u.personId ?? null, name: u.name || (u.person && u.person.name) || u.username || '' }));
      setMembers(list.filter(m => m && m.id));
    } catch (err) {
      console.error('Erro ao carregar membros ativos', err);
      setStatusModal({ isOpen: true, type: 'error', message: 'Erro ao carregar membros.' });
    } finally {
      setLoading(false);
    }
  }, []);

  const manualPay = useCallback(async (payload) => {
    try {
      if (!payload || !payload.memberId) throw new Error('Membro não informado');
      setSubmitting(true);
      // Chama endpoint de pagamento manual no backend
      await MonthlyDuesService.manualPayment(payload.memberId, payload);
      setStatusModal({ isOpen: true, type: 'success', message: 'Pagamento registrado com sucesso.' });
      return true;
    } catch (err) {
      console.error('Erro ao registrar pagamento manual', err);
      const msg = err?.response?.data?.message || err.message || 'Erro ao registrar pagamento.';
      setStatusModal({ isOpen: true, type: 'error', message: String(msg) });
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return {
    members,
    loading,
    submitting,
    statusModal,
    setStatusModal,
    loadMembers,
    manualPay
  };
}
