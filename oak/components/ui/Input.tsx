import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-xs font-semibold uppercase text-gray-600 tracking-wider">{label}</label>}
        <input
          ref={ref}
          className={`w-full bg-[#F1F5F9] border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F1C3F] transition ${className}`}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';