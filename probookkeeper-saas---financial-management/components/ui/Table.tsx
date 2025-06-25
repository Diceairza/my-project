
import React from 'react';

interface Column<T,> {
  Header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  Cell?: (value: any, row: T) => React.ReactNode; // Custom cell rendering
  className?: string; // For th/td styling
}

interface TableProps<T,> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

const Table = <T extends { id: string | number },>({ columns, data, onRowClick }: TableProps<T>): React.ReactElement => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
              >
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                No data available.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr 
                key={row.id} 
                className={`${onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column, index) => {
                  const value = typeof column.accessor === 'function' 
                                ? column.accessor(row) 
                                : row[column.accessor];
                  return (
                    <td 
                      key={index} 
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${column.className || ''}`}
                    >
                      {column.Cell ? column.Cell(value, row) : (typeof value === 'boolean' ? (value ? 'Yes' : 'No') : (value === null || value === undefined ? '' : String(value)))}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
