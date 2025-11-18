import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  FaCoins,
  FaFire,
  FaGlobe,
  FaBolt,
  FaUsers,
  FaLock,
  FaHandshake,
} from "react-icons/fa";

const TokenomicsComponent = ({ isDarkMode }) => {
  const distributions = [
    { title: "Presale", amount: "2,000,000,000 RP", percent: 40, color: "#8B5CF6" },
    { title: "Airdrop & Community", amount: "1,000,000,000 RP", percent: 20, color: "#6366F1" },
    { title: "Staking & Ecosystem", amount: "500,000,000 RP", percent: 10, color: "#10B981" },
    { title: "Liquidity & Exchanges", amount: "500,000,000 RP", percent: 10, color: "#F59E0B" },
    { title: "Team & Advisors", amount: "500,000,000 RP", percent: 10, color: "#EF4444" },
    { title: "Marketing & Partnerships", amount: "250,000,000 RP", percent: 5, color: "#3B82F6" },
    { title: "Treasury & DAO Reserve", amount: "250,000,000 RP", percent: 5, color: "#EC4899" },
  ];

  const features = [
    { title: "Total Supply", text: "5B", icon: <FaCoins size={40} /> },
    { title: "Vesting Period", text: "3 mo cliff + 5%/mo", icon: <FaLock size={40} /> },
    { title: "Max Staking APY", text: "12%", icon: <FaBolt size={40} /> },
    { title: "Blockchain Networks", text: "3", icon: <FaGlobe size={40} /> },
    { title: "Fixed Supply", text: "No inflation, capped at 5B", icon: <FaCoins size={40} /> },
    { title: "Burn Mechanism", text: "Quarterly burns from fees", icon: <FaFire size={40} /> },
    { title: "Multi-Chain", text: "ETH • BSC • Solana", icon: <FaHandshake size={40} /> },
    { title: "Instant Rewards", text: "Immediate staking rewards", icon: <FaUsers size={40} /> },
  ];

  // Match the BlockchainFeatures styling
  const bgColor = isDarkMode ? "bg-[#0E0B12]" : "bg-[#F5F7FA]";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";
  const cardBg = isDarkMode ? "bg-[#13101A]" : "bg-white/95";
  const cardBorder = isDarkMode ? "border-gray-800/30" : "border-gray-200";

  return (
    <div className={`w-full py-16 px-6 sm:px-10 lg:px-20 ${bgColor}`}>
      
      {/* Section Header */}
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <h2 className={`text-4xl font-bold ${textColor}`}>Token Distribution</h2>
        <p className={`mt-3 text-lg ${secondaryText}`}>
          Strategic allocation designed for sustainable growth, community empowerment, and long-term value creation.
        </p>
      </div>

      {/* PIE CHART */}
      <div className="max-w-4xl mx-auto w-full h-80 mb-14">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={distributions}
              dataKey="percent"
              nameKey="title"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ name, percent }) =>
                `${name} ${Math.round(percent)}%`
              }
            >
              {distributions.map((item, i) => (
                <Cell key={i} fill={item.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Distribution Text List */}
      <div className="max-w-3xl mx-auto mb-16">
        {distributions.map((item, index) => (
          <div
            key={index}
            className={`flex justify-between py-4 border-b ${cardBorder}`}
          >
            <div className={`flex items-center gap-2 font-semibold ${textColor}`}>
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></span>
              {item.title}
            </div>

            <div className={`${secondaryText}`}>{item.amount}</div>
            <div className="font-bold text-indigo-500">{item.percent}%</div>
          </div>
        ))}
      </div>

      {/* Feature Cards (final section) */}
      <div className="flex flex-wrap justify-center gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center p-6 w-[260px] rounded-2xl border ${cardBorder} ${cardBg} text-center`}
          >
            <div className="mb-4 text-indigo-500">{item.icon}</div>
            <h3 className={`text-xl font-semibold ${textColor} mb-2`}>
              {item.title}
            </h3>
            <p className={`text-sm ${secondaryText}`}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenomicsComponent;
