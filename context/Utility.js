export const handleTransactionError = (
  error,
  context = "Transaction",
  logToConsole = true
) => {
  if (logToConsole) {
    console.error(`Error in ${context}:`, error);
  }

  let errorMessage = "An unexpected error occurred";
  let errorCode = "UNKNOWN_ERROR";

  const code =
    error?.code ||
    (error?.error && error.error.code) ||
    (error.data && error.data.code);

  const isRejected =
    (error?.message &&
      (error.message.includes("User Rejected") ||
        error.message.includes("User Denied") ||
        error.message.includes("ACTION_REJECTED"))) ||
    code === "ACTION_REJECTED" ||
    code === 4001;

  if (isRejected) {
    errorMessage = "Transaction rejected by user";
    errorCode = "ACTION_REJECTED";
  } else if (code === "INSUFFICIENT_FUNDS" || code === -32000) {
    errorMessage = "Insufficient funds for transaction";
    errorCode = "INSUFFICIENT_FUNDS";
  } else if (error.reason) {
    errorMessage = error.reason;
    errorCode = "CONTRACT_ERROR";
  } else if (error.message) {
    const message = error.message;

    if (message.includes("Gas required exceeds allowance")) {
      errorMessage = "Gas required exceeds your ETH balance";
      errorCode = "INSUFFICIENT_FUNDS";
    } else if (message.includes("Nonce too low")) {
      errorMessage = "Transaction with the same nonce already processed";
      errorCode = "NONCE_ERROR";
    } else if (message.includes("Replacement transaction underpriced")) {
      errorMessage = "Gas price too low to replace pending transaction";
      errorCode = "GAS_PRICE_ERROR";
    } else {
      errorMessage = message;
    }
  }

  return {
    message: error?.message || errorMessage,
    errorMessage,
    code: errorCode,
  };
};

export const erc20Abi = [
  "function totalSupply() view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transfer(address recipient, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address sender, address recipient, uint256 amount) returns (bool)"
];

export const generateId = () => {
  return `transaction-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
};
