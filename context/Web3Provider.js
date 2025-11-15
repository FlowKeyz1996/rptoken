// context/Web3Provider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useChainId } from "wagmi";

// Internal imports
import { useToast } from "./ToastContext";
import TOKEN_ICO_ABI from "./ABI.json";
import { useEthersProvider, useEthersSigners } from "../provider/hooks";
import { config } from "../provider/wagmiConfigs";
import { handleTransactionError, erc20Abi } from "./Utility";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ICO_ADDRESS;
const TOKEN_DECIMAL = process.env.NEXT_PUBLIC_TOKEN_DECIMAL;
const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL;
const PER_TOKEN_USD_PRICE = process.env.NEXT_PUBLIC_PER_TOKEN_USD_PRICE;
const tokenICOAbi = TOKEN_ICO_ABI.abi;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const { notify } = useToast();
  const { address } = useAccount();
  const chainId = useChainId();

  const provider = useEthersProvider();
  const signer = useEthersSigners();
  const fallbackProvider = new ethers.providers.JsonRpcProvider(RPC_URL);

  const [contract, setContract] = useState(null);
  const [contractInfo, setContractInfo] = useState({});
  const [tokenBalances, setTokenBalances] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [globalLoad, setGlobalLoad] = useState(false);
  const [error, setError] = useState(null);
  const [reCall, setReCall] = useState(0);

  /** Initialize Contract safely */
  useEffect(() => {
    if (!provider || !signer) return;
    try {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, tokenICOAbi, signer);
      setContract(contractInstance);
    } catch (err) {
      console.error("Contract init failed", err);
      setError("Failed to initialize contract");
    }
  }, [provider, signer]);

  /** Fetch contract info, balances, and historical events */
  useEffect(() => {
    const fetchContractInfo = async () => {
      if (!contract && !provider) return;
      setGlobalLoad(true);
      try {
        const currentProvider = provider || fallbackProvider;
        const readonlyContract = new ethers.Contract(CONTRACT_ADDRESS, tokenICOAbi, currentProvider);

        // Contract Info
        const info = await readonlyContract.getContractInfo();
        const tokenDecimals = parseInt(info.tokenDecimals) || 18;

        setContractInfo({
          tbcAddress: info.tokenAddress,
          tbcBalance: ethers.utils.formatUnits(info.tokenBalance, tokenDecimals),
          ethPrice: ethers.utils.formatUnits(info.ethPrice, 18),
          totalSold: ethers.utils.formatUnits(info.totalSold, tokenDecimals),
        });

        // User balances
        if (address && info.tokenAddress) {
          const tokenContract = new ethers.Contract(info.tokenAddress, erc20Abi, currentProvider);
          const [userTokenBalance, userEthBalance, contractEthBalance, totalSupply] = await Promise.all([
            tokenContract.balanceOf(address),
            currentProvider.getBalance(address),
            currentProvider.getBalance(CONTRACT_ADDRESS),
            tokenContract.totalSupply(),
          ]);

          setTokenBalances({
            usertbcBalance: ethers.utils.formatUnits(userTokenBalance, tokenDecimals),
            contractEthBalance: ethers.utils.formatUnits(contractEthBalance),
            totalSupply: ethers.utils.formatUnits(totalSupply, tokenDecimals),
            userEthBalance: ethers.utils.formatUnits(userEthBalance),
            ethPrice: ethers.utils.formatUnits(info.ethPrice, 18),
            tbcBalance: ethers.utils.formatUnits(info.tokenBalance, tokenDecimals),
          });
        }

        // Historical Purchases
        const purchaseEvents = await readonlyContract.queryFilter(
          readonlyContract.filters.TokensPurchased(),
          0,
          "latest"
        );
        const historicalTx = purchaseEvents.map(ev => ({
          buyer: ev.args.buyer,
          amountPaid: ethers.utils.formatEther(ev.args.amountPaid),
          tokensBought: ethers.utils.formatUnits(ev.args.tokensBought, TOKEN_DECIMAL),
          txHash: ev.transactionHash,
          timestamp: Date.now(),
          type: "BUY",
        }));

        // Admin-only Claims
        const claimEvents = await readonlyContract.queryFilter(
          readonlyContract.filters.TokensClaimed(),
          0,
          "latest"
        );
        const claimsTx = claimEvents.map(ev => ({
          claimer: ev.args.claimer,
          tokensClaimed: ethers.utils.formatUnits(ev.args.tokensClaimed, TOKEN_DECIMAL),
          txHash: ev.transactionHash,
          timestamp: Date.now(),
          type: "CLAIM",
        }));

        // Merge with localStorage backup
        const localTx = JSON.parse(localStorage.getItem("tokenTransactions")) || [];
        setTransactions([...localTx.reverse(), ...historicalTx.reverse(), ...claimsTx.reverse()]);

        setGlobalLoad(false);
      } catch (err) {
        console.error("Fetch contract info failed", err);
        setError("Failed to fetch contract info");
        setGlobalLoad(false);
      }
    };

    fetchContractInfo();
  }, [contract, address, provider, signer, reCall]);

  /** Listen to real-time events safely */
  useEffect(() => {
    if (!contract) return;

    const onTokensPurchased = (buyer, amountPaid, tokensBought, event) => {
      const tx = {
        buyer,
        amountPaid: ethers.utils.formatEther(amountPaid),
        tokensBought: ethers.utils.formatUnits(tokensBought, TOKEN_DECIMAL),
        txHash: event.transactionHash,
        timestamp: Date.now(),
        type: "BUY",
      };
      saveTxToLocalStorage(tx);
      setTransactions(prev => [tx, ...prev]);
    };

    const onTokensClaimed = (claimer, tokensClaimed, event) => {
      const tx = {
        claimer,
        tokensClaimed: ethers.utils.formatUnits(tokensClaimed, TOKEN_DECIMAL),
        txHash: event.transactionHash,
        timestamp: Date.now(),
        type: "CLAIM",
      };
      setTransactions(prev => [tx, ...prev]);
    };

    try {
      contract.on("TokensPurchased", onTokensPurchased);
      contract.on("TokensClaimed", onTokensClaimed);
    } catch (err) {
      console.error("Failed to attach events", err);
    }

    return () => {
      try {
        contract.off("TokensPurchased", onTokensPurchased);
        contract.off("TokensClaimed", onTokensClaimed);
      } catch (err) {
        console.error("Failed to detach events", err);
      }
    };
  }, [contract]);

  /** Save transaction locally */
  const saveTxToLocalStorage = tx => {
    try {
      const existing = JSON.parse(localStorage.getItem("tokenTransactions")) || [];
      existing.push(tx);
      localStorage.setItem("tokenTransactions", JSON.stringify(existing));
    } catch (err) {
      console.error("Failed to save tx", err);
    }
  };

  /** Buy Token */
  const buyToken = async ethAmount => {
    if (!contract || !address) return null;

    const toastId = notify.start(`Buying ${TOKEN_SYMBOL}...`);
    try {
      const ethValue = ethers.utils.parseEther(ethAmount);
      const tx = await contract.buyToken({ value: ethValue });
      notify.update(toastId, "Processing...");
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        const tokenReceived = parseFloat(ethAmount) / PER_TOKEN_USD_PRICE;
        const txDetails = {
          timestamp: Date.now(),
          user: address,
          tokenIn: "ETH",
          tokenOut: TOKEN_SYMBOL,
          amountIn: ethAmount,
          amountOut: tokenReceived.toString(),
          transactionType: "BUY",
          hash: receipt.transactionHash,
        };
        saveTxToLocalStorage(txDetails);
        setReCall(prev => prev + 1);
        notify.complete(toastId, `Successfully bought ${tokenReceived} ${TOKEN_SYMBOL}`);
      }

      return receipt;
    } catch (err) {
      const { message, code } = handleTransactionError(err, "Buying tokens");
      if (code === "ACTION_REJECTED") notify.reject(toastId, "Transaction Rejected By User");
      else notify.fail(toastId, "Transaction Failed");
      return null;
    }
  };

  /** CSV export */
  const exportCSV = (filteredTx = transactions) => {
    const headers = ["Type", "Address", "Tokens Bought/Claimed", "Amount Paid", "TxHash", "Timestamp"];
    const rows = filteredTx.map(tx => [
      tx.type,
      tx.buyer || tx.claimer,
      tx.tokensBought || tx.tokensClaimed,
      tx.amountPaid || "-",
      tx.txHash,
      new Date(tx.timestamp).toLocaleString(),
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const value = {
    provider,
    signer,
    contract,
    account: address,
    chainId,
    isConnected: !!address && !!contract,
    globalLoad,
    contractInfo,
    tokenBalances,
    transactions,
    buyToken,
    setReCall,
    exportCSV,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) throw new Error("useWeb3 must be used within a Web3Provider");
  return context;
};

export default Web3Context;
