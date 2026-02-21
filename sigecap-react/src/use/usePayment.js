import { useState, useCallback } from 'react';
import AuthService from '../api/AuthService';
import PaymentService from '../api/PaymentService';
import MonthlyDuesService from '../api/MonthlyDuesService';

export default function usePayment() {
  const [isOpen, setIsOpen] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setPixData(null);
    setError('');
    setCopyStatus('');
  }, []);

  const openForCurrentUser = useCallback(async () => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser?.id) {
      setError('Não foi possível identificar o usuário logado. Faça login novamente.');
      setIsOpen(true);
      return;
    }

    setIsOpen(true);
    setLoading(true);
    setError('');
    setCopyStatus('');

    try {
      // 1) buscar mensalidades do usuário e selecionar a próxima a pagar
      const res = await MonthlyDuesService.findAll(0, 500);
      const items = res && res.content ? res.content : res || [];

      const candidates = (items || []).filter(d => {
        const memberId = (d.member && d.member.id) || d.memberId || d.member_id || null;
        const status = (d.status || '').toUpperCase();
        return memberId === currentUser.id && (status === 'DEFAULTER' || status === 'OPEN');
      });

      // ordena: DEFAULTER primeiro, depois OPEN; desempata por year/month crescente
      candidates.sort((a, b) => {
        const sa = (a.status || '').toUpperCase();
        const sb = (b.status || '').toUpperCase();
        if (sa !== sb) {
          if (sa === 'DEFAULTER') return -1;
          if (sb === 'DEFAULTER') return 1;
        }
        const ya = a.referenceYear || a.reference_year || 0;
        const yb = b.referenceYear || b.reference_year || 0;
        if (ya !== yb) return ya - yb;
        const ma = a.referenceMonth || a.reference_month || 0;
        const mb = b.referenceMonth || b.reference_month || 0;
        return ma - mb;
      });

      if (!candidates || candidates.length === 0) {
        setError('Nenhuma mensalidade pendente encontrada para o usuário atual.');
        setLoading(false);
        return;
      }

      const dues = candidates[0];
      const duesId = dues.id || dues.id;

      // 2) solicitar geração do PIX para a mensalidade encontrada
      const data = await PaymentService.generatePixForDues(duesId);

      // O backend pode retornar uma string (qr copia e cola) ou um objeto
      if (typeof data === 'string') {
        setPixData({ pixCopiaECola: data, qrCodeBase64: '' });
      } else {
        setPixData({
          pixCopiaECola: data?.pixCopiaECola || data?.qrCode || '',
          qrCodeBase64: data?.qrCodeBase64 || ''
        });
      }

    } catch (err) {
      console.error('Falha ao gerar pagamento PIX', err);
      setError('Não foi possível gerar o PIX no momento. Tente novamente em instantes.');
    } finally {
      setLoading(false);
    }
  }, []);

  const copyPixCode = useCallback(async () => {
    if (!pixData?.pixCopiaECola) {
      setCopyStatus('Nada para copiar.');
      return;
    }

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(pixData.pixCopiaECola);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = pixData.pixCopiaECola;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopyStatus('Código copiado com sucesso!');
      setTimeout(() => setCopyStatus(''), 3000);
    } catch (err) {
      console.error('Erro ao copiar código PIX', err);
      setCopyStatus('Não foi possível copiar. Copie manualmente.');
    }
  }, [pixData]);

  return {
    isOpen,
    loading,
    pixData,
    error,
    copyStatus,
    openForCurrentUser,
    closeModal,
    copyPixCode
  };
}
