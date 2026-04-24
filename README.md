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
npm run node:local
npm run deploy:local
npm run deploy:sepolia

# ABI
npm run abi:sync

# Frontend
npm run frontend:dev
npm run frontend:build
npm run frontend:lint
```

## How To Run (Local)

Use 3 terminals:

1. Start local blockchain node:

```bash
npm run node:local
```

2. Deploy contract to local node:

```bash
npm run deploy:local
```

3. Set contract address in frontend env:

```env
VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

4. Start frontend:

```bash
npm run frontend:dev
```

Optional for MetaMask local testing:

- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Import one private key shown in the local node terminal.

## Environment Variables

Blockchain (for deploy/network):

- `SEPOLIA_RPC_URL`
- `SEPOLIA_PRIVATE_KEY`

Frontend:

- `VITE_CONTRACT_ADDRESS`