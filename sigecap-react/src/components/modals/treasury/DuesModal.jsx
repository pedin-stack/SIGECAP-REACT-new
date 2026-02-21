import React from 'react';
import useMonthlyDues from '../../../use/useMonthlyDues';
import { 
  CreateButton,  
  ExcludeButton, 
  CancelButton,
  EditButton,
  ActionButton
} from '../../buttons/Buttons';

const DuesModal = ({ isOpen, onClose, onOpenManualEntry, onPay }) => {
  const { year, setYear, rows, loading, monthNames, refresh } = useMonthlyDues();

  if (!isOpen) return null;

  const renderBadge = (cell) => {
    if (!cell) return <span>-</span>;
    const status = (cell.status || '').toUpperCase();
    if (status === 'PAID') return <span className="status-badge status-paid">Pago</span>;
    if (status === 'OPEN') return <span className="status-badge status-pending">Em aberto</span>;
    if (status === 'DEFAULTER') return <span className="status-badge status-late">Inadimplente</span>;
    return <span className="status-badge">{cell.status}</span>;
  };

  return (
    <div className="modal-overlay">
      <div className="custom-modal modal-xl"> 
        <div className="d-flex justify-content-between align-items-center mb-4">
           <div className="d-flex align-items-center gap-2">
             <button className="btn btn-sm btn-secondary" onClick={() => setYear(year - 1)}>&lt;</button>
             <h3 className="fw-bold text-white m-0">Mensalidades {year}</h3>
             <button className="btn btn-sm btn-secondary" onClick={() => setYear(year + 1)}>&gt;</button>
           </div>
           <div className='d-flex gap-2'>
            <CreateButton onClick={onPay} label="Pagar" />
             <CancelButton onClick={onClose} label='Fechar' />
           </div>
        </div>

        <div className="table-responsive mb-4">
           <table className="table-custom">
              <thead>
                <tr>
                  <th>Membro</th>
                  {monthNames.map((m) => (<th key={m}>{m}</th>))}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={13}>Carregando...</td></tr>
                )}
                {!loading && rows.length === 0 && (
                  <tr><td colSpan={13}>Nenhum registro para {year}</td></tr>
                )}
                {!loading && rows.map((r, idx) => (
                  <tr key={idx}>
                    <td>{r.member?.name || r.member?.fullName || r.member?.username || '—'}</td>
                    {r.months.map((cell, mi) => (
                      <td key={mi}>{renderBadge(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
           </table>
        </div>

        <div className="d-flex justify-content-end">
            <ActionButton onClick={onOpenManualEntry} label="+ Lançamento Manual" />
        </div>
      </div>
    </div>
  );
};

export default DuesModal;