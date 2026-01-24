const OptionCard = ({ title, description, icon, onClick, disabled }) => (
  <div className="col-lg-6 col-md-6 mb-4">
    <div
      className={`option-card ${disabled ? 'disabled' : ''}`}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h2>{title}</h2>
        <p>{description}</p>
        {disabled && <small className="text-muted d-block mt-2">(Em breve)</small>}
      </div>
    </div>
  </div>
);

export default OptionCard;