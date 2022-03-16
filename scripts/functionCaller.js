const { ethers } = require("hardhat");

const daiAddress = "0x2A74f1AC0Ca5be44006dDD3B3eD14C05Ea38F162";
const authorityAddress = "0xc6030F3Cc578F93Dc438c6a51AcabE81f45b358D";
const sOhmAddress = "0x9ae6C2F75038Cce7Ed73B4724F934B2a2F76E4c2";
const gOhmAddress = "0x3F6b053dFa7879A9AF7b11Ed22Ea56DB49ee7ecD";
const ohmAddress = "0x4d33BDfa6A0C4DBF913b33E2415D0F6FC1d2425F";
const treasuryAddress = "0x1AF8BFb98707D2982b1899cF9c58244f6D7B5fad";
const stakingAddress = "0xBaE7DA942EA417F9FBd5dAa304AdCEFcAe454Ae3";
const distributorAddress = "0x4CDEfcBd711558eB8A4175bE5AdFB92Cc3A36826";
const bondAddress = "0x7B35f18C20E82C7DEBD5ecB0A43AfF26197BB01A";

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