import React, {createContext, useContext, useEffect, useState} from "react";
import {ethers} from "ethers";
import {useAccount, useChainId, useConnect, useBalance} from "wagmi";

//Internal import 
import { useToast } from "./ToastContext";
import TOKEN_ICO_ABI from "./ABI.json";
import {useEthersProvider, useEthersSigners} from "../provider/hooks";
import {config} from "../provider/wagmiConfigs";
import { handleTransactionError, erc20Abi, generateId } from "./Utility";

const RPTOKEN_ADDRESS = process.env.NEXT_PUBLIC_RPTOKEN_ADDRESS; 
const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;
const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL;
const TOKEN_DECIMAL = process.env.NEXT_PUBLIC_TOKEN_DECIMAL;
const TOKEN_LOGO = process.env.NEXT_PUBLIC_TOKEN_LOGO;
const DOMAIN_URL = process.env.NEXT_PUBLIC_NEXT_DOMAIN_URL;
const PER_TOKEN_USD_PRICE = process.env.NEXT_PUBLIC_PER_TOKEN_USD_PRICE;
const tokenICOAbi = TOKEN_ICO_ABI.abi;


const Web3Context = createContext();

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ICO_ADDRESS;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;

// const fallbackProvider = new ethers.providers.JsonRpcProvider(RPC_URL);

export const Web3Provider = ({children}) =>{
    const {notify} = useToast();
    const {address, isConnected} = useAccount();
    const chainId = useChainId();
    const {balance} = useBalance({config});
    const {connect, connectors} = useConnect();

    const [reCall, setReCall] = useState(0);
    const [globalLoad, setGlobalLoad] = useState(false);

    const provider = useEthersProvider();
    const signer = useEthersSigners();
    const fallbackProvider = new ethers.providers.JsonRpcProvider(RPC_URL);

    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);

    const [isConnecting, setIsConnecting] = useState(false);
    const [contractInfo, setContractInfo] = useState({
        tbcAddress:null,
        tbcBalance:"0",
        ethPrice:"0",
        totalSold: "0",


    });
    const [tokenBalances, setTokenBalances] = useState({
        usertbcBalance:"0",
        contractEthBalance:null,
        totalSupply:null,
        userEthBalance:null,
        ethPrice:"0",
        tbcBalance:"0",
    });

const [error, setError] = useState(null);

useEffect(() => {
    const initContract = () =>{
     if(provider && signer ){
        try{
            const contractInstance = new ethers.Contract(
                CONTRACT_ADDRESS,
                tokenICOAbi,
                signer,
            );
            setContract(contractInstance)

        }catch(error){
            console.error("Error initializing Contract", error);
            setError("Failed to initialize Contract")

        }
     }

    };
    initContract();
   
}, [provider, signer]);

useEffect(()=> {
    const fetchContractInfo = async () =>{
        setGlobalLoad(true);
        try{
            const currentProvider = provider || fallbackProvider;
            const readonlyContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                tokenICOAbi,
                currentProvider,
            );
            const info = await readonlyContract.getContractInfo();

            console.log(`Start`);
            const tokenDecimals = parseInt(info.tokenDecimals) || 18;
            setContractInfo({
                tbcaddress: info.tokenAddress,
                tbcBalance:ethers.utils.formatUnits(
                    info.tokenBalance,
                    tokenDecimals
                ),
                ethPrice: ethers.utils.formatUnits(info.ethPrice, 18),
                 totalSold: ethers.utils.formatUnits(info.totalSold, tokenDecimals),
            });
           
            if(address && info.tokenAddress){
                const tokenContract = new ethers.Contract(
                    info.tokenAddress,
                    erc20Abi,
                    currentProvider,
                );

                const [
                    userTokenBalance, 
                    userEthBalance, 
                    contractEthBalance, 
                    totalSupply,] = await Promise.all([
                    tokenContract.balanceOf(address),
                    currentProvider.getBalance(address),
                    currentProvider.getBalance(CONTRACT_ADDRESS),
                    tokenContract.totalSupply(),

                ]);
                  

                setTokenBalances(prev => ({
                    ...prev, 
                    usertbcBalance: ethers.utils.formatUnits(
                        userTokenBalance,
                        tokenDecimals,
                    ),
                    contractEthBalance:ethers.utils.formatUnits(contractEthBalance),
                    totalSupply:ethers.utils.formatUnits(totalSupply, tokenDecimals),
                    userEthBalance: ethers.utils.formatUnits(userEthBalance),
                    ethPrice: ethers.utils.formatUnits(info.ethPrice, 18),
                    tbcBalance:ethers.utils.formatUnits(info.tokenBalance, tokenDecimals),

                }));
                console.log(info);
            }
           setGlobalLoad(false)
        }catch(error){
            setGlobalLoad(false)
            console.error(`error fetching contract info`,error);
            setError(`Failed to Fetch Contract Info`)
        }
    };
    fetchContractInfo()
}, [contract, address, provider, signer, reCall]);

const buyToken = async(ethAmount)=>{
    if(!contract || !address) return null;

    const toastId = notify.start(`Buying ${TOKEN_SYMBOL} with ${CURRENCY}..` )

    try{
        const ethValue = ethers.utils.parseEther(ethAmount);
        const tx = await contract.buyToken({
            value: ethValue,
        });
        notify.update(toastId, `Processing, Waiting for confirmation`);
        const receipt = await tx.wait();
        if(receipt.status === 1){
          const tokenPrice = PER_TOKEN_USD_PRICE;
          const tokenReceived = parseFloat(ethAmount)/tokenPrice;

          const txDetails = {
            timestamp: Date.now(),
            user: address,
            tokenIn: CURRENCY,
            tokenOut: TOKEN_SYMBOL,
            amountIn:ethAmount,
            amountOut:tokenReceived.toString(),
            transactionType:"BUY",
            hash:receipt.transactionHash,

          };
          saveTransactionToLocalStorage(txDetails);

          setReCall((prev) => prev +1);
          notify.complete(toastId, `Successfully ${tokenReceived} ${TOKEN_SYMBOL} tokens`)
        }
        return receipt;

    }catch(error){
        const {message: errorMessage, code: errorCode} = handleTransactionError(
            error, 
            "Buying tokens");
            if(errorCode === "ACTION_REJECTED"){
                notify.reject(toastId, `Transaction Rejected By User`);
                return null;
            }

            console.error(errorMessage);
            notify.fail(toastId, `Transaction Failed Please try again with sufficient gas`);
            return null;

    };


}
const saveTransactionToLocalStorage = (txData) =>{


    try{
        const existingTransaction = JSON.parse(localStorage.getItem("tokenTransactions")) || [];

    existingTransaction.push(txData);

    localStorage.setItem(
        "tokenTransactions",
        JSON.stringify(existingTransaction),


    );
    console.log(`Transaction saved to localStorage`, txData)

    }catch(error){
         console.log(`Failed to Save Transaction`, error)

    }
    

}

const updateTokenPrice = async(newPrice)=>{
    if(!contract || !address) return null;

    const toastId = notify.start(`Updating Token Price...` )

    try{
        const parsedPrice = ethers.utils.parseEther(newPrice);
        const tx = await contract.updateTokenPrice(
            parsedPrice,
        );
        notify.update(toastId, `Processing, Confirming Price Update`);
        const receipt = await tx.wait();
        if(receipt.status === 1){
           setReCall((prev) => prev +1);
          notify.complete(toastId, `Token Price update to ${newPrice} ${CURRENCY}`)
        }
        return receipt;

    }catch(error){
        const {message: errorMessage, code: errorCode} = handleTransactionError(
            error, 
            "Updating token Price");
            if(errorCode === "ACTION_REJECTED"){
                notify.reject(toastId, `Transaction Rejected By User`);
                return null;
            }

            console.error(errorMessage);
            notify.fail(toastId, `Price update Failed, Please Check your Permission`);
            return null;

    };


};

const setSaleToken = async(tokenAddress)=>{
    if(!contract || !address) return null;

    const toastId = notify.start(`Setting Sale token` )

    try{
       
        const tx = await contract.setSaleToken(
            tokenAddress,
        );
        notify.update(toastId, `Processing, Confirming Token Update`);
        const receipt = await tx.wait();
        if(receipt.status === 1){
           setReCall((prev) => prev +1);
          notify.complete(toastId, `Sale Token Updated successfully`)
        }
        return receipt;

    }catch(error){
        const {message: errorMessage, code: errorCode} = handleTransactionError(
            error, 
            "Setting Sale Token");
            if(errorCode === "ACTION_REJECTED"){
                notify.reject(toastId, `Transaction Rejected By User`);
                return null;
            }

            console.error(errorMessage);
            notify.fail(toastId, `Failed to set sale token, Please Check your Address`);
            return null;

    };

    


};
const withdrawAllTokens = async()=>{
    if(!contract || !address) return null;

    const toastId = notify.start(`Withdrawing Tokens` )

    try{
       
        const tx = await contract.withdrawAllTokens();
        notify.update(toastId, `Processing, Confirming withdrawal`);
        const receipt = await tx.wait();
        if(receipt.status === 1){
           setReCall((prev) => prev +1);
          notify.complete(toastId, `All tokens withdrawn successfully`)
        }
        return receipt;

    }catch(error){
        const {message: errorMessage, code: errorCode} = handleTransactionError(
            error, 
            "withdrawing Token");
            if(errorCode === "ACTION_REJECTED"){
                notify.reject(toastId, `Transaction Rejected By User`);
                return null;
            }

            console.error(errorMessage);
            notify.fail(toastId, `Failed to withdraw Tokens, Please Try Again`);
            return null;

    };


}
const rescueTokens = async(tokenAddress)=>{
    if(!contract || !address) return null;

    const toastId = notify.start(`Rescuing Tokens` )

    try{
       
        const tx = await contract.rescueTokens(
            tokenAddress,
        );
        notify.update(toastId, `Processing, Rescue Operations`);
        const receipt = await tx.wait();
        if(receipt.status === 1){
           setReCall((prev) => prev +1);
          notify.complete(toastId, `Token Rescued successfully`)
        }
        return receipt;

    }catch(error){
        const {message: errorMessage, code: errorCode} = handleTransactionError(
            error, 
            "Rescuing Token");
            if(errorCode === "ACTION_REJECTED"){
                notify.reject(toastId, `Transaction Rejected By User`);
                return null;
            }

            console.error(errorMessage);
            notify.fail(toastId, `Failed to Rescue Tokens, Please Try Again/ Check the Address`);
            return null;

    };


}
const formatAddress = (address) => {
    if(!address) return "";
    return `${address.substring(0,6)}....${address.substring(address.length - 4)}`;

};

const formatTokenAmount = (amount, decimals = 18 ) =>{
    if(!amount) return "0";
    return ethers.utils.formatUnits(amount);
}
const isOwner = async ()=> {
    if(!contract || !address) return false;

    try{
        const ownerAddress = await contract.owner();
        return ownerAddress.toLowerCase() === address.toLowerCase();

    }catch(error){
        const errorMessage = handleTransactionError(error, `Withdraw tokens`);
        console.log(errorMessage);
        return false;
    }

}

const addTokenToMetaMask = async () => {
    const toastId = notify.start(`Adding ${TOKEN_SYMBOL} token to metaMask`);
    try{
        const wasAdded = await window.ethereum.request({
            method: "wallet_watchAsset",
            params:{
                type:"ERC20",
                options:{
                    address:RPTOKEN_ADDRESS,
                    symbol:TOKEN_SYMBOL,
                    decimal:TOKEN_DECIMAL,
                    image:TOKEN_LOGO,

                },
            },
        });
        if(wasAdded){
            notify.complete(toastId, "Successfully added token");

        }else{
            notify.complete(toastId, `Failed to add token`);

        }

    }catch(error){
        console.error(error);
        const {message: errorMessage, code: errorCode} = handleTransactionError(error, `Token Addition Error`);
        notify.fail(toastId, `Transaction failed:${
            errorMessage.message === "undefined" ? "Not Supported" : errorMessage.message


        }`)

    }
}
const value = {
    provider,
    signer,
    contract,
    account:address,
    chainId,
    isConnected:!!address && !!contract,
    isConnecting,
    contractInfo,
    tokenBalances,
    error,
    reCall,
    globalLoad,
    buyToken,
    updateTokenPrice,
    setSaleToken,
    withdrawAllTokens,
    formatAddress,
    formatTokenAmount,
    isOwner,
    setReCall,
    addTokenToMetaMask,
    rescueTokens,
};
return <Web3Context.Provider value={value}>
    {children}
</Web3Context.Provider>
};

export const useWeb3 = () => {
    const context = useContext(Web3Context);
    if(!context){
        throw new Error(`useWeb3 must be used within a web3provider`)
    }
    return context;
};
export default Web3Context;





