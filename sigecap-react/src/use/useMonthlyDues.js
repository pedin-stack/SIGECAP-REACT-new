import { useState, useEffect, useCallback } from 'react';
import MonthlyDuesService from '../api/MonthlyDuesService';
import UserService from '../api/UserService';

const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function useMonthlyDues(initialYear = new Date().getFullYear()) {
  const [year, setYear] = useState(initialYear);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const buildRows = (items, targetYear, memberMap = new Map()) => {
    const map = new Map();

    (items || []).forEach((d) => {
      const refYear = d.referenceYear || d.reference_year || null;
      if (refYear !== targetYear) return;

      const rawMember = d.member || {};
      const memberId = rawMember.id || d.memberId || d.member_id || null;

      // Resolve o member completo (pode vir via memberMap quando apenas memberId foi fornecido)
      const member = memberId ? (memberMap.get(String(memberId)) || rawMember) : rawMember;

      // Garantir que o member associado é do tipo DEMOLAY
      const isDemolayMember = (m) => {
        if (!m) return false;
        const ut = m.userType || {};
        const candidates = [ut.description, ut.typeName, ut.name, ut.label, m.type, m.userType?.typeName];
        return candidates.some(c => typeof c === 'string' && c.toLowerCase() === 'demolay');
      };
      if (!isDemolayMember(member)) return;
      const key = memberId ? String(memberId) : `member-${Math.random()}`;

      if (!map.has(key)) {
        map.set(key, { member, months: Array(12).fill(null) });
      }

      const entry = map.get(key);
      const monthIndex = (d.referenceMonth || d.reference_month || 1) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        entry.months[monthIndex] = {
          id: d.id,
          status: d.status,
          value: d.value
        };
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const an = (a.member.name || a.member.fullName || a.member.username || '').toLowerCase();
      const bn = (b.member.name || b.member.fullName || b.member.username || '').toLowerCase();
      return an.localeCompare(bn);
    }).map(r => ({ ...r }));
  };

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await MonthlyDuesService.findAll(0, 500);
      const items = data && data.content ? data.content : data;
      // Debugging: log estrutura retornada
      // eslint-disable-next-line no-console
      console.debug('[useMonthlyDues] fetched', Array.isArray(items) ? items.length : 'no-array', items && items[0]);
      // coletar memberIds onde não há objeto member completo
      const missingIds = new Set();
      const knownMap = new Map();
      (items || []).forEach(d => {
        const rawMember = d.member || {};
        const memberId = rawMember.id || d.memberId || d.member_id || null;
        if (memberId) {
          if (rawMember && rawMember.id) {
            knownMap.set(String(memberId), rawMember);
          } else {
            missingIds.add(memberId);
          }
        }
      });

      // Debug: mostrar ids detectados
      // eslint-disable-next-line no-console
      console.debug('[useMonthlyDues] knownMap size', knownMap.size, 'missingIds', Array.from(missingIds));

      if (missingIds.size > 0) {
        // Log antes de chamadas
        // eslint-disable-next-line no-console
        console.debug('[useMonthlyDues] buscando usuários faltantes:', Array.from(missingIds));
        const promises = Array.from(missingIds).map(id => UserService.findById(id).then(u => [String(id), u]).catch((err) => {
          // eslint-disable-next-line no-console
          console.error('[useMonthlyDues] falha ao buscar usuário', id, err);
          return [String(id), null];
        }));
        const results = await Promise.all(promises);
        results.forEach(([id, user]) => { if (user) knownMap.set(String(id), user); });
        // eslint-disable-next-line no-console
        console.debug('[useMonthlyDues] usuários carregados:', results.map(r => r[0]));
      }

      const built = buildRows(items, year, knownMap);
      setRows(built);
    } catch (error) {
      console.error('Falha ao carregar mensalidades', error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => { fetch(); }, [fetch]);

  return {
    year,
    setYear,
    rows,
    loading,
    monthNames,
    refresh: fetch
  };
}
