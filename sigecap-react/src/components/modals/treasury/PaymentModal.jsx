import React, { forwardRef, useImperativeHandle } from 'react';
import { CancelButton,ActionButton } from '../../buttons/Buttons';
import usePayment from '../../../use/usePayment';

const PaymentModal = forwardRef((_, ref) => {
  const {
    isOpen,
    loading,
    pixData,
    error,
    copyStatus,
    openForCurrentUser,
    closeModal,
    copyPixCode
  } = usePayment();

  useImperativeHandle(ref, () => ({
    open: openForCurrentUser,
    close: closeModal
  }), [openForCurrentUser, closeModal]);

  if (!isOpen) return null;

  const qrCodeSrc = pixData?.qrCodeBase64 ? `data:image/png;base64,${pixData.qrCodeBase64}` : null;
  const pixText = pixData?.pixCopiaECola || '';

  return (
    <div className="modal-overlay">
      <div className="custom-modal modal-md payment-modal">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold text-white m-0">Pagamento via PIX</h3>
          <button type="button" className="btn-close btn-close-white" aria-label="Fechar" onClick={closeModal} />
        </div>

        {loading && (
          <div className="text-center py-5 text-white">Gerando QR Code...</div>
        )}

        {!loading && (
          <>
            {error && <div className="alert alert-danger">{error}</div>}

            {!error && (
              <div className="payment-content">
                {qrCodeSrc ? (
                  <div className="text-center mb-4">
                    <img src={qrCodeSrc} alt="QR Code PIX" className="img-fluid" style={{ maxWidth: '280px' }} />
                    <p className="mt-2 text-white">Escaneie o QR Code usando o app do seu banco.</p>
                  </div>
                ) : (
                  <p className="text-white">O QR Code não está disponível no momento.</p>
                )}

                <div className="mb-3">
                  <label className="form-label text-white fw-semibold">Pix copia e cola</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    readOnly
                    value={pixText}
                    style={{ backgroundColor: '#1f2230', color: '#fff', borderColor: '#2f3348' }}
                  />
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <ActionButton type="button" className="btn btn-primary" onClick={copyPixCode} disabled={!pixText} label="Copiar" />
                    {copyStatus && <small className="text-info ms-3">{copyStatus}</small>}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="d-flex justify-content-end mt-4">
          <CancelButton onClick={closeModal} label="Fechar" />
        </div>
      </div>
    </div>
  );
});

PaymentModal.displayName = 'PaymentModal';

export default PaymentModal;
