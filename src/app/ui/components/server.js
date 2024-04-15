const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const metadataFilePaths = {
  snowflake: 'http://localhost:3000/metadata?source=snowflake',
  mysql: 'http://localhost:3000/metadata?source=mysql' ,
  postgres: 'http://localhost:3000/metadata?source=postgres'
};

// Endpoint to fetch metadata
app.get('/metadata', (req, res) => {
  const { source } = req.query;

  const filePath = metadataFilePaths[source];

  if (!filePath) {
    return res.status(400).json({ error: 'Invalid source' });
  }

  fs.readFile(filePath, 'utf8', (err, jsonData) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Could not read file' });
    }

    try {
      const metadata = JSON.parse(jsonData);
      console.log('Read metadata:', metadata);
      res.json({ metadata });
    } catch (error) {
      console.error('Error parsing JSON data:', error);
      return res.status(500).json({ error: 'Error parsing JSON data' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
