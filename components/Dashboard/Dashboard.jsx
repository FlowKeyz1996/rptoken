import React, { useState, useEffect } from "react";
import Sidebar from "../Global/Sidebar";
import { FiMoon, FiSun, FiHome, FiMenu } from "react-icons/fi";
import Link from "next/link";
import { useWeb3 } from "@/context/Web3Provider";

const Dashboard = () => {
  const { contractInfo, tokenBalances, globalLoad /*, transactions, exportCSV, topBuyers */ } = useWeb3();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  /** Overview Cards */
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

  /** Placeholder for admin-only sections */
  const renderAdminPlaceholder = (sectionName) => (
    <section className={`p-6 rounded-2xl shadow-md ${isDarkMode ? "bg-[#14101A]" : "bg-white"}`}>
      <h2 className="text-xl font-semibold text-purple-500 mb-4">{sectionName}</h2>
      <p className="text-gray-400">This section is for admin purposes only and will be added on mainnet.</p>
    </section>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewCards();
      case "transactions":
        return renderAdminPlaceholder("Transactions");
      case "topbuyers":
        return renderAdminPlaceholder("Top Buyers");
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-500 ${isDarkMode ? "bg-[#0E0B12] text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <aside className="w-64 border-r hidden md:block">
        <Sidebar activeTab={activeTab} onMenuSelect={setActiveTab} isDarkMode={isDarkMode} />
      </aside>

      {mobileSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20"></div>}

      <div
        className={`fixed top-0 left-0 h-full w-64 z-30 transform ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:hidden`}
      >
        <Sidebar activeTab={activeTab} onMenuSelect={(tab) => { setActiveTab(tab); setMobileSidebarOpen(false); }} isDarkMode={isDarkMode} />
      </div>

      <main className="flex-1 p-6 md:p-10 pb-24">
        <div className="flex justify-between items-center mb-8">
          <button className="md:hidden p-2 rounded-lg bg-[#1B1723] text-white shadow" onClick={() => setMobileSidebarOpen(true)}>
            <FiMenu size={22} />
          </button>

          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 text-center flex-1">
            RPToken Dashboard
          </h1>

          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow">
            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>

        {renderContent()}
      </main>

      <div className={`fixed bottom-0 left-0 w-full py-4 px-6 flex justify-between items-center md:hidden shadow-xl ${isDarkMode ? "bg-[#1B1723]" : "bg-white"}`}>
        <button onClick={() => setActiveTab("overview")} className={`flex-1 text-center ${activeTab === "overview" ? "text-purple-500 font-semibold" : "text-gray-400"}`}>
          Overview
        </button>
        <button onClick={() => setActiveTab("transactions")} className={`flex-1 text-center ${activeTab === "transactions" ? "text-purple-500 font-semibold" : "text-gray-400"}`}>
          Transactions
        </button>
        <button onClick={() => setActiveTab("topbuyers")} className={`flex-1 text-center ${activeTab === "topbuyers" ? "text-purple-500 font-semibold" : "text-gray-400"}`}>
          Top Buyers
        </button>
        <Link href="/" className="flex-1 text-center text-blue-500 font-semibold">
          <FiHome size={22} className="mx-auto" />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
