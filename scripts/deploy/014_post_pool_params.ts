import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { waitFor } from "../txHelper";
import { CONTRACTS, INITIAL_REWARD_RATE, INITIAL_INDEX, BOUNTY_AMOUNT } from "../constants";
import {
    OhmExchangePool__factory
} from "../../types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, ethers } = hre;
    const { deployer } = await getNamedAccounts();
    const signer = await ethers.provider.getSigner(deployer);

    const exchangePoolDeployment = await deployments.get(CONTRACTS.pool);

    const pool = OhmExchangePool__factory.connect(exchangePoolDeployment.address, signer);

    const otherPool = "";

    // @ts-ignore
    if (otherPool !== "") {
        await waitFor(pool.setOtherOhm(otherPool));
        console.log("-----setOtherOhm done------");
    }else{
        console.log("setOtherOhm not have address");
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