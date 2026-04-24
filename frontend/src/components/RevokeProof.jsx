import { useState } from "react";
import { getContractWithSigner } from "../lib/contract";

export default function RevokeProof({ account }) {
  const [proofIdInput, setProofIdInput] = useState("");
  const [txHash, setTxHash] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function handleRevoke() {
    try {
      setError("");
      setStatus("");
      setTxHash("");

      if (!account) {
        throw new Error("Connect your wallet first.");
      }

      if (!proofIdInput.trim()) {
        throw new Error("Enter a proof ID.");
      }

      const proofId = BigInt(proofIdInput);

      setStatus("Sending revoke transaction...");
      const contract = await getContractWithSigner();
      const tx = await contract.revokeProof(proofId);
      setTxHash(tx.hash);

      setStatus("Waiting for confirmation...");
      await tx.wait();

      setStatus("Proof revoked successfully.");
    } catch (err) {
      setStatus("");
      setError(err.message || "Failed to revoke proof.");
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white">Revoke Proof</h2>

      <div className="mt-4 space-y-4">
        <input
          type="number"
          min="0"
          placeholder="Enter proof ID"
          value={proofIdInput}
          onChange={(e) => setProofIdInput(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-sm text-zinc-200"
        />

        <button
          onClick={handleRevoke}
          className="rounded-xl bg-rose-600 px-4 py-2 font-medium text-white transition hover:bg-rose-500"
        >
          Revoke On-Chain
        </button>

        {txHash && (
          <div>
            <p className="mb-1 text-sm text-zinc-400">Transaction Hash</p>
            <div className="rounded-xl bg-zinc-800 p-3 text-sm text-zinc-200 break-all">
              {txHash}
            </div>
          </div>
        )}

        {status && <p className="text-sm text-sky-400">{status}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}
