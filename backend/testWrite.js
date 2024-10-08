const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'submissions.json');

fs.writeFile(dataFilePath, JSON.stringify({ test: 'data' }, null, 2), (err) => {
  if (err) {
    console.error('Error writing to submissions.json:', err);
  } else {
    console.log('Test write successful.');
  }
});
