import React, { useEffect, useCallback } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


function RewilderModal({ children, className, onOpen, isOpen, onClose, title }) {

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overlay');
    } else {
      document.body.classList.remove('overlay');
    }
  }, [isOpen]);

  // ESC key closes
  const escFunction = useCallback((event) => {
    if(event.keyCode === 27) {
      onClose();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  return (
    <div className={"rewilder-popup"+(className?(" "+className):"")+(isOpen?" active":"")}>
      <div className="rewilder-popup-close" onClick={onClose}>
        <img src="/assets/img/icon/x.svg"></img>
      </div>
      <h4>{title}</h4>
      {children}
    </div>
  );
}

export default RewilderModal;
