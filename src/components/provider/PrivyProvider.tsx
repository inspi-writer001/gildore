import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { privyApiKey } from "../../constant";

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: true,
});

interface PrivyProviderProps {
  children: React.ReactNode;
}

export const PrivyAuthProvider = ({ children }: PrivyProviderProps) => {
  return (
    <PrivyProvider
      appId={privyApiKey ?? ""}
      config={{
        appearance: {
          accentColor: "#EF8977",
          theme: "#414141",
          showWalletLoginFirst: false,
          logo: "https://ik.imagekit.io/clg5lw23vmwy/logo-mark_u-_geXjY3.png?updatedAt=1744920451325",
          walletChainType: "solana-only",
          walletList: ["phantom", "solflare", "backpack", "detected_solana_wallets"],
        },
        loginMethods: ["google", "email", "wallet"],
        fundingMethodConfig: {
          moonpay: {
            useSandbox: true,
          },
        },
        embeddedWallets: {
          requireUserPasswordOnCreate: false,
          showWalletUIs: true,
          ethereum: {
            createOnLogin: "off",
          },
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
        mfa: {
          noPromptOnMfaRequired: false,
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
};
