// components/TableDropdown.tsx

import React from 'react';

interface TableDropdownProps {
  tables: string[];
  onSelect: (table: string) => void;
}

const TableDropdown: React.FC<TableDropdownProps> = ({ tables, onSelect }) => {
  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      <option>Select Table</option>
      {tables.map((table, index) => (
        <option key={index} value={table}>
          {table}
        </option>
      ))}
    </select>
  );
};

export default TableDropdown;
