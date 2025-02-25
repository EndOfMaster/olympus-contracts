// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.8.10;

interface IOwnable {
    function owner() external view returns (address);

    function renounceManagement() external;

    function pushManagement(address newOwner_) external;

    function pullManagement() external;
}
