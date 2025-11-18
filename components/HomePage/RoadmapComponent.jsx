import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FaBolt,
  FaMobileAlt,
  FaBuilding,
  FaShoppingCart,
  FaCoins,
  FaUsers,
} from "react-icons/fa";

const RoadmapComponent = ({ isDarkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const bgColor = isDarkMode ? "bg-[#0E0B12]" : "bg-[#F5F7FA]";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const secondaryTextColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const cardBg = isDarkMode ? "bg-[#13101A]" : "bg-white";
  const cardBorder = isDarkMode ? "border-gray-800/40" : "border-gray-200";

  const applications = [
    {
      title: "Utility Payments",
      text: "Pay electricity, water, gas, and internet bills directly with RP tokens across 50+ countries.",
      icon: <FaBolt size={40} />,
    },
    {
      title: "Mobile Top-ups",
      text: "Instantly recharge mobile credit and data plans for any network worldwide with instant delivery.",
      icon: <FaMobileAlt size={40} />,
    },
    {
      title: "Real Estate",
      text: "Fractional property investments and rental payments powered by blockchain technology.",
      icon: <FaBuilding size={40} />,
    },
    {
      title: "E-commerce",
      text: "Shop at partner merchants and online stores with seamless RP token integration.",
      icon: <FaShoppingCart size={40} />,
    },
    {
      title: "DeFi Staking",
      text: "Earn passive income through staking pools and liquidity provision programs.",
      icon: <FaCoins size={40} />,
    },
    {
      title: "P2P Rewards",
      text: "Earn tokens through community tasks, referrals, and peer-to-peer interactions.",
      icon: <FaUsers size={40} />,
    },
  ];

  return (
    <div className={`w-full py-16 px-6 sm:px-10 lg:px-20 ${bgColor}`} ref={ref}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className={`text-4xl font-bold ${textColor}`}>
          Real-World Applications
        </h2>
        <p className={`mt-3 max-w-2xl mx-auto text-lg ${secondaryTextColor}`}>
          RP Token powers practical, everyday transactions across multiple industries and use cases.
        </p>
      </motion.div>

      {/* Application Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {applications.map((app, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            className={`flex flex-col items-center text-center p-6 rounded-2xl border ${cardBorder} ${cardBg} shadow-md cursor-pointer transform transition w-64`} // Reduced width
          >
            <div className="mb-4 text-[#8877D8]">{app.icon}</div>
            <h3 className={`text-xl font-semibold mb-2 ${textColor}`}>
              {app.title}
            </h3>
            <p className={`text-sm ${secondaryTextColor}`}>{app.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapComponent;
