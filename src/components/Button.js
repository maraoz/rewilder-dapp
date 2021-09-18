import { useState, useEffect } from "react";

function Button({ onClick , disabled, text, loadingText, isLoading }) {
  
  const [displayText, setDisplayText] = useState(text);
  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  const clicked = () => {
    if (loadingText) {
      setDisplayText(loadingText);
    }
    if (typeof(onClick)==='function') {
      return onClick();
    }
  }

  return (
    <a className="btn-theme"
      onClick={clicked} disabled={disabled || isLoading} >
      {isLoading && 
        <div className="circle-shape">
            <img src="assets/img/shape/circle-shape.svg" alt="shape" />
        </div>
      }
      {displayText}{isLoading}{disabled}
    </a>
    
    // <div className="d-grid gap-2 mb-3 mb-md-0">
    //   <button 
    //     className="btn btn-custom"
    //     onClick={clicked} 
    //     disabled={disabled || isLoading}>
    //     {isLoading && 
    //       <div className="spinner-border text-white donate-spinner" role="status">
    //       </div>
    //     }
    //     {displayText}

    //   </button>
    // </div>
  );
}

export default Button;
