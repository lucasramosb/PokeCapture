"use client";

import './button.style.css'

type ButtonProps = {
    text: string;
    onClick: () => void;
    className?: string;
  };
  
export default function Button({ text, onClick, className }: ButtonProps) {
  return (
    <button className={`button ${className}`} onClick={onClick} >
    {text}
    </button>
  );
}