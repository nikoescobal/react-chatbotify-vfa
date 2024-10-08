// backend/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json()); // Use express.json() instead of bodyParser

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Route to handle form submissions
app.post('/submit', (req, res) => {
  const formData = req.body;
  console.log('Form Data Received:', formData);

  // Validate formData
  if (!Array.isArray(formData.services)) {
    console.error('Invalid data: services should be an array');
    return res.status(400).send('Invalid data: services should be an array');
  }

  // Path to the data file
  const dataFilePath = path.join(__dirname, 'submissions.json');
  console.log('Data file path:', dataFilePath);

  // Directly write formData to the file
  fs.writeFile(dataFilePath, JSON.stringify([formData], null, 2), (err) => {
    if (err) {
      console.error('Error writing to submissions.json:', err);
      return res.status(500).send('Internal Server Error');
    } else {
      console.log('Submission saved successfully.');
      return res.status(200).send('Data received and saved');
    }
  });
});
