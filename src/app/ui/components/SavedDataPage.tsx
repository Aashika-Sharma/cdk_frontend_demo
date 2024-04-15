// SavedDataPage.tsx

import React, { useEffect, useState } from 'react';

const SavedDataPage: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Retrieve userData from localStorage
    const storedData = localStorage.getItem('userData');
    
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Saved Data</h1>
      <h2>Left Side</h2>
      <p>Engine: {userData.left.engine}</p>
      <p>Database: {userData.left.database}</p>
      <p>Schema: {userData.left.schema}</p>
      <p>Table: {userData.left.table}</p>

      <h2>Right Side</h2>
      <p>Engine: {userData.right.engine}</p>
      <p>Database: {userData.right.database}</p>
      <p>Schema: {userData.right.schema}</p>
      <p>Table: {userData.right.table}</p>
    </div>
  );
};

export default SavedDataPage;
