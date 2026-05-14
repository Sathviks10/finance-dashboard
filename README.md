# FinPilot Full-Stack

FinPilot is a complete full-stack web application designed for personal finance tracking. It allows users to track income and expenses, view monthly summaries, and analyze their spending by category.

This project was transformed from a stateless Next.js frontend into a robust full-stack application.

## Tech Stack

*   **Frontend**: Next.js, Tailwind CSS, Recharts, Axios
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (via Mongoose)
*   **Authentication**: JSON Web Tokens (JWT)

## Project Structure

This is a monorepo containing two main directories:

*   `/frontend` - The Next.js web application.
*   `/backend` - The Node.js/Express REST API.

## Local Setup Instructions

### Prerequisites

*   Node.js installed on your machine.
*   MongoDB installed locally or a MongoDB Atlas connection string.

### 1. Database & Environment Variables

1.  Copy the `.env.example` file to `.env` in the root (or directly inside `/backend` and `/frontend`).
2.  Set your `MONGODB_URI` and `JWT_SECRET` in the backend `.env`.
3.  Set `NEXT_PUBLIC_API_URL` in the frontend `.env.local` to point to your backend (usually `http://localhost:5000`).

### 2. Backend Setup

1.  Open a terminal and navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The server will start on port 5000 (or the port defined in your `.env`).

### 3. Frontend Setup

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Next.js development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to `http://localhost:3000`.

## Features

*   **User Authentication**: Register and login securely. Each user's transactions are private.
*   **CRUD Operations**: Create, read, update, and delete transactions.
*   **Analytics**: View a monthly summary and pie chart of expenses by category.
*   **Responsive UI**: A beautifully designed frontend that works seamlessly on desktop and mobile.

## Deployment

### Backend (Render or Railway)
1. Push the repository to GitHub.
2. Connect your GitHub repository to Render/Railway.
3. Set the root directory to `backend`.
4. Add the necessary Environment Variables (`MONGODB_URI`, `JWT_SECRET`, etc.).
5. Deploy.

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel.
2. Set the root directory to `frontend`.
3. Add the Environment Variable `NEXT_PUBLIC_API_URL` pointing to your deployed backend URL.
4. Deploy.
