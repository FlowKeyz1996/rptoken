"use client";

import React from "react";

const Sidebar = ({ activeTab, onMenuSelect, isDarkMode }) => {
  const menuItems = [
    { id: "overview", label: "Overview" },
    { id: "transactions", label: "Transactions" },
    { id: "buyers", label: "Top Buyers" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div
      className={`h-full p-5 flex flex-col gap-3 ${
        isDarkMode ? "bg-[#14101A] text-gray-200" : "bg-white text-gray-800"
      }`}
    >
      <h2 className="text-xl font-bold mb-4">Dashboard Menu</h2>
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onMenuSelect(item.id)}
          className={`text-left px-4 py-2 rounded-lg transition-all duration-300 ${
            activeTab === item.id
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              : isDarkMode
              ? "hover:bg-[#1B1723]"
              : "hover:bg-gray-100"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
