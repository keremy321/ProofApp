import { useState } from "react";
import WalletConnect from "./components/WalletConnect";
import CreateProof from "./components/CreateProof";
import VerifyProof from "./components/VerifyProof";

export default function App() {
  const [account, setAccount] = useState("");

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Proof App</h1>
          <p className="mt-2 text-zinc-400">
            Create and verify file integrity proofs on-chain.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <WalletConnect account={account} setAccount={setAccount} />
          <CreateProof account={account} />
        </div>

        <div className="mt-6">
          <VerifyProof />
        </div>
      </div>
    </div>
  );
}