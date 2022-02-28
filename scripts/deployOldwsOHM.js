const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account: " + deployer.address);

    const oldsOHM = "0xEE173BCFfc24c4b637294EcAb025d46Ff46b4692";

    const WSOHM = await ethers.getContractFactory("wOHM");
    const wsOHM = await WSOHM.deploy(oldsOHM);

    console.log("old wsOHM: " + wsOHM.address);
}

main()
    .then(() => process.exit())
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
