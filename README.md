# ProofApp

ProofApp is a smart-contract + frontend project for creating and verifying file integrity proofs on-chain.

## Project Structure

```text
ProofApp/
	blockchain/              Hardhat workspace
		contracts/             Solidity contracts
		ignition/modules/      Hardhat Ignition deployment modules
		scripts/               Utility scripts (ABI sync)
		test/                  Hardhat tests
		hardhat.config.ts
		package.json
		tsconfig.json
	frontend/                React + Vite dApp UI
	package.json             Root workspace manager
```

## What Lives Where

- blockchain/contracts/ProofRegistry.sol: On-chain proof registry contract.
- blockchain/ignition/modules/ProofRegistry.ts: Deployment definition.
- blockchain/test/ProofRegistry.ts: Contract behavior tests.
- blockchain/scripts/sync-abi.mjs: Copies ABI from Hardhat artifact into frontend source.
- frontend/src/lib/contract.js: Ethers contract/provider helpers.
- frontend/src/lib/proofRegistryAbi.js: Frontend ABI file generated from artifact.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Compile contracts (this also syncs ABI to frontend automatically):

```bash
npm run compile
```

## Common Commands

```bash
# Contracts
npm run compile
npm run test
npm run deploy:local
npm run deploy:sepolia

# ABI
npm run abi:sync

# Frontend
npm run frontend:dev
npm run frontend:build
npm run frontend:lint
```

## Environment Variables

Blockchain (for deploy/network):

- `SEPOLIA_RPC_URL`
- `SEPOLIA_PRIVATE_KEY`

Frontend:

- `VITE_CONTRACT_ADDRESS`