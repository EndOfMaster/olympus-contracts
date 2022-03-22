const { ethers } = require("hardhat");

const pool1Address = "0xdbBFa7Dd7ba436236B02e5771aEfdd12ba356a37";
const pool2Address = "0xd75bE7d4beA6A27e01983073D0960983218472D6";

const supplyAmount = ethers.BigNumber.from(1e9).mul(1000000)

async function main() {

    const pool1 = (await ethers.getContractFactory("OhmExchangePool")).attach(pool1Address);
    const pool2 = (await ethers.getContractFactory("OhmExchangePool")).attach(pool2Address);

    await pool1.supplyOhm(supplyAmount);
    console.log("pool1 supplyOhm done");
    await pool2.supplyOhm(supplyAmount);
    console.log("pool2 supplyOhm done");
}

main()
    .then(() => process.exit())
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

async function getCurrentTime() {
    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    return block.timestamp;
}