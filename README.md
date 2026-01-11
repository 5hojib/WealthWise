# Wealth Tracker

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

A personal finance tracker to manage your income, expenses, and debts.

## Deploy to Render

Click the "Deploy to Render" button above to deploy this application to Render. You will need to provide your MongoDB connection string during the deployment process.

## Run Locally with Docker

**Prerequisites:** Docker

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/wealth-tracker.git
    cd wealth-tracker
    ```

2.  **Create an environment file:**
    Create a file named `.env` inside the `backend` directory and add your MongoDB connection string:
    ```
    MONGODB_URL=your_mongodb_connection_string
    ```
    **Note:** The application will not run without this file.

3.  **Build and run the Docker container:**
    ```bash
    docker build -t wealth-tracker .
    docker run -p 8000:8000 -v ./backend:/app/backend wealth-tracker
    ```

4.  **Access the application:**
    Open your browser and navigate to `http://localhost:3000`. The frontend development server will proxy requests to the backend.
