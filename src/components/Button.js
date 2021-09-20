import { useState, useEffect } from "react";

function Button({ onClick , disabled, text, loadingText, isLoading }) {
  
  const [displayText, setDisplayText] = useState(text);
  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  useEffect(() => {
    if (isLoading) {
      setDisplayText(loadingText);
    } else {
      setDisplayText(text);
    }
  }, [isLoading]);

  const clicked = () => {
    if (disabled || isLoading) {
      return;
    }
    if (typeof(onClick)==='function') {
      return onClick();
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
