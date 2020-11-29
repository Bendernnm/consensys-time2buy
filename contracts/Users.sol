// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.0;

import "./Config.sol";
import "./ERC20.sol";

/// @title Users contract
/// @notice Contract that contains features for control users
contract Users is Config {
    /// @dev user type - is not registered
    uint8 constant internal TYPE_IS_NOT_REGISTERED = 0;
    /// @dev user type - blocked
    uint8 constant internal TYPE_BLOCKED = 1;
    /// @dev user type - potential seller
    uint8 constant internal TYPE_POTENTIAL_SELLER = 2;
    /// @dev user type - seller
    uint8 constant internal TYPE_SELLER = 3;
    /// @dev user type - admin
    uint8 constant internal TYPE_ADMIN = 4;

    /// @notice store status of users
    mapping(address => uint8) internal users;

    constructor() public {
        users[msg.sender] = TYPE_ADMIN;
    }

    modifier senderIs(uint8 _type) {
        require(users[msg.sender] == _type, "Wrong status of user");
        _;
    }

    modifier userIs(address _address, uint8 _type) {
        require(users[_address] == _type, "Wrong status of user");
        _;
    }

    modifier senderIsNot(uint8 _type) {
        require(users[msg.sender] != _type, "Wrong type");
        _;
    }

    modifier userIsNot(address _address, uint8 _type) {
        require(users[_address] != _type, "Wrong type");
        _;
    }

    /// @notice owner can add new admin, by address
    /// @dev only owner can do it
    function addAdmin(address _newAdminAddress) external
    onlyOwner
    userIs(_newAdminAddress, TYPE_IS_NOT_REGISTERED) {
        users[_newAdminAddress] = TYPE_ADMIN;
    }

    /// @notice not registered user can send request to became seller
    function sendRequestToBecameSeller() external
    stopInEmergency
    hasFreeSlot
    senderIs(TYPE_IS_NOT_REGISTERED) {
        potentialSellersCount++;
        users[msg.sender] = TYPE_POTENTIAL_SELLER;
        potentialSellers.push(msg.sender);
    }

    /// @notice admin can reject request to became seller
    function rejectPotentialSeller(address _potentialSellerAddress) external
    stopInEmergency
    senderIs(TYPE_ADMIN)
    userIs(_potentialSellerAddress, TYPE_POTENTIAL_SELLER) {
        potentialSellersCount--;
        delete users[_potentialSellerAddress];

        if (potentialSellersCount == 0) {
            delete potentialSellers;
        }
    }

    /// @notice admin can block potential seller
    function blockPotentialSeller(address _potentialSellerAddress) external
    stopInEmergency
    senderIs(TYPE_ADMIN)
    userIs(_potentialSellerAddress, TYPE_POTENTIAL_SELLER) {
        potentialSellersCount--;
        users[_potentialSellerAddress] = TYPE_BLOCKED;

        if (potentialSellersCount == 0) {
            delete potentialSellers;
        }
    }

    /// @notice admin can share tokens with other users
    /// @return bool flag that means operation was success or not
    function shareTokens(address _address, uint256 amount) public stopInEmergency senderIs(TYPE_ADMIN) returns (bool) {
        uint balance = erc20Contract.balanceOf(address(this));

        if (balance >= amount) {
            erc20Contract.transfer(_address, amount);
            return true;
        }

        return false;
    }

    /// @notice return status of user
    /// @return type of user
    function getStatus(address _address) external view returns (uint8){
        return users[_address];
    }
}
