import React from "react";

const BlockchainFeatures = ({ isDarkMode }) => {
  const features = [
    {
      title: "Real Use Cases",
      text: "Pay rent, utilities, or buy groceries with $RP. Real-world utility for everyday needs.",
      img: "https://example.com/realuse.png",
    },
    {
      title: "Instant Airtime & Data",
      text: "Recharge your phone with one tap using crypto. Instant mobile top-ups worldwide.",
      img: "https://example.com/airtime.png",
    },
    {
      title: "Property Investments",
      text: "Fractional real estate ownership with blockchain. Invest in property with crypto.",
      img: "https://example.com/property.png",
    },
    {
      title: "Community Bidding Rewards",
      text: "Earn tokens via P2P interactions. Complete tasks and earn free RP rewards.",
      img: "https://example.com/community.png",
    },
  ];

  const bgColor = isDarkMode ? "bg-[#0E0B12]" : "bg-[#F5F7FA]";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const secondaryTextColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const cardBg = isDarkMode ? "bg-[#13101A]" : "bg-white/95";
  const cardBorder = isDarkMode ? "border-gray-800/30" : "border-gray-100";

  return (
    <div className={`w-full py-16 px-6 sm:px-10 lg:px-20 ${bgColor}`}>
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className={`text-4xl font-bold ${textColor}`}>Why Choose RP Token?</h2>
        <p className={`mt-2 max-w-2xl mx-auto text-lg ${secondaryTextColor}`}>
          RP Token is not just another token. It's a solution for millions of people in underserved regions who need crypto to work in the real world.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="flex flex-wrap justify-center gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center text-center p-6 rounded-2xl border ${cardBorder} ${cardBg} w-[260px]`}
          >
            <img src={item.img} alt={item.title} className="w-20 h-20 mb-4 object-contain" />
            <h3 className={`text-xl font-semibold mb-2 ${textColor}`}>{item.title}</h3>
            <p className={`text-sm ${secondaryTextColor}`}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockchainFeatures;
