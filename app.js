const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Function to append data to the CSV file
const appendToCSV = (data) => {
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
  const { amount, date, category, description, type } = req.body;
  const csvPath = path.join(__dirname, 'transactions.csv');

  if (!fs.existsSync(csvPath)) {
    fs.writeFileSync(csvPath, 'Amount,Date,Category,Description,Type\n');
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
  console.log('PUT request received')
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
        return `${amount},${date},${category},${description}, ${type}`;
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