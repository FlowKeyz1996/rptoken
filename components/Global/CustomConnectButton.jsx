import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { RiWalletLine } from "react-icons/ri";

const CustomConnectButton = ({ active, childStyle }) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className={`flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-md transition-colors ${childStyle}`}
                  >
                    <RiWalletLine className="mr-2" size={20} />
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
                  >
                    Wrong Network
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-4">
                  {active && (
                    <button
                      onClick={openChainModal}
                      className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg gap-2"
                    >
                      {chain.hasIcon && (
                        <div className="w-5 h-5">
                          {chain.iconUrl && (
                            <img
                              src={chain.iconUrl}
                              alt={chain.name ?? "Chain Icon"}
                              className="w-5 h-5"
                            />
                          )}
                        </div>
                      )}
                    </button>
                  )}
                  <button
                    onClick={openAccountModal}
                    className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg gap-2"
                  >
                    {account.displayName}
                    {account.displayBalance && ` (${account.displayBalance})`}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;
