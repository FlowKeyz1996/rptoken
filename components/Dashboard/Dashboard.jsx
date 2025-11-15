// Dashboard.js
import React, { useState } from "react";
import Sidebar from "../Global/Sidebar";
import { FiMoon, FiSun, FiHome, FiMenu } from "react-icons/fi";
import Link from "next/link";
import { useWeb3 } from "@/context/Web3Provider";

const Dashboard = () => {
  const {
    contractInfo,
    tokenBalances,
    account,
    isConnected,
    globalLoad,
    transactions, // REAL on-chain transactions
  } = useWeb3();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // 🔥 DARK MODE
  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

  const textColor = isDarkMode ? "text-gray-100" : "text-gray-900";
  const secondaryTextColor = isDarkMode ? "text-gray-400" : "text-gray-500";

  const cardClasses = `p-6 rounded-xl shadow transition-all duration-300 ${
    isDarkMode ? "bg-[#1B1723]" : "bg-white"
  }`;

  // 🔥 OVERVIEW CARDS
  const renderOverviewCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div className={cardClasses}>
        <h3 className={`text-lg font-medium ${secondaryTextColor}`}>Your $RP Balance</h3>
        <p className={`text-2xl font-bold mt-2 ${textColor}`}>
          {globalLoad ? "Loading..." : tokenBalances.usertbcBalance || "0"}
        </p>
      </div>

      <div className={cardClasses}>
        <h3 className={`text-lg font-medium ${secondaryTextColor}`}>Your ETH Balance</h3>
        <p className={`text-2xl font-bold mt-2 ${textColor}`}>
          {globalLoad ? "Loading..." : tokenBalances.userEthBalance || "0"}
        </p>
      </div>

      <div className={cardClasses}>
        <h3 className={`text-lg font-medium ${secondaryTextColor}`}>Total Tokens Sold</h3>
        <p className={`text-2xl font-bold mt-2 ${textColor}`}>
          {globalLoad ? "Loading..." : contractInfo.totalSold || "0"}
        </p>
      </div>
    </div>
  );

  // 🔥 TRANSACTIONS TAB
  const renderTransactions = () => (
    <section
      className={`p-6 rounded-2xl shadow-md ${
        isDarkMode ? "bg-[#14101A]" : "bg-white"
      }`}
    >
      <h2 className="text-xl font-semibold text-purple-500 mb-4">
        Recent Transactions
      </h2>

      {transactions && transactions.length > 0 ? (
        <ul className="divide-y divide-gray-700">
          {transactions.map((tx, i) => (
            <li key={i} className="py-2 text-sm">
              {tx.buyer.slice(0, 6)}...{tx.buyer.slice(-4)} bought{" "}
              <span className="font-semibold">{tx.tokensBought}</span> $RP —{" "}
              <a
                href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                View
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No transactions yet.</p>
      )}
    </section>
  );

  // 🔥 ACTIVE TAB CONTENT
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewCards();
      case "transactions":
        return renderTransactions();
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
      {/* DESKTOP SIDEBAR */}
      <aside className="w-64 border-r hidden md:block">
        <Sidebar
          activeTab={activeTab}
          onMenuSelect={setActiveTab}
          isDarkMode={isDarkMode}
        />
      </aside>

      {/* MOBILE SIDEBAR OVERLAY */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20"></div>
      )}

      {/* MOBILE SLIDE-IN SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-30 transform ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:hidden`}
      >
        <Sidebar
          activeTab={activeTab}
          onMenuSelect={(tab) => {
            setActiveTab(tab);
            setMobileSidebarOpen(false);
          }}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 pb-24">
        <div className="flex justify-between items-center mb-8">
          {/* MOBILE MENU BTN */}
          <button
            className="md:hidden p-2 rounded-lg bg-[#1B1723] text-white shadow"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <FiMenu size={22} />
          </button>

          {/* PAGE TITLE */}
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 text-center flex-1">
            RPToken Dashboard
          </h1>

          {/* DARK MODE TOGGLE */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow"
          >
            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>

        {renderContent()}
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div
        className={`fixed bottom-0 left-0 w-full py-4 px-6 flex justify-between items-center md:hidden shadow-xl ${
          isDarkMode ? "bg-[#1B1723]" : "bg-white"
        }`}
      >
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 text-center ${
            activeTab === "overview"
              ? "text-purple-500 font-semibold"
              : "text-gray-400"
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex-1 text-center ${
            activeTab === "transactions"
              ? "text-purple-500 font-semibold"
              : "text-gray-400"
          }`}
        >
          Transactions
        </button>

        {/* BACK HOME */}
        <Link
          href="/"
          className="flex-1 text-center text-blue-500 font-semibold"
        >
          <FiHome size={22} className="mx-auto" />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
