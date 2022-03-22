const { ethers } = require("hardhat");

const daiAddress = "0xD4358ca848f51CceeaE814C8046AC687d9A3Bc3b";
const bondAddress = "0x311169FF2e09443DE1f820eD1b3Ba974D6EA70d1";

const marketId = 2;

let bond;

async function main() {

    bond = (await ethers.getContractFactory("OlympusBondDepositoryV2")).attach(bondAddress);

    let liveMarkets = await bond.liveMarkets();
    let liveMarketId = liveMarkets[0];
    console.log(liveMarketId);

    let marketPrice = await bond.marketPrice(liveMarketId);
    console.log("marketPrice: ", marketPrice);

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