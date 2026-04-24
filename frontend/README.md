# ProofApp Frontend

React + Vite client for wallet connection, proof creation, and proof verification.

## Structure

```text
frontend/
	src/
		components/
			WalletConnect.jsx
			CreateProof.jsx
			VerifyProof.jsx
		lib/
			contract.js
			hashFile.js
			proofRegistryAbi.js
		App.jsx
		main.jsx
```

## Run

```bash
npm install
npm run dev
```

## Environment

Create `.env` in this folder:

```env
VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

## ABI Source of Truth

Do not hand-edit ABI unless needed.

From project root, sync ABI from Hardhat artifacts:

```bash
npm run abi:sync
```

This updates `src/lib/proofRegistryAbi.js` automatically.
