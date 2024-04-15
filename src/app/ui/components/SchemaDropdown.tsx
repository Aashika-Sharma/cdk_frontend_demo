// SchemaDropdown.tsx

import React from 'react';

interface SchemaDropdownProps {
  schemas: string[];
  onSelect: (schema: string) => Promise<void>;
  disabled?: boolean;
}

const SchemaDropdown: React.FC<SchemaDropdownProps> = ({ schemas, onSelect, disabled }) => {
  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSchema = event.target.value;
    if (!disabled) {
      await onSelect(selectedSchema);
    }
  };

  return (
    <select onChange={handleChange} disabled={disabled}>
      <option value="">Select Schema</option>
      {schemas.map(schema => (
        <option key={schema} value={schema}>
          {schema}
        </option>
      ))}
    </select>
  );
};

export default SchemaDropdown;
