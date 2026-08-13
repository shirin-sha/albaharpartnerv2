"use client";

import { useEffect, useRef, useState } from "react";

const optionsDefault = ["Newest", "Oldest", "3 days"];

interface DropdownSelectProps {
  onChange?: (elm: string) => void;
  options?: string[];
  defaultOption?: string;
  selectedValue?: string;
  addtionalParentClass?: string;
}

export default function DropdownSelect({
  onChange = () => {},
  options = optionsDefault,
  defaultOption = "",
  selectedValue = "",
  addtionalParentClass = "",
}: DropdownSelectProps) {
  const selectRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<string>(
    selectedValue || defaultOption || options[0] || ""
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedValue) {
      setSelected(selectedValue);
    }
  }, [selectedValue]);

  useEffect(() => {
    if (!selectedValue && options[0] && !options.includes(selected)) {
      setSelected(options[0]);
    }
  }, [options, selected, selectedValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const displayValue = selectedValue || selected || defaultOption || options[0];

  return (
    <div
      className={["nice-select", addtionalParentClass, isOpen ? "open" : ""]
        .filter(Boolean)
        .join(" ")}
      ref={selectRef}
      onClick={() => setIsOpen((open) => !open)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setIsOpen((open) => !open);
        }
      }}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
    >
      <span className="current">{displayValue}</span>
      <ul
        className="list"
        role="listbox"
        onClick={(event) => event.stopPropagation()}
      >
        {options.map((elm, i) => (
          <li
            key={i}
            onClick={() => {
              setSelected(elm);
              onChange(elm);
              setIsOpen(false);
            }}
            className={`option ${displayValue === elm ? "selected" : ""} text text-1`}
            role="option"
            aria-selected={displayValue === elm}
          >
            {elm}
          </li>
        ))}
      </ul>
    </div>
  );
}
