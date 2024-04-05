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
  const csv = `${data.amount},${data.date},${data.category},${data.description}\n`;
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
  const { amount, date, category, description } = req.body;
  const csvPath = path.join(__dirname, 'transactions.csv');

  if (!fs.existsSync(csvPath)) {
    fs.writeFileSync(csvPath, 'Amount,Date,Category,Description\n');
  }

  const transactionData = {
    amount: amount,
    date: date,
    category: category,
    description: description
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

    for (let i = 1; i < lines.length; i++) {
      const [amount, date, category, description] = lines[i].split(',');
      transactions.push({ amount, date, category, description });
    }

    res.json(transactions);
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});