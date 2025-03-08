const { ethers, network } = require("hardhat");

/**
 * Deploy script for PolygonMLM to any network
 * Usage: npx hardhat run scripts/deploy.js --network <network_name>
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());
  console.log("Network:", network.name);

  // Deploy the contract
  const PolygonMLM = await ethers.getContractFactory("PolygonMLM");
  console.log("Deploying PolygonMLM...");
  const polygonMLM = await PolygonMLM.deploy();
  await polygonMLM.waitForDeployment();

  // Get contract address
  const contractAddress = await polygonMLM.getAddress();
  console.log("PolygonMLM deployed to:", contractAddress);
  console.log("Owner address:", await polygonMLM.getOwner());

  // Log verification command if not on local network
  if (network.name !== "localhost" && network.name !== "hardhat") {
    console.log("\nVerify with:");
    console.log(`npx hardhat verify --network ${network.name} ${contractAddress}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
