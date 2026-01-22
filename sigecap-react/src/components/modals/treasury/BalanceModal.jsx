import React, { useState, useEffect } from 'react';

const BalanceModal = ({ isOpen, onClose, movements, cash, onSaveInitialBalance }) => {
  const [initialBalance, setInitialBalance] = useState('');

  // Sincroniza o input com o valor vindo da API (cash)
  useEffect(() => {
    if (cash && cash.initialValue != null) {
      setInitialBalance(String(cash.initialValue));
    }
  }, [cash]);

  if (!isOpen) return null;

  // --- Cálculos de Totais ---
  const sumMovements = movements.reduce((acc, m) => {
    const val = Number(m.value) || 0;
    return acc + ((m.type === 'ENTRADA' || m.type === 'INCOMING') ? val : -val);
  }, 0);

  const computedTotal = (parseFloat(initialBalance) || 0) + sumMovements;
  
  // Prioriza o total que vem do backend se existir, senão usa o calculado
  const displayedTotal = (cash && (cash.total !== null && cash.total !== undefined)) ? cash.total : computedTotal;
  const formattedTotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayedTotal);

  return (
    <div className="modal-overlay">
      <div className="custom-modal modal-lg">
        
        {/* Cabeçalho do Modal e Input de Saldo Inicial */}
        <div className="d-flex justify-content-between align-items-center mb-4">
           <h3 className="fw-bold text-white m-0">Balanço Recente</h3>
           
           <div className="d-flex align-items-center">
             <label className="me-2 text-white mb-0">Saldo Inicial</label>
             <input
               type="number"
               className="form-control form-control-custom"
               step="0.01"
               value={initialBalance}
               onChange={(e) => setInitialBalance(e.target.value)}
             />
             <button 
               type="button" 
               className="btn btn-confirm ms-2" 
               onClick={() => onSaveInitialBalance(initialBalance)}
             >
               Salvar
             </button>
           </div>
        </div>

        {/* Tabela */}
        <div className="table-responsive">
          <table className="table-custom">
             <thead>
                <tr>
                   <th>Data</th>
                   <th>Descrição</th>
                   <th>Documento</th> {/* Coluna Reinserida */}
                   <th>Tipo</th>
                   <th>Valor</th>
                </tr>
             </thead>
             <tbody>
               {movements && movements.length > 0 ? (
                 movements.map((m) => {
                   const date = m.date ? new Date(m.date) : null;
                   const dateStr = date ? date.toLocaleDateString() : '-';
                   
                   const typeLabel = m.type === 'ENTRADA' || m.type === 'INCOMING' ? 'Entrada' : 'Saída';
                   const valueStr = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(m.value || 0);
                   
                   // Lógica de URL do Documento
                   const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:8080';
                   const docUrl = m.supportingDoc 
                     ? (m.supportingDoc.startsWith('http') ? m.supportingDoc : `${apiBase}${m.supportingDoc}`) 
                     : null;

                   return (
                     <tr key={m.id || Math.random()}>
                        <td>{dateStr}</td>
                        <td>{m.description || '-'}</td>
                        
                        {/* Célula de Documento */}
                        <td>
                          {docUrl ? (
                            <a href={docUrl} target="_blank" rel="noopener noreferrer">
                              {m.supportingDoc}
                            </a>
                          ) : '-'}
                        </td>

                        <td>
                          {m.type === 'ENTRADA' || m.type === 'INCOMING' 
                            ? <span className="text-success">{typeLabel}</span> 
                            : <span className="text-danger">{typeLabel}</span>
                          }
                        </td>
                        <td>{valueStr}</td>
                     </tr>
                   );
                 })
               ) : (
                 <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>Sem movimentações</td>
                 </tr>
               )}
             </tbody>
          </table>
        </div>

        {/* Rodapé com Total */}
        <div className="modal-actions mt-4 d-flex justify-content-between align-items-center">
          <div className="text-white"><strong>Total:</strong> {formattedTotal}</div>
          <button className="btn-cancel" onClick={onClose}>Fechar</button>
        </div>

      </div>
    </div>
  );
};

export default BalanceModal;