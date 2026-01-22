

const ErrorModal = ({ isOpen, onClose, message }) => {

  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in">

      <div 
        className="card bg-custom-surface border-0 shadow-lg text-center"
        style={{ 
          width: '90%', 
          maxWidth: '400px', 
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="card-body d-flex flex-column justify-content-between align-items-center p-4">
          
         
          <div className="mt-2">
            <div className="mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h4 className="fw-bold text-white mb-1">Ops! Algo deu errado.</h4>
          </div>

          <div className="flex-grow-1 d-flex align-items-center justify-content-center my-3">
            <p className="text-custom-secondary m-0 px-2" style={{ fontSize: '1.1rem' }}>
              {message || "Ocorreu um erro inesperado."}
            </p>
          </div>

          <button 
            onClick={onClose}
            className="btn btn-custom fw-bold"
            style={{ 
              width: '80%', 
              height: '50px', 
              borderRadius: '8px',
              fontSize: '1rem',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            OK
          </button>

        </div>
      </div>
    </div>
  );
};

export default ErrorModal;