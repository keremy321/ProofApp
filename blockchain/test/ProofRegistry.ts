import { describe, it } from "node:test";
import assert from "node:assert/strict";
import hre from "hardhat";

interface Proof {
    fileHash: string;
    creator: string;
    revoked: boolean;
    createdAt: bigint;
}

describe("ProofRegistry", async () => {
    it("should create a proof", async () => {
        const { viem } = await hre.network.create();

        const publicClient = await viem.getPublicClient();
        const [walletClient] = await viem.getWalletClients();

        const proofRegistry = await viem.deployContract("ProofRegistry");

        const fileHash = "0x1111111111111111111111111111111111111111111111111111111111111111";

        const txHash = await proofRegistry.write.createProof([fileHash]);
        await publicClient.waitForTransactionReceipt({ hash: txHash });

        const nextProofId = await proofRegistry.read.nextProofId();
        assert.equal(nextProofId, 1n);

        const proof = await proofRegistry.read.getProof([0n]) as Proof;

        assert.equal(
            proof.fileHash.toLowerCase(),
            fileHash.toLowerCase()
        );
        assert.equal(proof.creator.toLowerCase(), walletClient.account.address.toLocaleLowerCase());
        assert.equal(proof.revoked, false);
        assert.ok(proof.createdAt > 0n);
    });

    it("should allow creator to revoke proof", async () => {
        const { viem } = await hre.network.create();

        const publicClient = await viem.getPublicClient();
        const proofRegistry = await viem.deployContract("ProofRegistry");

        const fileHash = "0x2222222222222222222222222222222222222222222222222222222222222222";

        const createTx = await proofRegistry.write.createProof([fileHash]);
        await publicClient.waitForTransactionReceipt({ hash: createTx });

        const revokeTx = await proofRegistry.write.revokeProof([0n]);
        await publicClient.waitForTransactionReceipt({ hash: revokeTx })

        const proof = await proofRegistry.read.getProof([0n]) as Proof;
        assert.equal(proof.revoked, true);
    });

    it("should reject zero hash", async () => {
        const { viem } = await hre.network.create();
        const proofRegistry = await viem.deployContract("ProofRegistry");
        
        await assert.rejects(async () => {
            await proofRegistry.write.createProof([
                "0x0000000000000000000000000000000000000000000000000000000000000000",
            ]);
        });
    });
});