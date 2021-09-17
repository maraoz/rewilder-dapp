import { useState, useEffect } from "react";

function Button({ onClick , disabled, text }) {
  
  const [displayText, setDisplayText] = useState(text);

  const clicked = () => {
    setDisplayText("...");
    if (typeof(onClick)==='function')
      return onClick();
  }

  return (
    <div className="d-grid gap-2 mb-3 mb-md-0">
      <button 
        className="btn btn-custom"
        onClick={clicked} 
        disabled={disabled}>

        {displayText}

      </button>
    </div>
  );
}

export default Button;
