import React from 'react'

const Input = ({ 
  label, 
  type = 'text', 
  name,
  value, 
  onChange, 
  placeholder,
  error,
  required = false,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full px-4 py-2 rounded-lg border 
          bg-white dark:bg-gray-800 
          border-gray-300 dark:border-gray-600
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-60 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : ''}
        `}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default Input