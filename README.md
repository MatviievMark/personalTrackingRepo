# Personal Finance Tracker

The Personal Finance Tracker is a web-based application that allows users to track their income and expenses, categorize transactions, and generate financial reports. It provides a user-friendly interface for managing personal finances and gaining insights into spending habits.

## Features

- User Registration and Authentication:
  - Users can create a new account by providing a username and password.
  - Existing users can log in using their credentials to access their personalized financial data.
  - User data is securely stored and authenticated using industry-standard practices.

- Transaction Management:
  - Users can add, edit, and delete transactions (income and expenses).
  - Each transaction includes details such as amount, date, category, description, and type (income or expense).
  - Transactions are associated with specific user accounts to ensure data privacy and separation.

- Categorization:
  - Users can assign categories to transactions for better organization and analysis.
  - Default categories are provided, and users can create custom categories as needed.

- Reporting and Visualization:
  - The application generates visual reports and charts to provide insights into income, expenses, and spending patterns.
  - Users can view summaries and breakdowns of their financial data by category and time period.
  - Pie charts are used to represent the distribution of income and expenses across different categories.

- Data Persistence:
  - User data, including transactions and categories, is stored in a database for persistent storage.
  - The application uses a CSV file as a simple database to store and retrieve financial data.

## Technologies Used

- Front-end:
  - HTML, CSS, and JavaScript for building the user interface.
  - Fetch API for making HTTP requests to the server.
  - Chart.js library for generating interactive charts and visualizations.

- Back-end:
  - Node.js and Express.js for creating the server-side application.
  - CSV file as a simple database for storing and retrieving financial data.

- Other Tools:
  - Git and GitHub for version control and collaboration.
  - npm (Node Package Manager) for managing project dependencies.

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/MatviievMark/personalTrackingRepo.git
   ```

2. Install the dependencies:

   ```
   cd personal-finance-tracker
   npm install
   ```

3. Start the application:

   ```
   npm start
   ```

4. Open your web browser and visit `http://localhost:3000` to access the application.

## Usage

1. Register a new account or log in with an existing account.
2. Once logged in, you will be directed to the main dashboard.
3. Use the provided form to add new transactions by specifying the amount, date, category, description, and type (income or expense).
4. View the list of transactions displayed in a table format.
5. Edit or delete transactions as needed using the corresponding buttons.
6. Use the search and filter options to find specific transactions based on category, date range, or type.
7. Click on the "Generate Report" button to view visual reports and charts summarizing your income and expenses.
8. Explore the pie charts to understand the distribution of income and expenses across different categories.
9. Log out of the application when you're done.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive messages.
4. Push your changes to your forked repository.
5. Submit a pull request detailing your changes.

Please ensure that your code follows the project's coding conventions and includes appropriate documentation.

## License

This project is licensed under the [MIT License](LICENSE).