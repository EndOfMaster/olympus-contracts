const { ethers } = require("hardhat");

const bondAddress = "0x311169FF2e09443DE1f820eD1b3Ba974D6EA70d1";

const marketId = "0"

async function main() {
    if (marketId !== "") {
        const bond = (await ethers.getContractFactory("OlympusBondDepositoryV2")).attach(bondAddress);

        await bond.close(marketId);

        console.log("marketId: ", marketId, ", close done");
    } else {
        console.log("not have marketId");
    }
}

main()
    .then(() => process.exit())
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });