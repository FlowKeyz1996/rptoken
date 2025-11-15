// Web3Provider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useChainId, useConnect, useBalance } from "wagmi";

// Internal imports
import { useToast } from "./ToastContext";
import TOKEN_ICO_ABI from "./ABI.json";
import { useEthersProvider, useEthersSigners } from "../provider/hooks";
import { config } from "../provider/wagmiConfigs";
import { handleTransactionError, erc20Abi } from "./Utility";

const RPTOKEN_ADDRESS = process.env.NEXT_PUBLIC_RPTOKEN_ADDRESS;
const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;
const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL;
const TOKEN_DECIMAL = process.env.NEXT_PUBLIC_TOKEN_DECIMAL;
const TOKEN_LOGO = process.env.NEXT_PUBLIC_TOKEN_LOGO;
const PER_TOKEN_USD_PRICE = process.env.NEXT_PUBLIC_PER_TOKEN_USD_PRICE;
const tokenICOAbi = TOKEN_ICO_ABI.abi;

const Web3Context = createContext();
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ICO_ADDRESS;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;

export const Web3Provider = ({ children }) => {
  const { notify } = useToast();
  const { address } = useAccount();
  const chainId = useChainId();
  const { balance } = useBalance({ config });

  const [reCall, setReCall] = useState(0);
  const [globalLoad, setGlobalLoad] = useState(false);
  const [contract, setContract] = useState(null);
  const [contractInfo, setContractInfo] = useState({
    tbcAddress: null,
    tbcBalance: "0",
    ethPrice: "0",
    totalSold: "0",
  });
  const [tokenBalances, setTokenBalances] = useState({
    usertbcBalance: "0",
    contractEthBalance: null,
    totalSupply: null,
    userEthBalance: null,
    ethPrice: "0",
    tbcBalance: "0",
  });
  const [transactions, setTransactions] = useState([]); // ← transactions state
  const [error, setError] = useState(null);

  const provider = useEthersProvider();
  const signer = useEthersSigners();
  const fallbackProvider = new ethers.providers.JsonRpcProvider(RPC_URL);

  /** Initialize Contract */
  useEffect(() => {
    if (provider && signer) {
      try {
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, tokenICOAbi, signer);
        setContract(contractInstance);
      } catch (error) {
        console.error("Error initializing Contract", error);
        setError("Failed to initialize Contract");
      }
    }
  }, [provider, signer]);

  /** Fetch Contract Info & Balances */
  useEffect(() => {
    const fetchContractInfo = async () => {
      setGlobalLoad(true);
      try {
        const currentProvider = provider || fallbackProvider;
        const readonlyContract = new ethers.Contract(CONTRACT_ADDRESS, tokenICOAbi, currentProvider);
        const info = await readonlyContract.getContractInfo();

        const tokenDecimals = parseInt(info.tokenDecimals) || 18;
        setContractInfo({
          tbcaddress: info.tokenAddress,
          tbcBalance: ethers.utils.formatUnits(info.tokenBalance, tokenDecimals),
          ethPrice: ethers.utils.formatUnits(info.ethPrice, 18),
          totalSold: ethers.utils.formatUnits(info.totalSold, tokenDecimals),
        });

        if (address && info.tokenAddress) {
          const tokenContract = new ethers.Contract(info.tokenAddress, erc20Abi, currentProvider);
          const [userTokenBalance, userEthBalance, contractEthBalance, totalSupply] = await Promise.all([
            tokenContract.balanceOf(address),
            currentProvider.getBalance(address),
            currentProvider.getBalance(CONTRACT_ADDRESS),
            tokenContract.totalSupply(),
          ]);

          setTokenBalances(prev => ({
            ...prev,
            usertbcBalance: ethers.utils.formatUnits(userTokenBalance, tokenDecimals),
            contractEthBalance: ethers.utils.formatUnits(contractEthBalance),
            totalSupply: ethers.utils.formatUnits(totalSupply, tokenDecimals),
            userEthBalance: ethers.utils.formatUnits(userEthBalance),
            ethPrice: ethers.utils.formatUnits(info.ethPrice, 18),
            tbcBalance: ethers.utils.formatUnits(info.tokenBalance, tokenDecimals),
          }));
        }

        // Fetch historical transactions
        const events = await readonlyContract.queryFilter(
          readonlyContract.filters.TokensPurchased(),
          0,
          "latest"
        );

        const historicalTx = events.map(ev => ({
          buyer: ev.args.buyer,
          amountPaid: ethers.utils.formatEther(ev.args.amountPaid),
          tokensBought: ethers.utils.formatUnits(ev.args.tokensBought, TOKEN_DECIMAL),
          txHash: ev.transactionHash,
        }));

        setTransactions(historicalTx.reverse()); // latest first
        setGlobalLoad(false);
      } catch (error) {
        setGlobalLoad(false);
        console.error("Error fetching contract info", error);
        setError("Failed to Fetch Contract Info");
      }
    };

    fetchContractInfo();
  }, [contract, address, provider, signer, reCall]);

  /** Listen to new TokensPurchased events */
  useEffect(() => {
    if (!contract) return;

    const onTokensPurchased = (buyer, amountPaid, tokensBought, event) => {
      setTransactions(prev => [
        {
          buyer,
          amountPaid: ethers.utils.formatEther(amountPaid),
          tokensBought: ethers.utils.formatUnits(tokensBought, TOKEN_DECIMAL),
          txHash: event.transactionHash,
        },
        ...prev,
      ]);
    };

    contract.on("TokensPurchased", onTokensPurchased);

    return () => contract.off("TokensPurchased", onTokensPurchased);
  }, [contract]);

  /** Buy Token Function */
  const buyToken = async ethAmount => {
    if (!contract || !address) return null;

    const toastId = notify.start(`Buying ${TOKEN_SYMBOL} with ${CURRENCY}..`);

    try {
      const ethValue = ethers.utils.parseEther(ethAmount);
      const tx = await contract.buyToken({ value: ethValue });
      notify.update(toastId, `Processing, Waiting for confirmation`);
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        const tokenPrice = PER_TOKEN_USD_PRICE;
        const tokenReceived = parseFloat(ethAmount) / tokenPrice;

        const txDetails = {
          timestamp: Date.now(),
          user: address,
          tokenIn: CURRENCY,
          tokenOut: TOKEN_SYMBOL,
          amountIn: ethAmount,
          amountOut: tokenReceived.toString(),
          transactionType: "BUY",
          hash: receipt.transactionHash,
        };
        // Save to localStorage as backup
        saveTransactionToLocalStorage(txDetails);

        setReCall(prev => prev + 1);
        notify.complete(toastId, `Successfully ${tokenReceived} ${TOKEN_SYMBOL} tokens`);
      }

      return receipt;
    } catch (error) {
      const { message: errorMessage, code: errorCode } = handleTransactionError(error, "Buying tokens");
      if (errorCode === "ACTION_REJECTED") {
        notify.reject(toastId, `Transaction Rejected By User`);
        return null;
      }

      console.error(errorMessage);
      notify.fail(toastId, `Transaction Failed Please try again with sufficient gas`);
      return null;
    }
  };

  const saveTransactionToLocalStorage = txData => {
    try {
      const existingTransaction = JSON.parse(localStorage.getItem("tokenTransactions")) || [];
      existingTransaction.push(txData);
      localStorage.setItem("tokenTransactions", JSON.stringify(existingTransaction));
      console.log("Transaction saved to localStorage", txData);
    } catch (error) {
      console.log("Failed to Save Transaction", error);
    }
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
    transactions, // ← exposed here
    buyToken,
    setReCall,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) throw new Error("useWeb3 must be used within a Web3Provider");
  return context;
};
export default Web3Context;
