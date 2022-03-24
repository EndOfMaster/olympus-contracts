const { ethers } = require("hardhat");

const daiAddress = "0xD4358ca848f51CceeaE814C8046AC687d9A3Bc3b";
const ohmAddress = "0xc3593B4A74433A396Fe46eAEfD5F872AefcCE246";
const bondAddress = "0x311169FF2e09443DE1f820eD1b3Ba974D6EA70d1";
const sohmAddress = "0x3D669267c74BF1827561473F0196C0f0DcF2fFD4";
const gohmAddress = "0x38C671c6cAEf718f8160AB50bFCB68FA3Dfe4D90";
const treasuryAddress = "0xc58525D2774a406eBCDcecE21202D28B77ff1B78";
const stakingAddress = "0xfCc3582b6C240b2F8552cC8bd664998Cd88E8DDc"

async function main() {
    const [dao, user] = await ethers.getSigners();

    const bond = (await ethers.getContractFactory("OlympusBondDepositoryV2")).attach(bondAddress);
    const dai = (await ethers.getContractFactory("MockERC20")).attach(daiAddress);
    const ohm = (await ethers.getContractFactory("OlympusERC20Token")).attach(ohmAddress);
    const sohm = (await ethers.getContractFactory("sOlympus")).attach(sohmAddress);
    const gohm = (await ethers.getContractFactory("gOHM")).attach(gohmAddress);
    const treasury = (await ethers.getContractFactory("OlympusTreasury")).attach(treasuryAddress);
    const staking = (await ethers.getContractFactory("OlympusStaking")).attach(stakingAddress);

    let info = {
        dao: {},
        user: {},
        bond: {},
        treasury: {},
        staking: {},
    };

    info.dao.dai = (await dai.balanceOf(dao.getAddress())).toString();
    info.dao.ohm = (await ohm.balanceOf(dao.getAddress())).toString();
    info.dao.sohm = (await sohm.balanceOf(dao.getAddress())).toString();
    info.dao.gohm = (await gohm.balanceOf(dao.getAddress())).toString();
    info.dao.pendingFors = await pendingFors(bond, dao.getAddress());

    info.user.dai = (await dai.balanceOf(user.getAddress())).toString();
    info.user.ohm = (await ohm.balanceOf(user.getAddress())).toString();
    info.user.sohm = (await sohm.balanceOf(user.getAddress())).toString();
    info.user.gohm = (await gohm.balanceOf(user.getAddress())).toString();
    info.user.pendingFors = await pendingFors(bond, user.getAddress());

    info.bond.dai = (await dai.balanceOf(bond.address)).toString();
    info.bond.ohm = (await ohm.balanceOf(bond.address)).toString();
    info.bond.sohm = (await sohm.balanceOf(bond.address)).toString();
    info.bond.gohm = (await gohm.balanceOf(bond.address)).toString();

    info.treasury.dai = (await dai.balanceOf(treasury.address)).toString();
    info.treasury.ohm = (await ohm.balanceOf(treasury.address)).toString();
    info.treasury.sohm = (await sohm.balanceOf(treasury.address)).toString();
    info.treasury.gohm = (await gohm.balanceOf(treasury.address)).toString();

    info.staking.dai = (await dai.balanceOf(staking.address)).toString();
    info.staking.ohm = (await ohm.balanceOf(staking.address)).toString();
    info.staking.sohm = (await sohm.balanceOf(staking.address)).toString();
    info.staking.gohm = (await gohm.balanceOf(staking.address)).toString();

    console.log(JSON.stringify(info, null, 2));
}

async function pendingFors(bond, address) {
    let indexesFor = await bond.indexesFor(address)
    let pendingFors = []
    for (let i = 0; i < indexesFor.length; i++) {
        let b = {}
        b.index = indexesFor[i].toString();
        let pendingFor = await bond.pendingFor(address, indexesFor[i]);
        b.payout = pendingFor[0].toString()
        b.matured = pendingFor[1].toString()
        pendingFors.push(b);
    }
    return pendingFors;
}

main()
    .then(() => process.exit())
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });