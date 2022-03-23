const { ethers } = require("hardhat");
const { getOwnerBalance } = require("./utils")

const daiAddress = "0xD4358ca848f51CceeaE814C8046AC687d9A3Bc3b";
const ohmAddress = "0xD4358ca848f51CceeaE814C8046AC687d9A3Bc3b";
const stakingAddress = "0xD4358ca848f51CceeaE814C8046AC687d9A3Bc3b";
const bondAddress = "0x311169FF2e09443DE1f820eD1b3Ba974D6EA70d1";

const BASE = ethers.utils.parseEther("1");

const referralAddress = "0xFb9C88214bC0AB089fdC387342eFf3ebE61FC23d"

//maxPrice
const initialPrice = 400e9;
const bondAmount = 2000;

async function main() {

    const [owner] = await ethers.getSigners();

    const bond = (await ethers.getContractFactory("OlympusBondDepositoryV2")).attach(bondAddress);
    const dai = (await ethers.getContractFactory("MockERC20")).attach(daiAddress);
    const ohm = (await ethers.getContractFactory("OlympusERC20Token")).attach(ohmAddress);

    await dai.approve(bond.address, ethers.utils.parseEther(bondAmount + ''));

    const liveMarkets = await bond.liveMarkets();
    console.log("live markets: ", liveMarkets);
    const liveMarketId = liveMarkets[0];

    const marketPrice = await bond.marketPrice(liveMarketId);
    console.log("Select liveMarketId: ", liveMarketId.toString(), ", marketPrice: ", marketPrice.toString());

    await getOwnerBalance()

    // let market = await bond.markets(liveMarketId);

    let maxPayout = ((await bond.markets(liveMarketId))[4]).toNumber();

    let payoutFor = (await bond.payoutFor(ethers.utils.parseEther(bondAmount + ''), liveMarketId)).toNumber();
    console.log("maxPayout:", maxPayout, ", bond amount:", bondAmount, ", can get: ", payoutFor, "sohm,",
        (payoutFor <= maxPayout ? "allow bond" : "not allow bond"));

    if (payoutFor > maxPayout) {
        console.log("Exceeding market capacity unable bond");
        return;
    }

    await bond.deposit(liveMarketId, BASE.mul(bondAmount), initialPrice, owner.address, referralAddress)

    await getOwnerBalance()

}

main()
    .then(() => process.exit())
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });