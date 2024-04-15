// components/EngineDropdown.tsx

import React, { useEffect, useState } from 'react';
import { fetchEngineNames } from './api';

interface EngineDropdownProps {
  onSelect: (engine: string) => void;
}

const EngineDropdown: React.FC<EngineDropdownProps> = ({ onSelect }) => {
  const [engines, setEngines] = useState<string[]>([]);
  const [currentEngine, setCurrentEngine ] = useState<string>('')
  useEffect(() => {

    const getEngines = async () => {
      const data = await fetchEngineNames();
      setEngines(data);
    };

    getEngines();
  }, []);

  const handleOnChange = (val : string) => {
    console.log({val})
    setCurrentEngine(val)
    onSelect(val)
  }

  return (
    <select value={currentEngine} onChange={(e) => handleOnChange(e.target.value)}>
      <option>{currentEngine !== '' ? currentEngine : 'Select Engine'}</option>
      {engines.map((engine, index) => (
        <option key={index} value={engine}>
          {engine}
        </option>
      ))}
    </select>
  );
};

export default EngineDropdown;
