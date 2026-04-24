import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const artifactPath = resolve("artifacts/contracts/ProofRegistry.sol/ProofRegistry.json");
const outputPath = resolve("../frontend/src/lib/proofRegistryAbi.js");

async function main() {
  let artifactRaw;

  try {
    artifactRaw = await readFile(artifactPath, "utf8");
  } catch {
    throw new Error(
      "Artifact not found. Run 'npm run compile' first to generate artifacts."
    );
  }

  const artifact = JSON.parse(artifactRaw);

  if (!Array.isArray(artifact.abi)) {
    throw new Error("Invalid artifact format: 'abi' array is missing.");
  }

  const output = `export const PROOF_REGISTRY_ABI = ${JSON.stringify(
    artifact.abi,
    null,
    2
  )};\n`;

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output, "utf8");

  console.log(`ABI synced to ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
