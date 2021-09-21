import { useState, useEffect } from "react";

function Button({ onClick , disabled, text, loadingText, isLoading }) {
  
  const clicked = async () => {
    if (disabled || isLoading) {
      return;
    }
    if (typeof(onClick)==='function') {
      await onClick();
    }
  }

  return (
    <a href="#" className={"btn-theme"+((disabled || isLoading)?" disabled":"")}
      onClick={clicked} disabled={disabled || isLoading} >
      {isLoading && 
        <img className="circle-shape" src="assets/img/shape/circle-shape.svg" alt="shape" />
      }
      {(isLoading && loadingText)? loadingText : text}
    </a>
  );
}

export default Button;
