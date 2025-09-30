// src/components/ui/CustomDropdown.tsx
import React, { useState, useRef, useEffect } from "react";

interface CustomDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  options, 
  value, 
  onChange, 
  label, 
  disabled = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent | TouchEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((s) => !s)}
        disabled={disabled}
        className={`bg-white text-navy px-4 py-2 rounded-md border border-navy/20 shadow-sm text-sm font-medium flex items-center justify-between min-w-[160px]
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      >
        <span>{value || label}</span>
        <svg className={`w-4 h-4 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg border border-navy/20">
          <ul className="py-1 max-h-60 overflow-y-auto no-scrollbar">
            {options.map((opt) => (
              <li
                key={opt}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`px-4 py-2 cursor-pointer text-sm ${opt === value ? "bg-primary text-white" : "hover:bg-primary/10 text-navy"}`}
              >
                {opt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;