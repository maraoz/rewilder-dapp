import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import RewilderModal from './RewilderModal';

function ErrorModal({ onOpen, isOpen, onClose }) {

  return (
    <RewilderModal className="transaction-popup error-popup" onOpen={onOpen} isOpen={isOpen} onClose={onClose} title={"Error"}>
      <div className="message">
        <span>
          <FontAwesomeIcon icon={faExclamationCircle} />
          Donation transaction failed. 
        </span>
      </div>
      <div class="transaction-popup-close-btn">
        <a onClick={onClose}>close</a>
      </div>
    </RewilderModal>
  );
}

export default ErrorModal;
