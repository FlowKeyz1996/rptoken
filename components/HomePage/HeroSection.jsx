import React, { useState, useEffect, useMemo, useRef } from "react";
import { FaEthereum } from "react-icons/fa";
import { SiTether } from "react-icons/si";
import { IoWalletOutline } from "react-icons/io5";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BsFillInfoCircleFill, BsCurrencyDollar } from "react-icons/bs";
import { RiUsdCircleFill } from "react-icons/ri";
import { CustomConnectButton } from "../index";
import { useWeb3 } from "@/context/Web3Provider";
import { ethers } from "ethers";

const TOKEN_NAME = process.env.NEXT_PUBLIC_TOKEN_NAME;
const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL;
const TOKEN_SUPPLY = process.env.NEXT_PUBLIC_TOKEN_SUPPLY;
const PER_TOKEN_USD_PRICE = process.env.NEXT_PUBLIC_PER_TOKEN_USD_PRICE;
const NEXT_PER_TOKEN_USD_PRICE =
  process.env.NEXT_PUBLIC_NEXT_PER_TOKEN_USD_PRICE;
const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;
const BLOCKCHAIN = process.env.NEXT_PUBLIC_BLOCKCHAIN;
const RPTOKEN_ADDRESS = process.env.NEXT_PUBLIC_RPTOKEN_ADDRESS 

const HeroSection = ({ isDarkMode, setIsReferralPopupOpen }) => {
  const {
    account,
    isConnected,
    contractInfo,
    tokenBalances,
    buyToken,
    addTokenToMetaMask,
    setSaleToken 
  } = useWeb3();

  const [selectedToken, setSelectedToken] = useState("ETH");
  const [inputAmount, setInputAmount] = useState(0);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [hasSufficientBalance, setHasSufficientBalance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAttemptedRegistration, setHasAttemptedRegistration] =
    useState(false);

  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animateRef = useRef(null);

  const setToken = () =>{
    setSaleToken(RPTOKEN_ADDRESS)
  }

  const calculateProgressPercentage = () => {
    if (!contractInfo?.totalSold || !contractInfo?.tbcBalance) {
      return 0;
    }
    const totalSold = parseFloat(contractInfo.totalSold);
    const tbcBalance = parseFloat(contractInfo.tbcBalance);
    const totalSupply = totalSold + tbcBalance;
    const percentage = (totalSold / totalSupply) * 100;
    return isNaN(percentage)
      ? 0
      : Math.min(parseFloat(percentage.toFixed(2)), 100);
  };

  const prices = useMemo(() => {
    const defaultEthPrice = contractInfo?.ethPrice;
    let ethPrice;
    try {
      if (contractInfo?.ethPrice) {
        if (
          typeof contractInfo.ethPrice === "object" &&
          contractInfo.ethPrice._isBigNumber
        ) {
          ethPrice = contractInfo.ethPrice;
        } else {
          ethPrice = ethers.utils.parseEther(
            contractInfo.ethPrice.toString()
          );
        }
      } else {
        ethPrice = ethers.utils.parseEther(defaultEthPrice);
      }
    } catch (error) {
      console.error(`Error parsing Price`, error);
      ethPrice = ethers.utils.parseEther(defaultEthPrice);
    }
    return { ethPrice };
  }, [contractInfo]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isConnected || !tokenBalances) {
      setHasSufficientBalance(false);
      return;
    }
    const lowTokenSupply = parseFloat(tokenBalances?.tbcBalance || "0") < 20;
    if (lowTokenSupply) {
      setHasSufficientBalance(false);
      return;
    }

    const inputAmountFloat = parseFloat(inputAmount) || 0;
    let hasBalance = false;
    switch (selectedToken) {
      case "ETH": {
        const ethBalance = parseFloat(tokenBalances?.userEthBalance || "0");
        hasBalance = ethBalance >= inputAmountFloat && inputAmountFloat > 0;
        break;
      }
      case "USDT": {
        // check USDT balance if provided by tokenBalances (property name may vary)
        const usdtBalance = parseFloat(tokenBalances?.userUsdtBalance || tokenBalances?.userUsdBalance || "0");
        hasBalance = usdtBalance >= inputAmountFloat && inputAmountFloat > 0;
        break;
      }
      default:
        hasBalance = false;
    }

    setHasSufficientBalance(hasBalance);
  }, [isConnected, inputAmount, selectedToken, tokenBalances]);

  const calculateTokenAmount = (amount, token) => {
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) return "0";
    let calculatedAmount;
    try {
      switch (token) {
        case "ETH":
          // Placeholder/approximation: multiply ETH amount by token rate (adjust as needed)
          // You had a tokensPerEth earlier in your other edits; keep this simple here
          calculatedAmount = parseFloat(amount) * 1000;
          break;
        case "USDT": {
          // If PER_TOKEN_USD_PRICE is set, calculate tokens = USDT amount / USD price per token
          const perTokenPrice = parseFloat(PER_TOKEN_USD_PRICE) || 0.01;
          calculatedAmount = parseFloat(amount) / perTokenPrice;
          break;
        }
        default:
          calculatedAmount = 0;
      }
    } catch (error) {
      console.error(`Error calculating token Amount`, error);
      calculatedAmount = 0;
    }
    return calculatedAmount.toFixed(2);
  };

  const handleAmountChange = (value) => {
    setInputAmount(value);
    setTokenAmount(calculateTokenAmount(value, selectedToken));
  };

  const handleTokenSelection = (token) => {
    setSelectedToken(token);
    setTokenAmount(calculateTokenAmount(inputAmount, token));
  };

  const executePurchase = async () => {
    if (!isConnected) {
      alert(`Please connect your wallet first`);
      return;
    }
    if (parseFloat(inputAmount) <= 0) {
      alert(`Amount must be greater than Zero`);
      return;
    }
    if (!hasSufficientBalance) {
      if (parseFloat(tokenBalances?.tbcBalance || "0") < 20) {
        alert(`insufficient token supply Please try again Later`);
      } else {
        alert(`insufficient ${selectedToken} balance`);
      }
      return;
    }
    try {
      let tx;
      switch (selectedToken) {
        case "ETH":
          tx = await buyToken(inputAmount);
          break;
        case "USDT":
          // For USDT you may need to call a different web3 method / approve ERC20, etc.
          // Here we call buyToken as a default (preserves existing logic) — replace with USDT-specific flow if needed.
          tx = await buyToken(inputAmount);
          break;
        default:
          alert(`Please select a token to purchase with`);
          return;
      }
      console.log(tx);
      console.log(
        `successfully Purchased ${tokenAmount} ${TOKEN_SYMBOL} tokens!`
      );
      setInputAmount("0");
      setTokenAmount("0");
    } catch (error) {
      console.error(`Error purchasing with ${selectedToken}`, error);
      alert(`Transaction Failed. Please Try again`);
    }
  };

  const getCurrentBalance = () => {
    if (!tokenBalances) return "0";
    switch (selectedToken) {
      case "ETH":
        return tokenBalances?.userEthBalance || "0";
      case "USDT":
        // Try common property names (userUsdtBalance, userUsdBalance)
        return tokenBalances?.userUsdtBalance || tokenBalances?.userUsdBalance || "0";
      default:
        return "0";
    }
  };

  const getButtonMessage = () => {
    if (inputAmount === "0" || inputAmount === "") {
      return "Enter Amount";
    }
    if (parseFloat(tokenBalances?.tbcBalance || "0") < 20) {
      return `Insufficient Token Supply`;
     
    }
     console.log(tokenBalances?.tbcBalance)
    return hasSufficientBalance
      ? `Buy ${TOKEN_SYMBOL}`
      : `Insufficient ${selectedToken} Balance`;
  };

  const getTokenIcon = (token) => {
    switch (token) {
      case "POL":
        return (
          <img
            src="/polygon.svg"
            className="w-5 h-5"
            alt="polygon"
          />
        );
      case "USDT":
        return <SiTether className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const bgColor = isDarkMode ? "bg-[#0E0B12]" : "bg-[#F5F7FA]";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const secondaryTextColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const cardBg = isDarkMode ? "bg-[#13101A]" : "bg-white/95";
  const cardBorder = isDarkMode ? "border-gray-800/30" : "border-gray-100";
  const inputBg = isDarkMode
    ? "bg-gray-900/60 border-gray-800/50"
    : "bg-gray-100 border-gray-200/70";
  const primaryGradient = "from-blue-500 to-purple-600";
  const primaryGradientHover = "from-blue-600 to-purple-700";
  const accentColor = "text-[#7765f3]";

  const getTokenButtonStyle = (token) => {
    const isSelected = selectedToken === token;
    const baseClasses =
      "flex-1 flex items-center justify-center rounded-lg py-2.5 transition-all duration-300";
    if (isSelected) {
      let selectedColorClass;
      switch (token) {
        case "POL":
          selectedColorClass = `bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 to-purple-700 text-white`;
          break;
        case "USDT":
          selectedColorClass = `bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 to-emerald-700 text-white`;
          break;
        default:
          selectedColorClass = "";
      }
      return `${baseClasses} ${selectedColorClass} text-white shadow-lg`;
    }
    return `${baseClasses} ${
      isDarkMode
        ? "bg-gray-800/40 hover:bg-gray-800/60 text-gray-300"
        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
    }`;
  };

  return (
    <div
      className={`w-full py-16 px-6 sm:px-10 lg:px-20 ${bgColor} min-h-screen flex flex-col lg:flex-row items-center justify-between gap-10`}
    >
      {/* Left side - Info */}
      <div className="flex flex-col items-start space-y-6 w-full lg:w-1/2">
        <h1 className={`text-4xl sm:text-5xl font-bold ${textColor}`}>
          Join the {TOKEN_NAME} Presale
        </h1>
        <p className={`text-lg ${secondaryTextColor} max-w-lg`}>
          Participate in the {TOKEN_SYMBOL} token presale and be an early
          holder. Buy tokens using ETH or USDT, track your balance, and
          watch your investment grow.
        </p>
        <div>
          <CustomConnectButton />
          {/* <button onClick={() => setToken()}>Set token</button> */}
        </div>
      </div>

      {/* Right side - Card */}
      <div
        className={`w-full lg:w-1/2 border rounded-2xl p-8 ${cardBg} ${cardBorder}`}
      >
        <div className="flex items-center justify-between mb-4">
          <p className={`text-sm ${secondaryTextColor}`}>Your Balance:</p>
          <p className={`font-semibold ${textColor}`}>
            {getCurrentBalance()} {selectedToken}
          </p>
        </div>

        {/* Input Field */}
        <div
          className={`flex items-center border rounded-lg ${inputBg} px-4 py-3`}
        >
          <input
            type="number"
            value={inputAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="Enter amount"
            className={`w-full bg-transparent focus:outline-none ${textColor}`}
          />
          <div className="flex items-center space-x-2">
            {getTokenIcon(selectedToken)}
            <span className={`${textColor} font-semibold`}>
              {selectedToken}
            </span>
          </div>
        </div>

        {/* Token Selector */}
        <div className="flex mt-4 space-x-3">
          <button
            className={getTokenButtonStyle("POL")}
            onClick={() => handleTokenSelection("POL")}
          >
            {getTokenIcon("POL")} <span className="ml-2">ETH</span>
          </button>

          <button
            className={getTokenButtonStyle("USDT")}
            onClick={() => handleTokenSelection("USDT")}
          >
            <SiTether className="w-5 h-5" /> <span className="ml-2">USDT</span>
          </button>
        </div>

        {/* Token Amount Display */}
        <div className="mt-4 flex items-center justify-between">
          <p className={`text-sm ${secondaryTextColor}`}>
            You will receive:
          </p>
          <p className={`font-semibold ${textColor}`}>
            {tokenAmount} {TOKEN_SYMBOL}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className={secondaryTextColor}>Sale Progress</span>
            <span className={textColor}>
              {calculateProgressPercentage()}%
            </span>
          </div>
          <div className="w-full bg-gray-700/30 rounded-full h-3">
            <div
              className={`h-3 bg-gradient-to-r ${primaryGradient} rounded-full`}
              style={{ width: `${calculateProgressPercentage()}%` }}
              key={`progress-${calculateProgressPercentage()}`}
            ></div>
          </div>
        </div>

        {/* Buy Button */}
        <button
          onClick={executePurchase}
          disabled={!hasSufficientBalance}
          className={`w-full mt-6 py-3 rounded-lg text-white font-semibold bg-gradient-to-r ${primaryGradient} hover:${primaryGradientHover} transition`}
        >
          {getButtonMessage()}
        </button>

        <button onClick={() =>addTokenToMetaMask()} className={`w-full hidden bg-red`}>
          <span>add token to meta mask</span>
        </button>

        {/* Referral Button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsReferralPopupOpen(true)}
            className={`text-sm ${accentColor} hover:underline`}
          >
            Have a referral code?
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
