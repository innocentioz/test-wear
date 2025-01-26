import React from 'react';

interface InputProps {
  type?: 'text' | 'password' | 'email' | 'number'; // Типы инпута
  placeholder?: string; // Плейсхолдер
  value?: string; // Значение инпута
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Обработчик изменения
  size?: 'small' | 'medium' | 'large'; // Размеры
  disabled?: boolean; // Отключение
  className?: string; // Дополнительные классы
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  size = 'medium',
  disabled = false,
  className = '',
}) => {

  const baseStyles = 'border-b border-neutral-800 montserrat px-4 py-2 focus:outline-none transition duration-200';
  const sizeStyles = {
    small: 'text-sm py-1 px-2',
    medium: 'text-base py-2 px-4',
    large: 'text-lg py-3 px-6',
  }[size];

  const disabledStyles = disabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-white';

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${baseStyles} ${sizeStyles} ${disabledStyles} ${className}`}
      disabled={disabled}
    />
  );
};

export default Input;
