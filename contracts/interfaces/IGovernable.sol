// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.8.10;

interface IGovernable {
    function governor() external view returns (address);

    function renounceGovernor() external;

    function pushGovernor(address newGovernor_) external;

    function pullGovernor() external;
}
