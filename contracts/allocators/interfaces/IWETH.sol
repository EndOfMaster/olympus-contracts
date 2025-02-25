// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.8.10;

import "../../interfaces/IERC20.sol";

interface IWETH is IERC20 {
    function deposit() external payable;

    function withdraw(uint256) external;
}
