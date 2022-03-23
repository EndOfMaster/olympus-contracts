const { ethers } = require("hardhat");

const daiAddress = "0xD4358ca848f51CceeaE814C8046AC687d9A3Bc3b";
const bondAddress = "0x311169FF2e09443DE1f820eD1b3Ba974D6EA70d1";

const capacity = 10000e9;
const initialPrice = 400e9;
const buffer = 2e5;
const vesting = 1800;
const timeToConclusion = 60 * 60 * 24 * 180;
const depositInterval = 60 * 60 * 4;
const tuneInterval = 60 * 60;

let bond;

async function main() {
    let conclusion = (await getCurrentTime()) + timeToConclusion

    bond = (await ethers.getContractFactory("OlympusBondDepositoryV2")).attach(bondAddress);

    //BigNumber
    let marketId = await bond.callStatic.create(daiAddress,
        [capacity, initialPrice, buffer],
        [false, true],
        [vesting, conclusion],
        [depositInterval, tuneInterval]
    );
    await bond.create(daiAddress,
        [capacity, initialPrice, buffer],
        [false, true],
        [vesting, conclusion],
        [depositInterval, tuneInterval]
    );

    console.log("create market done, id: ", marketId.toString());
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