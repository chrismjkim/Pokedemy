import { useMemo, useState, useEffect } from "react";

function ListInput({
  options,
  inputClassName,
  ariaLabel,
  value,
  onValueChange,
  onInputChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? "");
  const [activeIndex, setActiveIndex] = useState(-1);
  const isControlled = value !== undefined && value !== null;

  // 사용자가 input에 입력 시 모두 문자열로 통일시킴
  const normalizedOptions = useMemo(() => {
    return options
      .map((opt) => {
        if (opt == null) {
          return null;
        }
        if (typeof opt === "string" || typeof opt === "number") {
          const text = String(opt);
          return { label: text, value: text, object: text};
        }
        const label = opt.label ?? opt.name ?? opt.value ?? "";
        const val = opt.value ?? opt.name ?? opt.label ?? "";
        const obj = opt.object ?? "";
        const labelText = String(label);
        const valueText = String(val);
        const objectText = String(obj);
        return { label: labelText, value: valueText, object: objectText };
      })
      .filter((opt) => opt && opt.label.trim() && opt.value.trim() && opt.object.trim());
  }, [options]);

  // 사용자가 input에 입력 시 소문자/대문자 상관없이 검색이 가능하게 만듦
  const filteredOptions = useMemo(() => {
    if (!inputValue) {
      return normalizedOptions;
    }
    const keyword = inputValue.toLowerCase();
    return normalizedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(keyword)
    );
  }, [inputValue, normalizedOptions]);

  // 최초 처리
  useEffect(() => {
    if (!isControlled) {
      return;
    }
    if (!value) {
      setInputValue("");
      return;
    }
    const valueText = String(value);
    const matched = normalizedOptions.find((opt) => opt.value === value);
    setInputValue(matched ? matched.label : value);
  }, [value, normalizedOptions, isControlled]);

  // 
  const handleInput = (e) => {
    const next = e.target.value;
    setInputValue(next);
    setIsOpen(true);
    setActiveIndex(-1);
    onInputChange?.(next);
  };
  // 키보드 키 입력 시 처리
  const handleKeyDown = (event) => {
    if (!filteredOptions.length) {
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) =>
        prev < 0 ? 0 : Math.min(prev + 1, filteredOptions.length - 1)
      );
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) =>
        prev < 0 ? filteredOptions.length - 1 : Math.max(prev - 1, 0)
      );
    }
    if (event.key === "Enter") {
      if (!isOpen) {
        return;
      }
      event.preventDefault();
      const index = activeIndex >= 0 ? activeIndex : 0;
      const opt = filteredOptions[index];
      if (!opt) {
        return;
      }
      setInputValue(opt.label);
      onValueChange?.(opt.value);
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="calc-select">
      <input
        className={inputClassName}
        value={inputValue}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          setIsOpen(false);
          setActiveIndex(-1);
        }}
        aria-label={ariaLabel}
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="calc-select__menu">
          {filteredOptions.map((opt, index) => (
            <li
              className={`calc-select__option${
                index === activeIndex ? " calc-select__option--active" : ""
              }`}
              key={`${opt.value}-${index}`}
              onMouseDown={(event) => {
                event.preventDefault();
                setInputValue(opt.label);   // 인풋란에 label을 표시한다
                onValueChange?.(opt.value); // value에 opt.value를 넣는다
                setIsOpen(false);
                setActiveIndex(-1);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListInput;
