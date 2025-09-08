import React, { useState, useRef, useEffect } from "react";

interface CustomDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  label,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking/tapping outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const getButtonText = () => {
    if (value === "all") return label;
    if (label === "All PUCs") return `PUC ${value}`;
    return value;
  };

  const getListItemText = (option: string) => {
    if (option === "all") return label;
    if (label === "All PUCs") return `PUC ${option}`;
    return option;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`bg-grey-raised text-white px-4 py-2 rounded-lg transition-colors text-sm shadow-sm
                   hover:bg-grey-darker focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
                   flex items-center justify-between min-w-[150px] border border-transparent
                   ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {getButtonText()}
        <svg
          className={`w-4 h-4 ml-2 transition-transform transform-gpu duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-10 mt-1 w-full rounded-lg bg-grey-raised shadow-lg border border-transparent
                     max-h-60 overflow-y-auto no-scrollbar"
          role="listbox"
        >
          <ul className="py-1">
            {options.map((option) => (
              <li
                key={option}
                role="option"
                aria-selected={option === value}
                onClick={() => handleSelect(option)}
                className={`px-4 py-2 cursor-pointer text-sm transition-colors duration-100
                           ${
                             option === value
                               ? "bg-grey-darker text-white"
                               : "hover:bg-grey-darker hover:text-white text-grey-contrast"
                           }`}
              >
                {getListItemText(option)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
