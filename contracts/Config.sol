// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.0;

import '@openzeppelin/contracts/access/Ownable.sol';

import "./ERC20.sol";

/// @title Config contract
/// @notice Base contract that helps for admins control marketplace rules
contract Config is Ownable {
    /// @dev state variable that save count users those sent request to became a seller
    uint8 internal potentialSellersCount = 0;
    /// @notice state variable that save count users those can send request to became a seller
    uint8 public potentialSellersLimit = 2;
    /// @notice save who would like to became a seller
    address[] public potentialSellers;

    /// @notice allowed or not allowed clients send request to became a seller
    bool public allowBecamePotentialSellers = true;

    /// @notice ERC20 contract connected with marketplace. This tokens can be used for auction stuff
    ERC20 public erc20Contract;

    /// @dev allowed or not allowed clients send request to became a seller
    bool private stopped = false;

    constructor() public {
        erc20Contract = new ERC20(1000000);
    }

    modifier stopInEmergency() {
        require(!stopped);
        _;
    }

    modifier onlyInEmergency() {
        require(stopped);
        _;
    }

    modifier hasFreeSlot() {
        require(allowBecamePotentialSellers);
        require(potentialSellersLimit > potentialSellersCount);
        _;
    }

    /// @notice function that helps stop contract in emergency situation and unblock after fixes
    function setStopValue(bool _stopped) external onlyOwner {
        stopped = _stopped;
    }

    /// @notice one of the function that provide for control basic marketplace settings; change max count of possible seller requests
    function changePotentialSellersLimit(uint8 _limit) external onlyOwner {
        potentialSellersLimit = _limit;
    }

    /// @notice one of the function that provide for control basic marketplace settings; allowed or no allowed send seller requests
    function managePossibilityToBecomePotentialSeller(bool possibility) external onlyOwner {
        allowBecamePotentialSellers = possibility;
    }

    /// @notice destruct contract
    function kill() external {
        if (msg.sender == owner()) {
            selfdestruct(address(uint160(owner())));
        }
    }
}
