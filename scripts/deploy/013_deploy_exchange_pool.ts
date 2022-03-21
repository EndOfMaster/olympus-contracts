import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { CONTRACTS } from "../constants";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const ohmDeployment = await deployments.get(CONTRACTS.ohm);

    await deploy(CONTRACTS.pool, {
        from: deployer,
        args: [
            ohmDeployment.address,
        ],
        log: true,
    });

};

func.tags = [CONTRACTS.pool, "pool"];
func.dependencies = [
    CONTRACTS.ohm,
];

export default func;
