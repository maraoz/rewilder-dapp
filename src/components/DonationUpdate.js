import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function DonationUpdate({ icon, iconalt, date, message, linkText, linkHref, isCloseable, onClose }) {
  return <div className="update-card">
    <div className="update-icon">
        <img src={icon} alt={iconalt}/>
    </div>
    <div className="update-content">
      <span>{date}</span>
      <p>{message}</p>
      <a href={linkHref} target="_blank">{linkText}</a>
    </div>
    {
    isCloseable && 
      <div className="close" onClick={onClose}>
        <FontAwesomeIcon icon={faTimes} />
      </div>
    }
  </div>;
};

export default DonationUpdate;