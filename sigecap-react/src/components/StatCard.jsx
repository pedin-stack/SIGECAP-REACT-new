import React from 'react';

const StatCard = ({ title, value, footer, isMoney }) => {
  return (
    <div className="card bg-custom-surface border-0 shadow-sm h-100">
      <div className="card-body d-flex flex-column justify-content-between p-4">
        
        {/* Título do Card */}
        <h6 className="text-custom-secondary text-uppercase fw-bold mb-3 small">
          {title}
        </h6>
        
        {/* Valor Principal */}
        <h3 className={`fw-bold mb-3 ${isMoney ? 'text-success' : 'text-white'}`}>
          {value}
        </h3>
        
        {/* Rodapé / Detalhe */}
        <div className="small text-white">
          {footer}
        </div>

      </div>
    </div>
  );
};

export default StatCard;