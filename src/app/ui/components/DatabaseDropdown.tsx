// components/DatabaseDropdown.tsx

import React from 'react';

interface DatabaseDropdownProps {
  databases: string[];
  onSelect: (database: string) => void;
}

const DatabaseDropdown: React.FC<DatabaseDropdownProps> = ({ databases, onSelect }) => {
  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      <option>Select Database</option>
      {databases.map((db, index) => (
        <option key={index} value={db}>
          {db}
        </option>
      ))}
    </select>
  );
};

export default DatabaseDropdown;
