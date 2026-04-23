import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ProofRegistryModule = buildModule("ProofRegistryModule", (m) => {
    const proofRegistry = m.contract("ProofRegistry");

    return { proofRegistry };
});

export default ProofRegistryModule;