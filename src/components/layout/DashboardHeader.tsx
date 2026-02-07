import { useConnectWallet } from "@privy-io/react-auth";
import { useSolanaProvider } from "../../hooks/useSolanaProvider";
import gildore_logo from "../../assets/gildore_logo.svg";

export const DashboardHeader = () => {
  const { connectWallet } = useConnectWallet();
  const { walletAddress } = useSolanaProvider();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="w-full h-14 bg-card sticky top-0 z-[1] flex items-center justify-between md:justify-end px-4">
        <img src={gildore_logo} alt="Gildore Logo" className="w-[121px] h-auto block md:hidden" />
        <div className="flex items-center gap-3">
            {walletAddress ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {truncateAddress(walletAddress)}
                </span>
                <button
                  onClick={() => connectWallet()}
                  className="text-xs text-primary underline hover:no-underline"
                >
                  Switch
                </button>
              </div>
            ) : (
              <button
                onClick={() => connectWallet()}
                className="text-sm text-primary underline hover:no-underline"
              >
                Connect Wallet
              </button>
            )}
            <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-[#D9D9D9]" />
        </div>
    </div>
  )
}
