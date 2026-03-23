import { artifacts, ethers } from "hardhat";
import { mkdirSync, writeFileSync } from "fs";
import path from "path";

async function main() {
  const factory = await ethers.getContractFactory("PaymentEscrow");
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  const artifact = await artifacts.readArtifact("PaymentEscrow");

  console.log("PaymentEscrow deployed to:", address);

  const generatedDir = path.resolve(__dirname, "../frontend/lib/generated");
  mkdirSync(generatedDir, { recursive: true });

  writeFileSync(
    path.join(generatedDir, "escrowAddress.ts"),
    `export const ESCROW_ADDRESS = "${address}" as const;\n`
  );

  writeFileSync(
    path.join(generatedDir, "escrowAbi.ts"),
    `export const ESCROW_ABI = ${JSON.stringify(artifact.abi, null, 2)} as const;\n`
  );

  console.log("Frontend artifacts synced to frontend/lib/generated");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
