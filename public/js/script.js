document.addEventListener('DOMContentLoaded', function() {
const submitButton = document.querySelector('#transactionForm button[type="submit"]');

submitButton.addEventListener('click', handleSubmit);

const form = document.getElementById('transactionForm');
const messageDiv = document.getElementById('message');
let transactions = [];
let currentSortColumn = null; 
let currentSortOrder = 'asc';

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const amount = document.getElementById('amount').value;
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value;

  try {
    const response = await fetch('/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount, date, category, description, type })
    });

    if (response.ok) {
      messageDiv.textContent = 'Transaction added successfully!';
      form.reset();
    } else {
      messageDiv.textContent = 'Failed to add transaction.';
    }
  } catch (error) {
    console.error('Error:', error);
    messageDiv.textContent = 'An error occurred.';
  }
});

// Delete Transaction
async function deleteTransaction(event) {
  const transactionId = event.target.getAttribute('data-id');
    try {
      const response = await fetch(`/transactions/${transactionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAndDisplayTransactions();
      } else {
        messageDiv.textContent = 'Failed to delete transaction.';
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      messageDiv.textContent = 'An error occurred while deleting the transaction.';
    }
}
// editTransaction function
async function editTransaction(event) {
  const transactionId = event.target.getAttribute('data-id');
  const transaction = transactions[transactionId];

  document.getElementById('amount').value = transaction.amount;
  document.getElementById('date').value = transaction.date;
  document.getElementById('category').value = transaction.category;
  document.getElementById('description').value = transaction.description;
  document.getElementById('type').value = transaction.type;

  // Store the transactionId in a hidden field for later use
  let transactionIdField = document.querySelector('input[name="transactionId"]');
  if (!transactionIdField) {
    transactionIdField = document.createElement('input');
    transactionIdField.type = 'hidden';
    transactionIdField.name = 'transactionId';
    form.appendChild(transactionIdField);
  }
  transactionIdField.value = transactionId;

  // Change the form submission behavior to update the transaction
  submitButton.textContent = 'Update Transaction';
  submitButton.removeEventListener('click', handleSubmit);
  submitButton.addEventListener('click', handleUpdate);
}

async function handleUpdate(event) {
  event.preventDefault();

  const amount = document.getElementById('amount').value;
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value;
  const type = document.getElementById('type').value;
  const transactionId = document.querySelector('input[name="transactionId"]').value;

  console.log('Updating transaction:', transactionId);

  try {
    const response = await fetch(`/transactions/${transactionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount, date, category, description, type })
    });

    if (response.ok) {
      messageDiv.textContent = 'Transaction updated successfully!';
      form.reset();
      fetchAndDisplayTransactions();
      // Reset the form submission behavior
      submitButton.textContent = 'Add Transaction';
      submitButton.removeEventListener('click', handleUpdate);
      submitButton.addEventListener('click', handleSubmit);
      
      // Remove the transactionId field
      const transactionIdField = document.querySelector('input[name="transactionId"]');
      if (transactionIdField) {
        form.removeChild(transactionIdField);
      }
    } else {
      messageDiv.textContent = 'Failed to update transaction.';
    }
  } catch (error) {
    console.error('Error:', error);
    messageDiv.textContent = 'An error occurred.';
  }
}


// Display transactions 
function displayTransactions() {
  const tableBody = document.querySelector('#transactionsTable tbody');
    tableBody.innerHTML = '';

    transactions.forEach((transaction, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${transaction.amount}</td>
        <td>${transaction.date}</td>
        <td>${transaction.category}</td>
        <td>${transaction.description}</td>
        <td>${transaction.type}</td>
        <td>
          <button class="editButton" data-id="${index}">Edit</button>
          <button class="deleteButton" data-id="${index}">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    const editButtons = document.querySelectorAll('.editButton');
    editButtons.forEach((button) => {
      button.addEventListener('click', editTransaction);
    });
    
    const deleteButtons = document.querySelectorAll('.deleteButton');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', deleteTransaction);
    });
}


// Fetch transactions when the page loads
async function fetchAndDisplayTransactions() {
  try {
    const response = await fetch('/transactions');
    transactions = await response.json();
    displayTransactions();
    
  } catch (error) {
    console.error('Error fetching transactions:', error);
    messageDiv.textContent = 'An error occurred while fetching transactions.';
  }
}

// Sort transactions
function sortTransactions(column) {
  if(currentSortColumn === column) {
    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    currentSortColumn = column;
    currentSortOrder = 'asc';
  }
  transactions.sort((a, b) => {
    let comparison = 0;
    if(column === 'amount') {
      comparison = a.amount - b.amount;
    } else if(column === 'date') {
      comparison = new Date(a.date) - new Date(b.date);
    } else if(column === 'category') {
      comparison = a.category.localeCompare(b.category);  
    }
    return currentSortOrder === 'asc' ? comparison : comparison * -1;
  });
  displayTransactions();
}

// Event Lister for sort transactions 
const sortButtons = document.querySelectorAll('.sortButton');
sortButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const column = event.target.getAttribute('data-sort');
    sortTransactions(column);
  });

})

// Live Reload
async function handleSubmit(event) {
  event.preventDefault();

  const amount = document.getElementById('amount').value;
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value;
  const type = document.getElementById('type').value;

  try {
    const response = await fetch('/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount, date, category, description, type })
    });

    if (response.ok) {
      messageDiv.textContent = 'Transaction added successfully!';
      form.reset();
      fetchAndDisplayTransactions();
    } else {
      messageDiv.textContent = 'Failed to add transaction.';
    }
  } catch (error) {
    console.error('Error:', error);
    messageDiv.textContent = 'An error occurred.';
  }
}

// Call the fetchAndDisplayTransactions function when the page loads
window.addEventListener('load', fetchAndDisplayTransactions);

// Generate Pie Chart 
const generateChartButton = document.getElementById('generateChartButton');
generateChartButton.addEventListener('click', generatePieChart);

function generatePieChart() {
  const incomeData = {};
  const expenseData = {};

  transactions.forEach((transaction) => {
    const { category, amount, type } = transaction;
    const data = type === ' income' ? incomeData : expenseData;
    if (data[category]) {
      data[category] += parseFloat(amount);
    } else {
      data[category] = parseFloat(amount);
    }
  });

  createPieChart('incomeChart', incomeData, 'Income by Category');
  createPieChart('expenseChart', expenseData, 'Expenses by Category');
  displaySummary(incomeData, expenseData);
}

function createPieChart(chartId, data, title) {
  const labels = Object.keys(data);
  const value = Object.values(data);

  const chartData = {
    labels : labels,
    datasets : [{
      data : value,
      backgroundColor : getRandomColors(labels.length)
    },
  ],
  };

  const chartOptions = { 
    responsive: true,
    title: {
      display: true,
      text: title
    },
    plugins: { 
      datalabels: {
        formatter: (value, context) => {
          const percentage = ((value / context.chart.getDatasetMeta(0).total) * 100).toFixed(1);
          return `${percentage}%`;
        },
        color: '#fff',
        font: {
          weight: 'bold', 
          size: 14, 
        },
      },
    },
  };

  const ctx = document.getElementById(chartId).getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: chartData,
    options: chartOptions,
  });
};

function displaySummary(incomeData, expenseData) { 
  const totalIncome = Object.values(incomeData).reduce((total, amount) => total + amount, 0);
  const totalExpense = Object.values(expenseData).reduce((total, amount) => total + amount, 0);
  const totalLeft = totalIncome - totalExpense;
  
  const summaryElement = document.getElementById('summary');
  summaryElement.innerHTML = `
    <h3>Summary:</h3>
    <p>Total Income: $${totalIncome.toFixed(2)}</p>
    <p>Total Expense: $${totalExpense.toFixed(2)}</p>
    <p>Total Left: $${totalLeft.toFixed(2)}</p>
  `;
}


function getRandomColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const randomColor = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`;
    colors.push(randomColor);
  }
  return colors;
}
});