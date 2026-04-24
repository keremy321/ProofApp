import { useState } from "react";
import { hashFile } from "../lib/hashFile";
import { getContractWithSigner } from "../lib/contract";

export default function CreateProof({ account }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileHash, setFileHash] = useState("");
  const [proofId, setProofId] = useState("");
  const [txHash, setTxHash] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function handleHashFile() {
    try {
      setError("");
      setStatus("");
      setProofId("");
      setTxHash("");

      if (!selectedFile) {
        throw new Error("Please select a file first.");
      }

      setStatus("Hashing file...");
      const hash = await hashFile(selectedFile);
      setFileHash(hash);
      setStatus("File hashed successfully.");
    } catch (err) {
      setError(err.message || "Failed to hash file.");
      setStatus("");
    }
  }

  async function handleCreateProof() {
    try {
      setError("");
      setProofId("");
      setTxHash("");

      if (!account) {
        throw new Error("Connect your wallet first.");
      }

      if (!selectedFile) {
        throw new Error("Please select a file first.");
      }

      let hash = fileHash;
      if (!hash) {
        setStatus("Hashing file...");
        hash = await hashFile(selectedFile);
        setFileHash(hash);
      }

      setStatus("Sending transaction...");
      const contract = await getContractWithSigner();
      const tx = await contract.createProof(hash);
      setTxHash(tx.hash);

      setStatus("Waiting for confirmation...");
      const receipt = await tx.wait();

      let createdProofId = null;

      for (const log of receipt.logs) {
        try {
          const parsedLog = contract.interface.parseLog(log);
          if (parsedLog && parsedLog.name === "ProofCreated") {
            createdProofId = parsedLog.args.proofId.toString();
            break;
          }
        } catch {

        }
      }

      setProofId(createdProofId ?? "Created, but proof ID could not be parsed.");
      setStatus("Proof created successfully.");
    } catch (err) {
      setError(err.message || "Failed to create proof.");
      setStatus("");
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white">Create Proof</h2>

      <div className="mt-4 space-y-4">
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          className="block w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-sm text-zinc-200"
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleHashFile}
            className="rounded-xl bg-zinc-200 px-4 py-2 font-medium text-black transition hover:bg-white"
          >
            Hash File
          </button>

          <button
            onClick={handleCreateProof}
            className="rounded-xl bg-emerald-500 px-4 py-2 font-medium text-white transition hover:bg-emerald-400"
          >
            Create Proof On-Chain
          </button>
        </div>

        {fileHash && (
          <div>
            <p className="mb-1 text-sm text-zinc-400">SHA-256 Hash</p>
            <div className="rounded-xl bg-zinc-800 p-3 text-sm text-zinc-200 break-all">
              {fileHash}
            </div>
          </div>
        )}

        {proofId && (
          <div>
            <p className="mb-1 text-sm text-zinc-400">Proof ID</p>
            <div className="rounded-xl bg-zinc-800 p-3 text-sm text-zinc-200">
              {proofId}
            </div>
          </div>
        )}

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