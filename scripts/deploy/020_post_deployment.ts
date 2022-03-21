import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers, network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { waitFor } from "../txHelper";
import { CONTRACTS, INITIAL_REWARD_RATE, INITIAL_INDEX, BOUNTY_AMOUNT } from "../constants";
import {
    OlympusAuthority__factory,
    Distributor__factory,
    OlympusStaking__factory,
    SOlympus__factory,
    GOHM__factory,
    OlympusTreasury__factory,
    IBondDepository__factory,
    OlympusTokenMigrator__factory,
    OhmExchangePool__factory
} from "../../types";

import * as fs from 'fs-extra'

interface DeployStatus {
    authorityPushVaultTreasury: boolean,
    authorityAddMinterPool: boolean,
    treasuryEnableDistributor: boolean,
    stakingSetDistributor: boolean,
    distributorSetBounty: boolean,
    distributorAddRecipientStaking: boolean,
    gOhmAddMinterStaking: boolean,
    gOhmAddMinterMigrator: boolean,
    treasuryEnableBondDepo: boolean,
    bondDepoCreate: boolean,
    sOhmSetIndex: boolean,
    sOhmSetgOHM: boolean,
    sOhmInitialize: boolean,

};

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, ethers } = hre;
    const { deployer } = await getNamedAccounts();
    const signer = await ethers.provider.getSigner(deployer);
    const networkName = network.name;
    let deployStatus: DeployStatus;

    const authorityDeployment = await deployments.get(CONTRACTS.authority);
    const sOhmDeployment = await deployments.get(CONTRACTS.sOhm);
    const gOhmDeployment = await deployments.get(CONTRACTS.gOhm);
    const distributorDeployment = await deployments.get(CONTRACTS.distributor);
    const treasuryDeployment = await deployments.get(CONTRACTS.treasury);
    const stakingDeployment = await deployments.get(CONTRACTS.staking);
    const bondDepoDeployment = await deployments.get(CONTRACTS.bondDepo);
    const migratorDeployment = await deployments.get(CONTRACTS.migrator);
    const exchangePoolDeployment = await deployments.get(CONTRACTS.pool);

    const daiDeployment = await deployments.get(CONTRACTS.DAI);

    const authorityContract = await OlympusAuthority__factory.connect(
        authorityDeployment.address,
        signer
    );
    const sOhm = SOlympus__factory.connect(sOhmDeployment.address, signer);
    const gOhm = GOHM__factory.connect(gOhmDeployment.address, signer);
    const distributor = Distributor__factory.connect(distributorDeployment.address, signer);
    const staking = OlympusStaking__factory.connect(stakingDeployment.address, signer);
    const treasury = OlympusTreasury__factory.connect(treasuryDeployment.address, signer);
    const bondDepo = IBondDepository__factory.connect(bondDepoDeployment.address, signer);
    const migrator = OlympusTokenMigrator__factory.connect(migratorDeployment.address, signer);
    const pool = OhmExchangePool__factory.connect(exchangePoolDeployment.address, signer);

    deployStatus = getDeployStatus(networkName)
    if (!deployStatus.authorityPushVaultTreasury) {
        await waitFor(authorityContract.pushVault(treasury.address, true));
        deployStatus.authorityPushVaultTreasury = true;
        saveDeployStauts(networkName, deployStatus);
        console.log("Setup -- authorityContract.pushVault: set vault on authority");
    } else {
        console.log("authority pushVault treasury is set");
    }

    deployStatus = getDeployStatus(networkName)
    if (!deployStatus.authorityAddMinterPool) {
        await waitFor(authorityContract.addMinter(pool.address));
        deployStatus.authorityAddMinterPool = true;
        saveDeployStauts(networkName, deployStatus);
        console.log("add ExchangePool to ohm minter");
    } else {
        console.log("add ExchangePool is set");
    }

    deployStatus = getDeployStatus(networkName)
    if (!deployStatus.treasuryEnableDistributor) {
        await waitFor(treasury.enable(8, distributor.address, ethers.constants.AddressZero)); // Allows distributor to mint ohm.
        deployStatus.treasuryEnableDistributor = true;
        saveDeployStauts(networkName, deployStatus);
        console.log("Setup -- treasury.enable(8):  distributor enabled to mint ohm on treasury");
    } else {
        console.log("treasury enable 8 distributor  is set");
    }

    deployStatus = getDeployStatus(networkName)
    if (!deployStatus.stakingSetDistributor) {
        await waitFor(staking.setDistributor(distributor.address));
        deployStatus.stakingSetDistributor = true;
        saveDeployStauts(networkName, deployStatus);
        console.log("Setup -- staking.setDistributor:  distributor set on staking");
    } else {
        console.log("staking setDistributor is set");
    }

    deployStatus = getDeployStatus(networkName)
    if (!deployStatus.sOhmSetIndex) {
        //Duplicate settings cannot succeed
        await waitFor(sOhm.setIndex(INITIAL_INDEX));
        deployStatus.sOhmSetIndex = true;
        saveDeployStauts(networkName, deployStatus);
        console.log("Setup -- sOhm.setIndex");
    } else {
        console.log("sOhm setIndex is set");
    }

    deployStatus = getDeployStatus(networkName)
    if (!deployStatus.sOhmSetgOHM) {
        //Duplicate settings cannot succeed
        await waitFor(sOhm.setgOHM(gOhm.address));
        deployStatus.sOhmSetgOHM = true;
        saveDeployStauts(networkName, deployStatus);
        console.log("Setup -- sOhm.setgOHM");
    } else {
        console.log("sOhm setgOHM is set");
    }

    deployStatus = getDeployStatus(networkName)
    if (!deployStatus.sOhmInitialize) {
        //Duplicate settings cannot succeed
        await waitFor(sOhm.initialize(staking.address, treasuryDeployment.address));
        deployStatus.sOhmInitialize = true;
        saveDeployStauts(networkName, deployStatus);
        console.log("Setup -- sohm initialized");
    } else {
        console.log("sOhm Initialize is set");
    }

    deployStatus = getDeployStatus(networkName)
    if (!deployStatus.distributorSetBounty) {
        await waitFor(distributor.setBounty(BOUNTY_AMOUNT));
        deployStatus.distributorSetBounty = true;
        saveDeployStauts(networkName, deployStatus);
        console.log("Setup -- distributor.setBounty ");
    } else {
        console.log("distributor setBounty is set");
    }

    deployStatus = getDeployStatus(networkName)
    if (!deployStatus.distributorAddRecipientStaking) {
        await waitFor(distributor.addRecipient(staking.address, INITIAL_REWARD_RATE));
        deployStatus.distributorAddRecipientStaking = true;
        saveDeployStauts(networkName, deployStatus);
        console.log("Setup -- distributor.addRecipient");
    } else {
        console.log("distributor addRecipient is set");
    }

    deployStatus = getDeployStatus(networkName)
    if (!deployStatus.gOhmAddMinterMigrator) {
        await waitFor(gOhm.addMinter(migrator.address))
        deployStatus.gOhmAddMinterMigrator = true;
        saveDeployStauts(networkName, deployStatus);
        console.log("gOHM add Minter migrator done");
    } else {
        console.log("gOHM add Minter migrator is set");
    }

    deployStatus = getDeployStatus(networkName)
    if (!deployStatus.gOhmAddMinterStaking) {
        await waitFor(gOhm.addMinter(staking.address))
        deployStatus.gOhmAddMinterStaking = true;
        saveDeployStauts(networkName, deployStatus);
        console.log("gOHM add Minter staking done");
    } else {
        console.log("gOHM add Minter staking is set");
    }

    let capacity = 10000e9;
    let initialPrice = 400e9;
    let buffer = 2e5;

    let vesting = 1800;
    let timeToConclusion = 60 * 60 * 24 * 180;
    let conclusion = (await getCurrentTime()) + timeToConclusion

    let depositInterval = 60 * 60 * 4;
    let tuneInterval = 60 * 60;

    deployStatus = getDeployStatus(networkName)
    if (!deployStatus.treasuryEnableBondDepo) {
        await waitFor(treasury.enable(8, bondDepoDeployment.address, ethers.constants.AddressZero)); // Allows distributor to mint ohm.
        deployStatus.treasuryEnableBondDepo = true
        saveDeployStauts(networkName, deployStatus);
        console.log("Setup -- treasury.enable(8):  bondDepoDeployment enabled to mint ohm on treasury");
    } else {
        console.log("treasury Enable BondDepo is set");
    }

    if (!deployStatus.bondDepoCreate) {
        await waitFor(bondDepo.create(
            daiDeployment.address,
            [capacity, initialPrice, buffer],
            [false, true],
            [vesting, conclusion],
            [depositInterval, tuneInterval]
        ))
        deployStatus.bondDepoCreate = true;
        saveDeployStauts(networkName, deployStatus);
        console.log("Setup -- create bonds");
    } else {
        console.log("bond create is created");
    }
};

func.tags = ["setup"];
func.dependencies = [CONTRACTS.ohm, CONTRACTS.sOhm, CONTRACTS.gOhm, CONTRACTS.bondDepo, CONTRACTS.DAI];

export default func;

async function getCurrentTime() {
    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    return block.timestamp;
}

function saveDeployStauts(networkName: string, deployStatus: DeployStatus) {
    fs.writeFileSync("deployments/" + networkName + "/postDeploy.json", JSON.stringify(deployStatus))
}

function getDeployStatus(networkName: string) {
    if (!fs.existsSync("deployments/" + networkName + "/postDeploy.json")) {
        let b: DeployStatus = {
            authorityPushVaultTreasury: false,
            authorityAddMinterPool: false,
            treasuryEnableDistributor: false,
            stakingSetDistributor: false,
            distributorSetBounty: false,
            distributorAddRecipientStaking: false,
            gOhmAddMinterStaking: false,
            gOhmAddMinterMigrator: false,
            treasuryEnableBondDepo: false,
            bondDepoCreate: false,
            sOhmSetIndex: false,
            sOhmSetgOHM: false,
            sOhmInitialize: false,
        }
        fs.writeFileSync("deployments/" + networkName + "/postDeploy.json", JSON.stringify(b));
    }
    return JSON.parse(fs.readFileSync("deployments/" + networkName + "/postDeploy.json", 'utf-8'));
}