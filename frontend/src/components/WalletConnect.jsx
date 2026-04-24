import { useState } from "react";
import { getProvider } from "../lib/contract";

export default function WalletConnect({ account, setAccount }) {
  const [error, setError] = useState("");

  async function connectWallet() {
    try {
      setError("");

      const provider = await getProvider();
      const accounts = await provider.send("eth_requestAccounts", []);

      if (!accounts || accounts.length === 0) {
        throw new Error("No account returned from wallet.");
      }

      setAccount(accounts[0]);
    } catch (err) {
      setError(err.message || "Failed to connect wallet.");
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white">Wallet</h2>

      <div className="mt-4">
        {account ? (
          <div className="rounded-xl bg-zinc-800 p-3 text-sm text-zinc-200 break-all">
            Connected: {account}
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="rounded-xl bg-white px-4 py-2 font-medium text-black transition hover:opacity-90"
          >
            Connect MetaMask
          </button>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  );
}