// components/SchemaDropdown.tsx

import React from 'react';

interface SchemaDropdownProps {
  schemas: string[];
  onSelect: (schema: string) => void;
}

const SchemaDropdown: React.FC<SchemaDropdownProps> = ({ schemas, onSelect }) => {
  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      <option>Select Schema</option>
      {schemas.map((schema, index) => (
        <option key={index} value={schema}>
          {schema}
        </option>
      ))}
    </select>
  );
};

export default SchemaDropdown;
