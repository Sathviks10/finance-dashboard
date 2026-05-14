"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  AreaChart,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  Moon,
  PieChart as PieChartIcon,
  Plus,
  ReceiptText,
  Sparkles,
  Sun,
  Trash2,
  WalletCards,
  LogOut
} from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import clsx from "clsx";

const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Salary",
  "Freelance",
  "Entertainment",
  "Health",
  "Other",
];

// Removed demo transactions

const chartColors = [
  "#0f766e",
  "#2563eb",
  "#7c3aed",
  "#d97706",
  "#be123c",
  "#0891b2",
  "#65a30d",
  "#9333ea",
  "#475569",
];

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const emptyForm = {
  title: "",
  amount: "",
  type: "expense",
  category: "",
  date: new Date().toISOString().slice(0, 10),
};

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchUserAndData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const userRes = await axios.get(`${API_URL}/api/auth/me`, config);
        setUser(userRes.data);

        const transRes = await axios.get(`${API_URL}/api/transactions`, config);
        setTransactions(transRes.data);
      } catch (error) {
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserAndData();
  }, [router]);

  const totals = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const expenses = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      income,
      expenses,
      balance: income - expenses,
      count: transactions.length,
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (filter === "all") return transactions;
    return transactions.filter((transaction) => transaction.type === filter);
  }, [filter, transactions]);

  const expensesByCategory = useMemo(() => {
    const grouped = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {});

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const monthlySummary = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const thisMonth = transactions.filter((transaction) => {
      const date = new Date(`${transaction.date}T00:00:00`);
      return date.getMonth() === month && date.getFullYear() === year;
    });
    const monthlyIncome = thisMonth
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const monthlyExpenses = thisMonth
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      label: now.toLocaleString("en-US", { month: "long", year: "numeric" }),
      income: monthlyIncome,
      expenses: monthlyExpenses,
      net: monthlyIncome - monthlyExpenses,
    };
  }, [transactions]);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setSuccess("");
  }

  function validateForm() {
    const nextErrors = {};
    const amount = Number(form.amount);

    if (!form.title.trim()) nextErrors.title = "Add a short title for this transaction.";
    if (!form.amount || Number.isNaN(amount) || amount <= 0) {
      nextErrors.amount = "Enter an amount greater than 0.";
    }
    if (!form.category) nextErrors.category = "Choose a category.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function addTransaction(event) {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const payload = {
        title: form.title.trim(),
        amount: Number(form.amount),
        type: form.type,
        category: form.category,
        date: form.date || emptyForm.date,
      };

      const res = await axios.post(`${API_URL}/api/transactions`, payload, config);
      setTransactions((current) => [res.data, ...current]);
      setForm({ ...emptyForm, type: form.type });
      setSuccess("Transaction added successfully.");
    } catch (error) {
      setErrors({ title: error.response?.data?.message || "Failed to add transaction" });
    }
  }

  async function deleteTransaction(id) {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/api/transactions/${id}`, config);
      setTransactions((current) => current.filter((transaction) => transaction._id !== id && transaction.id !== id));
    } catch (error) {
      alert("Failed to delete transaction");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center dark:bg-slate-950 dark:text-white">Loading...</div>;
  }

  const shellClass = darkMode ? "dark" : "";

  return (
    <main className={shellClass}>
      <div className="min-h-screen bg-[#f4f1ec] text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
          <header className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/15 dark:bg-white dark:text-slate-950">
                    <WalletCards size={25} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">FinPilot</h1>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Welcome, {user?.name || "User"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-900">
                    <Sparkles size={15} /> Live Data
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                    Your data is securely stored and synced.
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setDarkMode((current) => !current)}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun size={17} /> : <Moon size={17} />}
                  {darkMode ? "Light" : "Dark"}
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200"
                >
                  <LogOut size={17} /> Logout
                </button>
              </div>
            </div>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard title="Total Balance" value={currency.format(totals.balance)} icon={CircleDollarSign} tone="slate" />
            <SummaryCard title="Total Income" value={currency.format(totals.income)} icon={ArrowUpRight} tone="green" />
            <SummaryCard title="Total Expenses" value={currency.format(totals.expenses)} icon={ArrowDownRight} tone="rose" />
            <SummaryCard title="Transactions" value={totals.count.toString()} icon={ClipboardList} tone="blue" />
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(320px,420px)_1fr]">
            <TransactionForm
              form={form}
              errors={errors}
              success={success}
              onSubmit={addTransaction}
              onChange={updateForm}
            />
            <AnalyticsCard data={expensesByCategory} monthlySummary={monthlySummary} />
          </section>

          <TransactionsTable
            transactions={filteredTransactions}
            allCount={transactions.length}
            activeFilter={filter}
            onFilterChange={setFilter}
            onDelete={deleteTransaction}
          />
        </div>
      </div>
    </main>
  );
}

function SummaryCard({ title, value, icon: Icon, tone }) {
  const toneClass = {
    slate: "bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950",
    green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
    blue: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-200",
  };

  return (
    <article className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-3 text-2xl font-semibold tracking-normal text-slate-950 dark:text-white">{value}</p>
        </div>
        <div className={clsx("flex h-11 w-11 items-center justify-center rounded-2xl", toneClass[tone])}>
          <Icon size={21} />
        </div>
      </div>
    </article>
  );
}

function TransactionForm({ form, errors, success, onSubmit, onChange }) {
  return (
    <section className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Add Transaction</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Capture an income or expense in under a minute.
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-200">
          <Plus size={22} />
        </div>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <Field label="Title" error={errors.title}>
          <input
            value={form.title}
            onChange={(event) => onChange("title", event.target.value)}
            placeholder="Coffee with client"
            className="input"
          />
        </Field>

        <Field label="Amount" error={errors.amount}>
          <input
            value={form.amount}
            onChange={(event) => onChange("amount", event.target.value)}
            inputMode="decimal"
            placeholder="120"
            className="input"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Type">
            <select value={form.type} onChange={(event) => onChange("type", event.target.value)} className="input">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </Field>
          <Field label="Date">
            <input
              value={form.date}
              onChange={(event) => onChange("date", event.target.value)}
              type="date"
              className="input"
            />
          </Field>
        </div>

        <Field label="Category" error={errors.category}>
          <select value={form.category} onChange={(event) => onChange("category", event.target.value)} className="input">
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>

        {success ? (
          <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-900">
            {success}
          </p>
        ) : null}

        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-teal-700 px-4 text-sm font-semibold text-white shadow-lg shadow-teal-900/15 transition hover:-translate-y-0.5 hover:bg-teal-800"
        >
          <Plus size={18} /> Add Transaction
        </button>
      </form>
    </section>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-sm font-medium text-rose-600 dark:text-rose-300">{error}</span> : null}
    </label>
  );
}

function AnalyticsCard({ data, monthlySummary }) {
  return (
    <section className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Category Analytics</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            See where expenses are clustering during this temporary session.
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200">
          <PieChartIcon size={22} />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
        <div className="min-h-[300px] rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-100 dark:bg-slate-950 dark:ring-slate-800">
          {data.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={108} paddingAngle={4}>
                  {data.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => currency.format(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              icon={BarChart3}
              title="No expense insights yet"
              description="Add an expense or load demo data to reveal the category breakdown."
            />
          )}
        </div>

        <div className="rounded-3xl bg-slate-950 p-5 text-white dark:bg-slate-800">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <CalendarDays size={17} /> {monthlySummary.label}
          </div>
          <h3 className="mt-4 text-lg font-semibold">Monthly Summary</h3>
          <div className="mt-5 space-y-4">
            <SummaryLine label="Income" value={monthlySummary.income} positive />
            <SummaryLine label="Expenses" value={monthlySummary.expenses} />
            <div className="border-t border-white/10 pt-4">
              <SummaryLine label="Net flow" value={monthlySummary.net} positive={monthlySummary.net >= 0} prominent />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryLine({ label, value, positive, prominent }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={clsx("text-sm", prominent ? "font-semibold text-white" : "text-slate-300")}>{label}</span>
      <span className={clsx("font-semibold", positive ? "text-emerald-300" : "text-rose-300", prominent && "text-lg")}>
        {currency.format(value)}
      </span>
    </div>
  );
}

function TransactionsTable({ transactions, allCount, activeFilter, onFilterChange, onDelete }) {
  return (
    <section className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Transactions</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage the temporary list for this browser session.
          </p>
        </div>
        <div className="flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
          {["all", "income", "expense"].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onFilterChange(filter)}
              className={clsx(
                "h-10 rounded-xl px-4 text-sm font-semibold capitalize transition",
                activeFilter === filter
                  ? "bg-white text-slate-950 shadow-sm dark:bg-slate-700 dark:text-white"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {transactions.length ? (
        <div className="overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="hidden grid-cols-[1.4fr_1fr_0.9fr_0.8fr_auto] gap-4 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400 md:grid">
            <span>Details</span>
            <span>Category</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
            <span className="sr-only">Delete</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {transactions.map((transaction) => (
              <TransactionRow key={transaction._id || transaction.id} transaction={transaction} onDelete={onDelete} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={ReceiptText}
          title={allCount ? "No transactions match this filter" : "Your dashboard is ready"}
          description={
            allCount
              ? "Switch filters to see the rest of your current session."
              : "Add your first transaction or use demo data to explore the dashboard."
          }
        />
      )}
    </section>
  );
}

function TransactionRow({ transaction, onDelete }) {
  const isIncome = transaction.type === "income";

  return (
    <div className="grid gap-4 px-4 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/70 md:grid-cols-[1.4fr_1fr_0.9fr_0.8fr_auto] md:items-center md:px-5">
      <div className="flex items-center gap-3">
        <div
          className={clsx(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
            isIncome
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200"
              : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200"
          )}
        >
          {isIncome ? <BriefcaseBusiness size={18} /> : <ReceiptText size={18} />}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-950 dark:text-white">{transaction.title}</p>
          <p className="text-sm capitalize text-slate-500 dark:text-slate-400">{transaction.type}</p>
        </div>
      </div>

      <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        {transaction.category}
      </span>
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {new Date(`${transaction.date}T00:00:00`).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
      <span
        className={clsx(
          "text-left font-semibold md:text-right",
          isIncome ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"
        )}
      >
        {isIncome ? "+" : "-"}
        {currency.format(transaction.amount)}
      </span>
      <button
        type="button"
        onClick={() => onDelete(transaction._id || transaction.id)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:text-rose-200"
        aria-label={`Delete ${transaction.title}`}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-3xl bg-slate-50 px-6 py-10 text-center ring-1 ring-slate-100 dark:bg-slate-950 dark:ring-slate-800">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
        <Icon size={26} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}
