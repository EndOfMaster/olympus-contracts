import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { CONTRACTS } from "../constants";

// Mainnet Addresses addresses
const oldOHM = "0xE68305314744EA5e6AD321d4Edf0507473d629e9";
const oldsOHM = "0xEE173BCFfc24c4b637294EcAb025d46Ff46b4692";
const oldStaking = "0x4c49e6A1E69eb0117Db03d6f2717a1e8E7E9938C";
const oldwsOHM = "0x0235F7762e983F9FD22dBd4851A3ab69848e7187";
const sushiRouter = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";
const uniRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const oldTreasury = "0xdeFCA54E6e1B2767538E8700892d240BFcD5ba23";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const authorityDeployment = await deployments.get(CONTRACTS.authority);

    await deploy(CONTRACTS.migrator, {
        from: deployer,
        args: [
            oldOHM,
            oldsOHM,
            oldTreasury,
            oldStaking,
            oldwsOHM,
            sushiRouter,
            uniRouter,
            "0",
            authorityDeployment.address,
        ],
        log: true,
        skipIfAlreadyDeployed: true,
    });
};

func.tags = [CONTRACTS.migrator, "migration"];

export default func;
