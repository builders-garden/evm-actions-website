"use client";

import React from "react";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { NextUIProvider } from "@nextui-org/react";

import { createConfig, WagmiProvider } from "wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { base } from "viem/chains";

const config = createConfig({
  chains: [base],
  multiInjectedProviderDiscovery: false,
  transports: {
    [base.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <DynamicContextProvider
        settings={{
          environmentId: "09c43630-96f1-4604-a1e0-c6cbfea5f600",
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <DynamicWagmiConnector>
              <main className="dark text-foreground bg-background min-h-screen">
                {children}
              </main>
            </DynamicWagmiConnector>
          </QueryClientProvider>
        </WagmiProvider>
      </DynamicContextProvider>
    </NextUIProvider>
  );
}
