import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

import EngineDropdown2 from './engine-dropdown-2';
import DatabaseDropdown from './DatabaseDropdown';
import SchemaDropdown from './SchemaDropdown';
import TableDropdown from './TableDropdown';
//import DataHandler from './DataHandler';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

interface SchemaMetadata {
  schema: string;
  tables: string[];
}

interface DatabaseMetadata {
  database: string;
  tables?: string[];
  schemas?: SchemaMetadata[];
}

interface OperationsPageProps {
  userData: UserData;
}

export interface UserData {
  left: {
    engine: string;
    database: string;
    schema: string;
    table: string;
  };
  right: {
    engine: string;
    database: string;
    schema: string;
    table: string;
  };
}

const App: React.FC = () => {

  //const navigate = useNavigate();

  const [firstState, setFirstState] = useState({
    selectedEngine: '',
    selectedDatabase: '',
    selectedSchema: '',
    selectedTable: '',
    databases: [] as string[],
    schemas: [] as string[],
    tables: [] as string[],
  });

  const [secondState, setSecondState] = useState({
    selectedEngine: '',
    selectedDatabase: '',
    selectedSchema: '',
    selectedTable: '',
    databases: [] as string[],
    schemas: [] as string[],
    tables: [] as string[],
  });

  let mysqlMetadata: DatabaseMetadata[] = [];
  let snowflakeMetadata: DatabaseMetadata[] = [];
  let postgresMetadata: DatabaseMetadata[] = [];

  const fetchData = async (engine: string) => {
    let metadata: DatabaseMetadata[] = [];
    if (['mysql', 'snowflake', 'postgres'].includes(engine)) {
      try {
        const response = await axios.get(`http://localhost:3000/metadata?source=${engine}`);
        metadata = response.data.metadata;
      } catch (error) {}
    }
    return metadata;
  };

  const getEngineMetadata = async (engine: string): Promise<DatabaseMetadata[]> => {
    let metadata: DatabaseMetadata[] = [];
    switch (engine) {
      case 'mysql':
        if (mysqlMetadata.length === 0) {
          mysqlMetadata = await fetchData('mysql');
        }
        metadata = mysqlMetadata;
        break;
      case 'snowflake':
        if (snowflakeMetadata.length === 0) {
          snowflakeMetadata = await fetchData('snowflake');
        }
        metadata = snowflakeMetadata;
        break;
      case 'postgres':
        if (postgresMetadata.length === 0) {
          postgresMetadata = await fetchData('postgres');
        }
        metadata = postgresMetadata;
        break;
      default:
        break;
    }
    console.log(`Engine metadata for ${engine}:`, metadata);
    return metadata;
  };

  const handleEngineSelect = async (engine: string, side: 'first' | 'second') => {
    const stateSetter = side === 'first' ? setFirstState : setSecondState;
    stateSetter(prevState => ({ ...prevState, selectedEngine: engine }));
    resetDropdowns(side);
    const metadata = await fetchData(engine);
    stateSetter(prevState => ({ ...prevState, databases: metadata.map(item => item.database) }));
  };

  const resetDropdowns = (side: 'first' | 'second') => {
    const resetState = {
      selectedDatabase: '',
      selectedSchema: '',
      schemas: [],
      selectedTable: '',
      tables: [],
    };
    const stateSetter = side === 'first' ? setFirstState : setSecondState;
    stateSetter(prevState => ({ ...prevState, ...resetState }));
  };

  const handleDatabaseSelect = async (database: string, side: 'first' | 'second') => {
    const stateSetter = side === 'first' ? setFirstState : setSecondState;
  
    console.log(`Selected database for ${side} side:`, database);
  
    stateSetter(prevState => ({
      ...prevState,
      selectedDatabase: database,
    }));
  
    const selectedDb = (side === 'first' ? firstState : secondState).databases.find(db => db === database);
  
    console.log(`Found selected database for ${side} side:`, selectedDb);
  
    if (selectedDb) {
      const dbMetadata = await getEngineMetadata((side === 'first' ? firstState : secondState).selectedEngine);
      
      console.log(`Database metadata for ${selectedDb}:`, dbMetadata);
      
      if (dbMetadata) {
        if ((side === 'first' ? firstState : secondState).selectedEngine === 'mysql') {
          stateSetter(prevState => ({
            ...prevState,
            tables: (dbMetadata.find(item => item.database === selectedDb)?.tables || []),
          }));
        } else {
          stateSetter(prevState => ({
            ...prevState,
            schemas: (dbMetadata.find(item => item.database === selectedDb)?.schemas || []).map(schema => schema.schema) || [],
          }));
          resetSchemaAndTable(side);
        }
      }
    }
  };
  

  const resetSchemaAndTable = (side: 'first' | 'second') => {
    const stateSetter = side === 'first' ? setFirstState : setSecondState;
    stateSetter(prevState => ({ ...prevState, selectedSchema: '', selectedTable: '', tables: [] }));
  };

  const handleSchemaSelect = async (schema: string, side: 'first' | 'second') => {
    const stateSetter = side === 'first' ? setFirstState : setSecondState;
    stateSetter(prevState => ({ ...prevState, selectedSchema: schema }));
    const selectedDb = (side === 'first' ? firstState : secondState).databases.find(db => db === (side === 'first' ? firstState : secondState).selectedDatabase);
    if (selectedDb) {
      const dbMetadata = (await getEngineMetadata((side === 'first' ? firstState : secondState).selectedEngine)).find(item => item.database === selectedDb) as DatabaseMetadata;
      if (dbMetadata) {
        if ((side === 'first' ? firstState : secondState).selectedEngine === 'mysql') {
          stateSetter(prevState => ({ ...prevState, tables: dbMetadata.tables || [] }));
        } else {
          const selectedSchemaData = dbMetadata.schemas?.find(s => s.schema === schema);
          if (selectedSchemaData) {
            stateSetter(prevState => ({ ...prevState, tables: selectedSchemaData.tables || [] }));
          }
        }
      }
    }
  };

  const handleNextButtonClick = () => {
    const userData: UserData = {
      left: {
        engine: firstState.selectedEngine,
        database: firstState.selectedDatabase,
        schema: firstState.selectedSchema,
        table: firstState.selectedTable,
      },
      right: {
        engine: secondState.selectedEngine,
        database: secondState.selectedDatabase,
        schema: secondState.selectedSchema,
        table: secondState.selectedTable,
      },
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    //navigate('./operationsPage.tsx');
  };

  const OperationsPage: React.FC<OperationsPageProps> = ({ userData }) => {
    return (
        <div className="App">
          <h1>Select Data Sources to Compare</h1>
          <div className="dataSourceContainer">
            <div className="dataSourceSection">
              <h2>First Data Source</h2>
              <h3>Select Data source:</h3>
              <div className="dropdownWrapper">
                <EngineDropdown2 onSelect={(engine) => handleEngineSelect(engine, 'first')} />
              </div>
              <div className="dropdownWrapper">
                <h3>Select Database: </h3>
                <DatabaseDropdown
                  databases={firstState.databases}
                  onSelect={(database) => handleDatabaseSelect(database, 'first')}
                />
              </div>
              <div className="dropdownWrapper">
                <h3>Select Schema: </h3>
                <SchemaDropdown
                  schemas={firstState.schemas}
                  onSelect={(schema) => handleSchemaSelect(schema, 'first')}
                  disabled={firstState.selectedEngine === 'mysql'}
                />
              </div>
              <div className="dropdownWrapper">
                <h3>Select Table: </h3>
                <TableDropdown
                  tables={firstState.tables}
                  onSelect={(table) => setFirstState(prevState => ({ ...prevState, selectedTable: table }))}
                />
              </div>
            </div>
            <div className="dataSourceSection">
              <h2>Second Data Source</h2>
              <h3>Select Data source:</h3>
              <div className="dropdownWrapper">
                <EngineDropdown2 onSelect={(engine) => handleEngineSelect(engine, 'second')} />
              </div>
              <div className="dropdownWrapper">
                <h3>Select Database: </h3>
                <DatabaseDropdown
                  databases={secondState.databases}
                  onSelect={(database) => handleDatabaseSelect(database, 'second')}
                />
              </div>
              <div className="dropdownWrapper">
                <h3>Select Schema: </h3>
                <SchemaDropdown
                  schemas={secondState.schemas}
                  onSelect={(schema) => handleSchemaSelect(schema, 'second')}
                  disabled={secondState.selectedEngine === 'mysql'}
                />
              </div>
              <div className="dropdownWrapper">
                <h3>Select Table: </h3>
                <TableDropdown
                  tables={secondState.tables}
                  onSelect={(table) => setSecondState(prevState => ({ ...prevState, selectedTable: table }))}
                />
              </div>
            </div>
          </div>
          <button onClick={handleNextButtonClick}>Next</button>
        </div>
    );
  };

  const storedUserData = localStorage.getItem('userData');
  const initialUserData: UserData = storedUserData ? JSON.parse(storedUserData) : {
    left: {
      engine: '',
      database: '',
      schema: '',
      table: '',
    },
    right: {
      engine: '',
      database: '',
      schema: '',
      table: '',
    },
  };

return <OperationsPage userData={initialUserData} />;


};

export default App;