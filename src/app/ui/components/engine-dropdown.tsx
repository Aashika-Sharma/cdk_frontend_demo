// components/EngineDropdown.tsx

import React, { useEffect, useState } from 'react';
import { fetchEngineNames } from '../services/api';

interface EngineDropdownProps {
  onSelect: (engine: string) => void;
}

const EngineDropdown: React.FC<EngineDropdownProps> = ({ onSelect }) => {
  const [engines, setEngines] = useState<string[]>([]);

  useEffect(() => {
    const getEngines = async () => {
      const data = await fetchEngineNames();
      setEngines(data);
    };

    getEngines();
  }, []);

  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      <option>Select Engine</option>
      {engines.map((engine, index) => (
        <option key={index} value={engine}>
          {engine}
        </option>
      ))}
    </select>
  );
};

export default EngineDropdown;
