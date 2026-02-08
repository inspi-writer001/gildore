import { useMemo } from "react";
import { useSolanaWallets } from "@privy-io/react-auth";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import {
  signerIdentity,
  publicKey as umiPublicKey,
  type Umi,
  type Signer,
  type Transaction as UmiTransaction,
} from "@metaplex-foundation/umi";
import {
  toWeb3JsTransaction,
  fromWeb3JsTransaction,
} from "@metaplex-foundation/umi-web3js-adapters";
import { SOLANA_RPC_URL } from "../constant";

export function useUmi(): Umi | null {
  const { wallets } = useSolanaWallets();

  const solanaWallet = useMemo(() => {
    if (wallets.length === 0) return null;
    const externalWallet = wallets.find((w) => w.walletClientType !== "privy");
    return externalWallet || wallets[0];
  }, [wallets]);

  const umi = useMemo(() => {
    if (!solanaWallet?.address) return null;

    const instance = createUmi(SOLANA_RPC_URL).use(
      irysUploader({ address: "https://devnet.irys.xyz" })
    );

    const walletPublicKey = umiPublicKey(solanaWallet.address);

    // Bridge Privy wallet to UMI signer by converting tx formats
    const signer: Signer = {
      publicKey: walletPublicKey,
      signMessage: async (message: Uint8Array) => {
        return await solanaWallet.signMessage(message);
      },
      signTransaction: async (transaction: UmiTransaction) => {
        const web3jsTx = toWeb3JsTransaction(transaction);
        const signed = await solanaWallet.signTransaction(web3jsTx);
        return fromWeb3JsTransaction(signed);
      },
      signAllTransactions: async (transactions: UmiTransaction[]) => {
        const results: UmiTransaction[] = [];
        for (const tx of transactions) {
          const web3jsTx = toWeb3JsTransaction(tx);
          const signed = await solanaWallet.signTransaction(web3jsTx);
          results.push(fromWeb3JsTransaction(signed));
        }
        return results;
      },
    };

    instance.use(signerIdentity(signer));

    return instance;
  }, [solanaWallet]);

  return umi;
}
