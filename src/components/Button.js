import { useState, useEffect } from "react";

function Button({ onClick , disabled, text, loadingText, isLoading }) {
  
  const [displayText, setDisplayText] = useState(text);
  useEffect(() => {
    if (isLoading && loadingText) {
      setDisplayText(loadingText);
    } else {
      setDisplayText(text);
    }
  }, [isLoading, loadingText, text]);

  const clicked = async () => {
    if (disabled || isLoading) {
      return;
    }
    if (typeof(onClick)==='function') {
      await onClick();
    }
  }

  return (
    <a className={"btn-theme"+((disabled || isLoading)?" disabled":"")}
      onClick={clicked} disabled={disabled || isLoading} >
      {isLoading && 
        <img className="circle-shape" src="assets/img/shape/circle-shape.svg" alt="shape" />
      }
      {displayText}
    </a>
  );
}

export default Button;
