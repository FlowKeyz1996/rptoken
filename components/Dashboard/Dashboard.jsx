"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../Global/Sidebar";
import { FiMoon, FiSun } from "react-icons/fi";

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [totalTokensSold, setTotalTokensSold] = useState(0);
  const [topBuyers, setTopBuyers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      const prefersDark = storedTheme === "dark";
      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }

    const data = JSON.parse(localStorage.getItem("tokenTransactions") || "[]");
    setTransactions(data);

    if (data.length > 0) {
      const total = data.reduce((sum, tx) => sum + parseFloat(tx.amountOut), 0);
      setTotalTokensSold(total);

      const buyerMap = {};
      data.forEach((tx) => {
        if (tx.transactionType === "BUY") {
          buyerMap[tx.user] =
            (buyerMap[tx.user] || 0) + parseFloat(tx.amountOut);
        }
      });

      const sortedBuyers = Object.entries(buyerMap)
        .map(([address, total]) => ({ address, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      setTopBuyers(sortedBuyers);
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

  // 🔄 Render different content based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <section
            className={`p-6 rounded-2xl shadow-md transition-all duration-300 ${
              isDarkMode ? "bg-[#14101A]" : "bg-white"
            }`}
          >
            <h2 className="text-2xl font-semibold text-purple-500 mb-6 text-center">
              Token Sales Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-8">
              <div
                className={`p-5 rounded-xl shadow ${
                  isDarkMode ? "bg-[#1B1723]" : "bg-gray-100"
                }`}
              >
                <h3 className="text-lg font-medium text-gray-400">
                  Total Transactions
                </h3>
                <p className="text-2xl font-bold mt-2 text-gray-100">
                  {transactions.length}
                </p>
              </div>

              <div
                className={`p-5 rounded-xl shadow ${
                  isDarkMode ? "bg-[#1B1723]" : "bg-gray-100"
                }`}
              >
                <h3 className="text-lg font-medium text-gray-400">
                  Total Tokens Sold
                </h3>
                <p className="text-2xl font-bold mt-2 text-gray-100">
                  {totalTokensSold.toFixed(2)}
                </p>
              </div>

              <div
                className={`p-5 rounded-xl shadow ${
                  isDarkMode ? "bg-[#1B1723]" : "bg-gray-100"
                }`}
              >
                <h3 className="text-lg font-medium text-gray-400">
                  Unique Buyers
                </h3>
                <p className="text-2xl font-bold mt-2 text-gray-100">
                  {new Set(transactions.map((tx) => tx.user)).size}
                </p>
              </div>
            </div>
          </section>
        );

      case "transactions":
        return (
          <section
            className={`p-6 rounded-2xl shadow-md ${
              isDarkMode ? "bg-[#14101A]" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold text-purple-500 mb-4">
              Recent Transactions
            </h2>
            {transactions.length > 0 ? (
              <ul className="divide-y divide-gray-700">
                {transactions.map((tx, i) => (
                  <li key={i} className="py-2 text-sm">
                    {tx.transactionType} — {tx.amountOut} Tokens —{" "}
                    {tx.user.slice(0, 6)}...{tx.user.slice(-4)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No transactions yet.</p>
            )}
          </section>
        );

      case "buyers":
        return (
          <section
            className={`p-6 rounded-2xl shadow-md ${
              isDarkMode ? "bg-[#14101A]" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold text-purple-400 mb-4">
              🏆 Top Buyers
            </h2>
            {topBuyers.length > 0 ? (
              <ul className="space-y-3">
                {topBuyers.map((buyer, index) => (
                  <li
                    key={index}
                    className={`flex justify-between items-center p-4 rounded-lg ${
                      isDarkMode ? "bg-[#1B1723]" : "bg-gray-100"
                    }`}
                  >
                    <span className="font-mono text-gray-300">
                      {buyer.address.slice(0, 6)}...{buyer.address.slice(-4)}
                    </span>
                    <span className="font-semibold text-gray-100">
                      {buyer.total.toFixed(2)} Tokens
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No buyers yet.</p>
            )}
          </section>
        );

      case "settings":
        return (
          <section
            className={`p-6 rounded-2xl shadow-md ${
              isDarkMode ? "bg-[#14101A]" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold text-purple-500 mb-4">
              Settings
            </h2>
            <p>Settings options will be added here later.</p>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen flex transition-colors duration-500 ${
        isDarkMode ? "bg-[#0E0B12] text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <aside className="w-64 border-r hidden md:block">
        <Sidebar
          activeTab={activeTab}
          onMenuSelect={setActiveTab}
          isDarkMode={isDarkMode}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            RPToken Dashboard
          </h1>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>

        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
