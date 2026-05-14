# FinPilot – Stateless Personal Finance Mini Dashboard

FinPilot is a modern stateless personal finance dashboard built using Next.js, React, Tailwind CSS, Recharts, and lucide-react. The application allows users to temporarily track income and expense transactions, view financial summaries, analyze spending by category, and interact with a clean finance SaaS-style dashboard.

This project was developed as part of the **Modern Application Development – CSD303A Assignment Part 2: Full Stack Application Mini Project**.

---

## Live Demo

Deployed Website:  
https://fin-pilot-mu.vercel.app/

---

## Project Overview

FinPilot is designed for users who want a quick and simple way to understand their income, expenses, balance, and spending patterns without creating an account or connecting a bank account.

The application works as a fully functional demo during the current browser session. All data is stored temporarily using React state and intentionally resets when the page is refreshed.

---

## Problem Statement

Many personal finance applications require user registration, bank account linking, databases, or complex setup before users can start tracking their money. This creates friction for users who only want to quickly test or understand a budgeting workflow.

FinPilot solves this by providing a lightweight, visually polished, and easy-to-use personal finance dashboard where users can add temporary income and expense transactions, view balance summaries, analyze spending categories, and explore financial insights without any login or persistent storage.

---

## Objectives

- To design a modern and responsive finance dashboard.
- To implement transaction creation, deletion, filtering, and summary calculations.
- To provide visual spending analysis using charts.
- To demonstrate frontend development using React and Next.js.
- To simulate temporary financial data handling using React state.
- To deploy the application successfully using Vercel.

---

## Features Implemented

### Transaction Management

- Add income and expense transactions.
- Enter transaction title, amount, type, category, and date.
- Delete transactions from the current session.
- Filter transactions by:
  - All
  - Income
  - Expense

### Dashboard Summary

The dashboard displays:

- Total Balance
- Total Income
- Total Expenses
- Number of Transactions

### Category Analytics

- Expense breakdown by category.
- Donut chart visualization using Recharts.
- Category-wise spending summary.

### Monthly Summary

- Monthly income overview.
- Monthly expense overview.
- Net flow calculation.

### Demo Controls

- Load demo data.
- Clear all data.
- Demo mode note showing that data resets on refresh.

### User Experience

- Friendly form validation.
- Helpful empty states.
- Responsive layout for desktop and mobile.
- Clean card-based design.
- Modern finance SaaS-style interface.
- Optional dark mode toggle.

---

## Tech Stack

| Area | Technology Used |
|---|---|
| Framework | Next.js |
| Frontend Library | React |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | lucide-react |
| State Handling | React `useState` |
| Deployment | Vercel |

---

## Frontend Implementation

The frontend is built using Next.js and React. The UI is designed as a modern dashboard with reusable components, summary cards, charts, transaction forms, transaction filters, and responsive layouts.

Tailwind CSS is used for styling to create a clean, polished, and mobile-friendly interface.

Key frontend sections include:

- Header section
- Summary cards
- Add transaction form
- Expense category chart
- Monthly summary section
- Transaction list
- Empty states
- Demo data controls

---

## Backend / State Handling

This project is intentionally designed as a stateless prototype.

Instead of using a traditional backend server, FinPilot handles temporary application data using React state. This allows the application to behave like a working finance dashboard during the current browser session.

Data is managed using:

```js
useState()
