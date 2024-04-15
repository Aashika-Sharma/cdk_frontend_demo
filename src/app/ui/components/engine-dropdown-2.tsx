import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { fetchEngineNames } from './api';

interface EngineDropdownProps {
    onSelect: (engine: string) => void;
  }

const EngineDropdown2: React.FC<EngineDropdownProps> = ({onSelect}) => { 
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [engines, setEngines] = useState<string[]>([]);
  const [currentEngine, setCurrentEngine ] = useState<string>('')
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    console.log({target:event.currentTarget.dataset.engine})
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onMenuItemClick = (event:any) => {
    setAnchorEl(null);
    setCurrentEngine(event.currentTarget.dataset.engine)
  }
  

  useEffect(() => {

    const getEngines = async () => {
      const data = await fetchEngineNames();
      setEngines(data);
    };

    getEngines();
  }, []);

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {currentEngine !== '' ? currentEngine : 'Select Engine'}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {engines.map((engine, index) => (
            <MenuItem data-engine={engine}  onClick={onMenuItemClick} key={engine}>{engine}</MenuItem>
      ))}
      </Menu>
    </div>
  );
}

export default EngineDropdown2;
