import { BrowserProvider, Contract } from "ethers";
import { PROOF_REGISTRY_ABI } from "./proofRegistryAbi";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS?.trim() || "";
const CONTRACT_ABI = PROOF_REGISTRY_ABI;

export async function getProvider() {
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
    }

    return new BrowserProvider(window.ethereum);
}

export async function getSigner() {
    const provider = await getProvider();
    return provider.getSigner();
}

export async function getContractWithSigner() {
    if (!CONTRACT_ADDRESS) {
        throw new Error("VITE_CONTRACT_ADDRESS is not set.");
    }
    if (!Array.isArray(CONTRACT_ABI) || CONTRACT_ABI.length === 0) {
        throw new Error("Contract ABI is missing in src/lib/proofRegistryAbi.js.");
    }

    const signer = await getSigner();
    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

export async function getContractReadOnly() {
    if (!CONTRACT_ADDRESS) {
        throw new Error("VITE_CONTRACT_ADDRESS is not set.");
    }
    if (!Array.isArray(CONTRACT_ABI) || CONTRACT_ABI.length === 0) {
        throw new Error("Contract ABI is missing in src/lib/proofRegistryAbi.js.");
    }

    const provider = await getProvider();
    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

export { CONTRACT_ADDRESS, CONTRACT_ABI };