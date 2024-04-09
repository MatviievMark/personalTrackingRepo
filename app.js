const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

// this is a temporary solution, I know it's not the best way to do it
// but I'm not sure how to fix it
// for whatever reason, after the PUT is called the POST will append the data on the same line and this is to prevent that from happening
let wasEddited = false;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Function to append data to the CSV file
const appendToCSV = (data) => {
  // Another problem here that I need a space in order to properly pass it to the generate pie chart function
  // will be fixed later
  const csv = `${data.amount},${data.date},${data.category},${data.description}, ${data.type}\n`;
  fs.appendFile('transactions.csv', csv, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for handling POST requests
app.post('/transactions', (req, res) => {
  console.log('POST request received');
  const { amount, date, category, description, type } = req.body;
  const csvPath = path.join(__dirname, 'transactions.csv');

  // Check if the CSV file exists, create it if it doesn't
  if (!fs.existsSync(csvPath)) {
    fs.writeFileSync(csvPath, 'Amount,Date,Category,Description,Type\n');
  }

  // Read the existing CSV file
  fs.readFile(csvPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).json({ error: 'Error reading file' });
      return;
    }

    // Split the CSV data into an array of lines
    const lines = data.trim().split('\n');
    if (wasEddited) {
      // Check if the last line is empty
      const lastLine = lines[lines.length - 1].trim();
      if (lastLine !== '') {
        fs.appendFileSync(csvPath, '\n');
      }
    }

    const transactionData = {
      amount: amount,
      date: date,
      category: category,
      description: description,
      type: type
    };

    appendToCSV(transactionData);

    res.status(201).json({ message: 'Transaction added successfully!' });
    wasEddited = false;
  });
});

// Route for handling GET requests
app.get('/transactions', (req, res) => {
  const csvFilePath = path.join(__dirname, 'transactions.csv');

  fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).json({ error: 'Error reading file' });
      return;
    }

    if (!data.trim()) {
      res.json([]);
      return;
    }

    const lines = data.trim().split('\n');
    const transactions = [];

    const headerLine = lines[0].toLowerCase(); 
    const startIndex = headerLine === 'amount,date,category,description' ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const [amount, date, category, description, type] = lines[i].split(',');
      transactions.push({ amount, date, category, description, type });
    }

    res.json(transactions);
  });
});

// Route for handling DELETE requests
app.delete('/transactions/:id', (req, res) => {
  console.log('DELETE request received')
  const transactionsId = req.params.id;
  const csvFilePath = path.join(__dirname, 'transactions.csv');

  fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err); 
      res.status(500).json({ error: 'Error reading file' });
      return;
    }


    const lines = data.trim().split('\n');
    const updatedLines = lines.filter((line, index) => index !== parseInt(transactionsId));

    fs.writeFile(csvFilePath, updatedLines.join('\n'), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        res.status(500).json({ error: 'Error writing file' });
        return;
      }

      res.json({ message: 'Transaction deleted successfully!' });
      });
    });
});

// Route for handling edit requests
app.put('/transactions/:id', (req, res) => {
  wasEddited = true;
  console.log('PUT request received');
  const transactionId = req.params.id;
  const { amount, date, category, description, type } = req.body;
  const csvFilePath = path.join(__dirname, 'transactions.csv');

  fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).json({ error: 'Error reading file' });
      return;
    }

    const lines = data.trim().split('\n');
    const updatedLines = lines.map((line, index) => {
      if (index === parseInt(transactionId)) {
        return `${amount},${date},${category},${description},${type}`;
      }
      return line;
    });

    fs.writeFile(csvFilePath, updatedLines.join('\n'), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        res.status(500).json({ error: 'Error writing file' });
        return;
      }

      res.json({ message: 'Transaction updated successfully' });
    });
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});