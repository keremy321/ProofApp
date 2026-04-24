import { useState } from "react";
import { hashFile } from "../lib/hashFile";
import { getContractReadOnly } from "../lib/contract";

export default function VerifyProof() {
  const [proofIdInput, setProofIdInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [computedHash, setComputedHash] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function handleVerify() {
    try {
      setError("");
      setResult(null);
      setStatus("");

      if (!proofIdInput.trim()) {
        throw new Error("Enter a proof ID.");
      }

      if (!selectedFile) {
        throw new Error("Select a file to verify.");
      }

      setStatus("Hashing uploaded file...");
      const uploadedHash = await hashFile(selectedFile);
      setComputedHash(uploadedHash);

      setStatus("Reading on-chain proof...");
      const contract = await getContractReadOnly();
      const proof = await contract.getProof(BigInt(proofIdInput));

      if (proof.creator === "0x0000000000000000000000000000000000000000") {
        setResult({
          status: "not_found",
          message: "Proof does not exist.",
        });
        setStatus("");
        return;
      }

      const matches =
        proof.fileHash.toLowerCase() === uploadedHash.toLowerCase();

      if (proof.revoked) {
        setResult({
          status: "revoked",
          message: "Proof exists but has been revoked.",
          proof,
          matches,
        });
      } else if (matches) {
        setResult({
          status: "valid",
          message: "File matches the stored on-chain proof.",
          proof,
          matches: true,
        });
      } else {
        setResult({
          status: "mismatch",
          message: "File does not match the stored on-chain proof.",
          proof,
          matches: false,
        });
      }

      setStatus("");
    } catch (err) {
      setError(err.message || "Verification failed.");
      setStatus("");
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white">Verify Proof</h2>

      <div className="mt-4 space-y-4">
        <input
          type="number"
          min="0"
          placeholder="Enter proof ID"
          value={proofIdInput}
          onChange={(e) => setProofIdInput(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-sm text-zinc-200"
        />

        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          className="block w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-sm text-zinc-200"
        />

        <button
          onClick={handleVerify}
          className="rounded-xl bg-blue-500 px-4 py-2 font-medium text-white transition hover:bg-blue-400"
        >
          Verify
        </button>

        {computedHash && (
          <div>
            <p className="mb-1 text-sm text-zinc-400">Uploaded File Hash</p>
            <div className="rounded-xl bg-zinc-800 p-3 text-sm text-zinc-200 break-all">
              {computedHash}
            </div>
          </div>
        )}

        {result && (
          <div className="rounded-xl bg-zinc-800 p-4 text-sm text-zinc-200">
            <p className="font-semibold">
              Result:{" "}
              <span className="uppercase">{result.status.replace("_", " ")}</span>
            </p>
            <p className="mt-1">{result.message}</p>

            {result.proof && (
              <div className="mt-4 space-y-2">
                <p className="break-all">
                  <span className="text-zinc-400">On-chain hash:</span>{" "}
                  {result.proof.fileHash}
                </p>
                <p className="break-all">
                  <span className="text-zinc-400">Creator:</span>{" "}
                  {result.proof.creator}
                </p>
                <p>
                  <span className="text-zinc-400">Created at:</span>{" "}
                  {result.proof.createdAt.toString()}
                </p>
                <p>
                  <span className="text-zinc-400">Revoked:</span>{" "}
                  {result.proof.revoked ? "Yes" : "No"}
                </p>
              </div>
            )}
          </div>
        )}

        {status && <p className="text-sm text-sky-400">{status}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}