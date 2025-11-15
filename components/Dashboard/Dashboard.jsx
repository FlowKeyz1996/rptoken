import React, { useState } from "react";
import Sidebar from "../Global/Sidebar";
import { FiMoon, FiSun } from "react-icons/fi";
import { useWeb3 } from "@/context/Web3Provider"; // ✅ use your Web3Provider

const Dashboard = () => {
  const { 
    contractInfo, 
    tokenBalances, 
    account, 
    isConnected,
    globalLoad 
  } = useWeb3(); // ✅ get all dynamic info

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

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

  const renderOverviewCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div className={cardClasses}>
        <h3 className={`text-lg font-medium ${secondaryTextColor}`}>
          Your $RP Balance
        </h3>
        <p className={`text-2xl font-bold mt-2 ${textColor}`}>
          {globalLoad ? "Loading..." : tokenBalances.usertbcBalance || "0"}
        </p>
      </div>
      <div className={cardClasses}>
        <h3 className={`text-lg font-medium ${secondaryTextColor}`}>
          Your ETH Balance
        </h3>
        <p className={`text-2xl font-bold mt-2 ${textColor}`}>
          {globalLoad ? "Loading..." : tokenBalances.userEthBalance || "0"}
        </p>
      </div>
      <div className={cardClasses}>
        <h3 className={`text-lg font-medium ${secondaryTextColor}`}>
          Total Tokens Sold
        </h3>
        <p className={`text-2xl font-bold mt-2 ${textColor}`}>
          {globalLoad ? "Loading..." : contractInfo.totalSold || "0"}
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewCards();
      case "transactions":
        const txs = JSON.parse(localStorage.getItem("tokenTransactions")) || [];
        return (
          <section
            className={`p-6 rounded-2xl shadow-md ${
              isDarkMode ? "bg-[#14101A]" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold text-purple-500 mb-4">
              Recent Transactions
            </h2>
            {txs.length > 0 ? (
              <ul className="divide-y divide-gray-700">
                {txs.map((tx, i) => (
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
      <aside className="w-64 border-r hidden md:block">
        <Sidebar
          activeTab={activeTab}
          onMenuSelect={setActiveTab}
          isDarkMode={isDarkMode}
        />
      </aside>

      <main className="flex-1 p-6 md:p-10">
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
