import { useEffect, useState } from 'react';
import EventService from '../api/EventService';
import CashService from '../api/CashService';
import FinancialMovementService from '../api/FinancialMovementService';

const useDashboard = () => {
  const [nextEvent, setNextEvent] = useState({ title: 'Nenhum evento', date: null });
  const [total, setTotal] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadEvents = async () => {
      try {
        const res = await EventService.findAll(0, 100);
        const list = Array.isArray(res?.content) ? res.content : (Array.isArray(res) ? res : []);
        const now = new Date();
        const upcoming = list
          .map(e => ({ title: e.name || e.title || 'Evento', date: e.startTime || e.date }))
          .map(e => ({ title: e.title, date: e.date ? new Date(e.date) : null }))
          .filter(e => e.date && e.date >= now)
          .sort((a, b) => a.date - b.date);
        if (!mounted) return;
        if (upcoming.length > 0) setNextEvent({ title: upcoming[0].title, date: upcoming[0].date });
        else setNextEvent({ title: 'Nenhum evento próximo', date: null });
      } catch (err) {
        console.error('Erro ao carregar eventos para dashboard', err);
      }
    };
    loadEvents();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadCash = async () => {
      try {
        const res = await CashService.getCurrent();
        const data = res.data || {};
        if (!mounted) return;
        const totalVal = data?.total ?? data?.saldo ?? data?.currentBalance ?? data?.value ?? data?.initialValue ?? null;

        // Tenta obter a data de atualização a partir do próprio objeto cash
        let date = null;
        const dateStr = data?.updatedAt ?? data?.lastUpdated ?? data?.date ?? data?.lastEntryDate ?? null;
        if (dateStr) date = new Date(dateStr);

        // Se não encontrou, busca a última movimentação financeira e usa sua data
        if (!date) {
          try {
            const mvRes = await FinancialMovementService.getAll({ page: 0, size: 1, sort: 'date,desc' });
            const mvData = mvRes.data;
            const latest = Array.isArray(mvData?.content) ? mvData.content[0] : (Array.isArray(mvData) ? mvData[0] : null);
            if (latest && latest.date) date = new Date(latest.date);
          } catch (e) {
            // se falhar ao buscar movimentos, deixa date como null
            console.warn('Não foi possível obter última movimentação para data do dashboard', e);
          }
        }

        setTotal(totalVal);
        setLastUpdate(date);
      } catch (err) {
        console.error('Erro ao carregar cash para dashboard', err);
      }
    };
    loadCash();
    return () => { mounted = false; };
  }, []);

  return { nextEvent, total, lastUpdate };
};

export default useDashboard;
