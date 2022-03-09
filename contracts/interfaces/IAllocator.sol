// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.8.10;

interface IAllocator {
    // Should have deposit/withdraw methods (interfaces aren't standardized)
    function harvest() external;
}
