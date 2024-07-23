"use client";

import React from "react";

import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { baseSepolia } from "wagmi/chains";
import localFont from "@next/font/local";

const config = createConfig(
  getDefaultConfig({
    appName: "Urban Gate Capital",
    chains: [baseSepolia],
    transports: {
      // RPC URL for each chain
      [baseSepolia.id]: http(
        "https://base-sepolia.g.alchemy.com/v2/VQFSLakq8kTcp6ps2EFrJwXWZMYRfrQn"
      ),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider debugMode theme="midnight">
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
