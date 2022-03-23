const { ethers } = require("hardhat");

const treasuryAddress = "0xc58525D2774a406eBCDcecE21202D28B77ff1B78";
const daiAddress = "0xD4358ca848f51CceeaE814C8046AC687d9A3Bc3b";
const ohmAddress = "0xD4358ca848f51CceeaE814C8046AC687d9A3Bc3b";

const daiAmount = ethers.utils.parseEther('1000000000')

async function main() {
    const [owner] = await ethers.getSigners();
    const treasury = (await ethers.getContractFactory("OlympusTreasury")).attach(treasuryAddress);
    const dai = (await ethers.getContractFactory("MockERC20")).attach(daiAddress);

    await dai.mint(owner.address, daiAmount);

    let tokenValue = await treasury.tokenValue(daiAddress, daiAmount)
    console.log("tokenValue: ", tokenValue.toString());

    await dai.approve(treasury.address, daiAmount);
    await treasury.deposit(daiAmount, daiAddress, tokenValue);

    console.log("treasury deposit done");
}

main()
    .then(() => process.exit())
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });