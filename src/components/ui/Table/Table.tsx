import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  isLoading?: boolean;
}

function Table<T>({
  data,
  columns,
  onSort,
  sortKey,
  sortDirection,
  isLoading = false,
}: TableProps<T>) {
  const handleSort = (key: string) => {
    if (!onSort) return;
    const direction = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, direction);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full whitespace-nowrap">
        <thead>
          <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
            {columns.map((column) => (
              <th
                key={column.key.toString()}
                className="px-4 py-3"
                onClick={() => column.sortable && handleSort(column.key.toString())}
              >
                <div className="flex items-center space-x-1 cursor-pointer">
                  <span>{column.title}</span>
                  {column.sortable && (
                    <div className="flex flex-col">
                      <ChevronUp
                        className={`w-3 h-3 -mb-1 ${
                          sortKey === column.key && sortDirection === 'asc'
                            ? 'text-purple-600'
                            : 'text-gray-400'
                        }`}
                      />
                      <ChevronDown
                        className={`w-3 h-3 ${
                          sortKey === column.key && sortDirection === 'desc'
                            ? 'text-purple-600'
                            : 'text-gray-400'
                        }`}
                      />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-3">
                <div className="flex justify-center">
                  <div className="w-6 h-6 border-2 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-3 text-center text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((item, i) => (
              <tr key={i} className="text-gray-700 dark:text-gray-400">
                {columns.map((column) => (
                  <td key={column.key.toString()} className="px-4 py-3">
                    {column.render
                      ? column.render(item)
                      : (item[column.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;