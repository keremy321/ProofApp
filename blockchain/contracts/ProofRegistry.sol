// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ProofRegistry {
    struct Proof {
        bytes32 fileHash;
        address creator;
        uint256 createdAt;
        bool revoked;
    }

    uint256 public nextProofId;
    mapping (uint256 => Proof) private proofs;

    event ProofCreated(
        uint256 indexed proofId,
        bytes32 indexed fileHash,
        address indexed creator,
        uint256 createdAt
    );

    event ProofRevoked(uint256 indexed proofId, address indexed revokedBy);

    function createProof(bytes32 fileHash) external returns (uint256 proofId) {
        require(fileHash != bytes32(0), "Invalid file hash");

        proofId = nextProofId;

        proofs[proofId] = Proof({
            fileHash: fileHash,
            creator: msg.sender,
            createdAt: block.timestamp,
            revoked: false
        });

        nextProofId += 1;

        emit ProofCreated(proofId, fileHash, msg.sender, block.timestamp);
    }

    function getProof(uint256 proofId) external view returns (Proof memory) {
        return proofs[proofId];
    }

    function revokeProof(uint256 proofId) external {
        Proof storage proof = proofs[proofId];

        require(proof.creator != address(0), "Proof does not exist");
        require(proof.creator == msg.sender, "Not proof creator");
        require(!proof.revoked, "Proof already revoked");

        proof.revoked = true;

        emit ProofRevoked(proofId, msg.sender);
    }
}