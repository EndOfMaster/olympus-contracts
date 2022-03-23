const { ethers } = require("hardhat");

const daiAddress = "0xD4358ca848f51CceeaE814C8046AC687d9A3Bc3b";
const ohmAddress = "0xc3593B4A74433A396Fe46eAEfD5F872AefcCE246";
const bondAddress = "0x311169FF2e09443DE1f820eD1b3Ba974D6EA70d1";
const sohmAddress = "0x3D669267c74BF1827561473F0196C0f0DcF2fFD4";
const gohmAddress = "0x38C671c6cAEf718f8160AB50bFCB68FA3Dfe4D90";

async function getOwnerBalance() {
    const [owner] = await ethers.getSigners();
    console.log("owner: ", owner.address);

    const bond = (await ethers.getContractFactory("OlympusBondDepositoryV2")).attach(bondAddress);
    const dai = (await ethers.getContractFactory("MockERC20")).attach(daiAddress);
    const ohm = (await ethers.getContractFactory("OlympusERC20Token")).attach(ohmAddress);
    const sohm = (await ethers.getContractFactory("sOlympus")).attach(sohmAddress);
    const gohm = (await ethers.getContractFactory("gOHM")).attach(gohmAddress);

    let daiBalance = await dai.balanceOf(owner.address)
    console.log("daiBalance: ", daiBalance.toString());

    let ohmBalance = await ohm.balanceOf(owner.address)
    console.log("ohmBalance: ", ohmBalance.toString());

    let sohmBalance = await sohm.balanceOf(owner.address)
    console.log("sohmBalance: ", sohmBalance.toString());

    let gohmBalance = await gohm.balanceOf(owner.address)
    console.log("gohmBalance: ", gohmBalance.toString());
}

module.exports = {
    getOwnerBalance: getOwnerBalance
}