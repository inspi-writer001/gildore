import { useState, useRef, useEffect } from "react";
import { useConnectWallet, usePrivy } from "@privy-io/react-auth";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, User } from "lucide-react";
import { useSolanaProvider } from "../../hooks/useSolanaProvider";
import gildore_logo from "../../assets/gildore_logo.svg";

export const DashboardHeader = () => {
  const { connectWallet } = useConnectWallet();
  const { logout, user } = usePrivy();
  const { walletAddress } = useSolanaProvider();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const displayName =
    user?.email?.address ??
    (walletAddress ? truncateAddress(walletAddress) : null);

  return (
    <div className="w-full h-14 bg-card sticky top-0 z-[1] flex items-center justify-between md:justify-end px-4">
      <img
        src={gildore_logo}
        alt="Gildore Logo"
        className="w-[121px] h-auto block md:hidden"
      />
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

        {/* Avatar + dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-[#D9D9D9] flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-white/20 transition-all"
          >
            <User className="w-3 md:w-4 h-3 md:h-4 text-black/50" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-white/10 rounded-lg shadow-lg py-1 z-50">
              {displayName && (
                <div className="px-4 py-2.5 border-b border-white/10">
                  <p className="text-xs text-white/40">Signed in as</p>
                  <p className="text-sm text-white truncate">{displayName}</p>
                </div>
              )}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  queryClient.clear();
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
