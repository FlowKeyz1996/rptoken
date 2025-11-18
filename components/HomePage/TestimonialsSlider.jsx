import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const TestimonialsSlider = ({ isDarkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // COLORS & STYLE SYSTEM (MATCHING YOUR SAMPLE)
  const bgColor = isDarkMode ? "bg-[#0E0B12]" : "bg-[#F5F7FA]";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const secondaryTextColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const cardBg = isDarkMode ? "bg-[#13101A]" : "bg-white";
  const cardBorder = isDarkMode ? "border-gray-800/40" : "border-gray-200";

  const roadmap = [
    {
      quarter: "Q4 2024",
      title: "Foundation & Launch",
      text: "Website launch, whitepaper release, and smart contract development.",
    },
    {
      quarter: "Q3 2025",
      title: "Presale & Community",
      text: "Token presale launch and community building initiatives.",
    },
    {
      quarter: "Q3 2025",
      title: "Platform Development",
      text: "Mobile app beta and core payment infrastructure development.",
    },
    {
      quarter: "Q4 2025",
      title: "Exchange Listings",
      text: "Major DEX and CEX listings with liquidity pool establishment.",
    },
    {
      quarter: "Q1 2026",
      title: "Real-World Integration",
      text: "Utility payment partnerships and mobile top-up service launch.",
    },
  ];

  return (
    <div ref={ref} className={`w-full py-20 px-6 sm:px-10 lg:px-20 ${bgColor}`}>
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className={`text-4xl font-bold ${textColor}`}>Development Roadmap</h2>
        <p className={`mt-3 max-w-2xl mx-auto text-lg ${secondaryTextColor}`}>
          Our strategic plan to deliver real-world crypto payment solutions step by step.
        </p>
      </motion.div>

      {/* TIMELINE */}
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Vertical Line */}
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 h-full w-[3px] bg-gray-300 dark:bg-gray-700"></div>

        {/* Roadmap Items */}
        <div className="flex flex-col gap-20">
          {roadmap.map((item, i) => {
            const isLeft = i % 2 === 0;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.2, duration: 0.7 }}
                className={`relative flex items-center ${
                  isLeft ? "justify-start" : "justify-end"
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <div className="w-4 h-4 rounded-full bg-[#8877D8] border-4 border-white dark:border-[#0E0B12] shadow"></div>
                </div>

                {/* Card */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`
                    ${cardBg} border ${cardBorder}
                    w-[380px] md:w-[430px] 
                    rounded-2xl px-6 py-6 shadow-md
                  `}
                  style={{
                    marginLeft: isLeft ? "0" : "auto",
                    marginRight: isLeft ? "auto" : "0",
                  }}
                >
                  <p className="text-sm bg-[#EDEBFF] dark:bg-[#1A1726] text-[#8877D8] font-semibold px-3 py-1 rounded-full w-fit mb-3">
                    {item.quarter}
                  </p>

                  <h3 className={`text-xl font-semibold mb-2 ${textColor}`}>
                    {item.title}
                  </h3>

                  <p className={`text-sm leading-relaxed ${secondaryTextColor}`}>
                    {item.text}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSlider;
