import React from 'react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  label?: string;
  selectedValues?: string[];
  onSelectedChange?: (values: string[]) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, error, label, selectedValues, onSelectedChange, ...props }, ref) => {
    return (
      <select
        value={props.multiple ? (selectedValues || []) : (props.value || '')}
        multiple={props.multiple}
        ref={ref}
        className={cn(
          "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white",
          error ? "border-red-500" : "border-gray-300 dark:border-gray-600",
          className
        )}
        onChange={(e) => {
          if (onSelectedChange) {
            if (props.multiple) {
              const values = Array.from(e.target.selectedOptions, option => option.value);
              onSelectedChange(values);
            } else {
              onSelectedChange([e.target.value]);
            }
          }
          if (props.onChange) {
            props.onChange(e);
          }
        }}
        {...props}
      >
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = 'Select';

export default Select;