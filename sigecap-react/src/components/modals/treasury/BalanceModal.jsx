import React, { useState, useEffect } from 'react';
import { 
  CreateButton,  
  ExcludeButton, 
  CancelButton,
  EditButton,
  ActionButton
} from '../../buttons/Buttons';


const BalanceModal = ({ 
  isOpen, 
  onClose, 
  movements, 
  cash, 
  onSaveInitialBalance,
  onEditMovement,   
  onDeleteMovement  
}) => {
  const [initialBalance, setInitialBalance] = useState('');


  useEffect(() => {
    if (cash && cash.initialValue != null) {
      setInitialBalance(String(cash.initialValue));
    }
  }, [cash]);

  if (!isOpen) return null;
  // --- Total vindo do backend ---
  const backendTotal = (cash && (cash.total !== null && cash.total !== undefined)) ? Number(cash.total) : null;
  const formattedTotal = backendTotal !== null
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(backendTotal)
    : '-';

  return (
    <div className="modal-overlay">
     
      <div className="custom-modal modal-xl">
        
        {/* Cabeçalho do Modal e Input de Saldo Inicial */}
        <div className="d-flex justify-content-between align-items-center mb-4">
           <h3 className="fw-bold text-white m-0">Balanço Recente</h3>
           
           <div className="d-flex align-items-center gap-3">
             <label className="me-2 text-white mb-0">Saldo Inicial</label>
             <input
               type="number"
               className="form-control form-control-custom"
               step="0.01"
               value={initialBalance}
               onChange={(e) => setInitialBalance(e.target.value)}
               style={{ width: '150px' }}
             />
             <CreateButton onClick={() => onSaveInitialBalance(initialBalance)} label='Salvar'/>
           </div>
        </div>

        {/* Tabela */}
        <div className="table-responsive">
          <table className="table-custom w-100">
             <thead>
                <tr>
                   <th>Data</th>
                   <th>Descrição</th>
                   <th>Documento</th>
                   <th>Tipo</th>
                   <th>Valor</th>
                   <th className="text-end pe-3">Ações</th> {/* Nova Coluna */}
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
                        <td className="align-middle">{dateStr}</td>
                        <td className="align-middle">{m.description || '-'}</td>
                        
                        {/* Célula de Documento */}
                        <td className="align-middle">
                          {docUrl ? (
                            <a href={docUrl} target="_blank" rel="noopener noreferrer" className="text-info text-decoration-none">
                              <i className="bi bi-file-earmark-text me-1"></i> Ver Doc
                            </a>
                          ) : '-'}
                        </td>

                        <td className="align-middle">
                          {m.type === 'ENTRADA' || m.type === 'INCOMING' 
                            ? <span className="text-success fw-bold">{typeLabel}</span> 
                            : <span className="text-danger fw-bold">{typeLabel}</span>
                          }
                        </td>
                        <td className="align-middle">{valueStr}</td>
                        
                        {/* --- NOVA COLUNA DE AÇÕES --- */}
                        <td className="text-end">
                            <div className="d-flex justify-content-end gap-2">
                                <EditButton 
                                  onClick={() => onEditMovement && onEditMovement(m)} 
                                  label="Editar" 
                                />
                                <ExcludeButton 
                                  onClick={() => onDeleteMovement && onDeleteMovement(m)} 
                                  label="Excluir" 
                                />
                            </div>
                        </td>

                     </tr>
                   );
                 })
               ) : (
                 <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">Sem movimentações recentes</td>
                 </tr>
               )}
             </tbody>
          </table>
        </div>

        {/* Rodapé com Total */}
        <div className="modal-actions mt-4 d-flex justify-content-between align-items-center border-top border-secondary pt-3">
          <div className="text-white fs-5">
            <strong>Total:</strong> <span className={backendTotal !== null ? (backendTotal >= 0 ? 'text-success' : 'text-danger') : 'text-secondary'}>{formattedTotal}</span>
          </div>
         <CancelButton onClick={onClose} label="Fechar" />
        </div>

      </div>
    </div>
  );
};

export default BalanceModal;