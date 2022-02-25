import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { CONTRACTS } from "../constants";
import { waitFor } from "../txHelper";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const authorityDeployment = await deployments.get(CONTRACTS.authority);
    const ohmDeployment = await deployments.get(CONTRACTS.ohm);
    const gOhmDeployment = await deployments.get(CONTRACTS.gOhm);
    const stakingDeployment = await deployments.get(CONTRACTS.staking);

    // TODO: firstEpochBlock is passed in but contract constructor param is called _nextEpochBlock
    await deploy(CONTRACTS.bondDepo, {
        from: deployer,
        args: [
            authorityDeployment.address,
            ohmDeployment.address,
            gOhmDeployment.address,
            stakingDeployment.address,
        ],
        log: true,
    });

};

func.tags = [CONTRACTS.bondDepo, "bondDepo"];
func.dependencies = [
    CONTRACTS.authority,
    CONTRACTS.ohm,
    CONTRACTS.gohm,
    CONTRACTS.staking,
    CONTRACTS.DAI,
    CONTRACTS.treasury,
];

export default func;
