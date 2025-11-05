const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Deployer balance:", (await deployer.getBalance()).toString());

  const network = await hre.ethers.provider.getNetwork();
  console.log("Network:", network.name);

  // Deploy TokenICO contract
  console.log("\nDeploying TokenICO contract...");
  const TokenICO = await hre.ethers.getContractFactory("TokenICO");
  const tokenICO = await TokenICO.deploy();
  await tokenICO.deployed();

  console.log("\nDeployment Successful");
  console.log("-----------------");
  console.log("NEXT_PUBLIC_TOKEN_ICO_ADDRESS:", tokenICO.address);
  console.log("NEXT_PUBLIC_OWNER_ADDRESS:", deployer.address);

  // Deploy LINKTUM token
  console.log("\nDeploying RPTOKEN contract...");
  const RPTOKEN = await hre.ethers.getContractFactory("RPTOKEN");
  const rptoken = await RPTOKEN.deploy();
  await rptoken.deployed();

  console.log("\nDeployment Successful");
  console.log("-----------------");
  console.log("NEXT_PUBLIC_RPTOKEN_ADDRESS:", rptoken.address);
  console.log("NEXT_PUBLIC_OWNER_ADDRESS:", deployer.address);
}

// ✅ Call main once, outside of itself
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
