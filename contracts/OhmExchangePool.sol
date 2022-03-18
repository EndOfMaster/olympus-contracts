// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.10;

import "./interfaces/IOHM.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OhmExchangePool is Ownable {
    IOHM public immutable ohm;

    OhmExchangePool public otherPool;
    IOHM public otherOhm;

    constructor(IOHM _ohm) Ownable() {
        ohm = _ohm;
    }

    function setOtherOhm(OhmExchangePool _pool) external onlyOwner {
        otherPool = _pool;
        otherOhm = _pool.ohm();
        ohm.approve(address(otherPool), type(uint256).max);
    }

    ///@dev user call this
    function transfer(uint256 _amount) external {
        ohm.transferFrom(msg.sender, address(this), _amount);
        otherPool.reception(msg.sender, _amount);
    }

    ///@dev transfer call this, Direct notification to another
    function reception(address _recipient, uint256 _amount) external {
        require(msg.sender == address(otherPool), "OhmExchangePool: must be other pool");
        otherOhm.transferFrom(address(otherPool), address(this), _amount);
        ohm.transfer(_recipient, _amount);
    }

    function supplyOhm(uint256 _amount) external onlyOwner {
        ohm.mint(address(this), _amount);
    }
}
