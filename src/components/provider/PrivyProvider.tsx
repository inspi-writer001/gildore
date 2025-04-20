import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { privyApiKey } from "../../constant";

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
          walletChainType: "ethereum-and-solana",
          walletList: ["detected_wallets", "metamask", "phantom"],
        },
        loginMethods: ["google", "email"],
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
        mfa: {
          noPromptOnMfaRequired: false,
        },
        // externalWallets: {
        //   solana: {
        //     connectors: {},
        //   },
        // },
      }}
    >
      {children}
    </PrivyProvider>
  );
};
