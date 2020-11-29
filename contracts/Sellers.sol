// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.0;

import "./Users.sol";
import "./Store.sol";

/// @title Sellers contract
/// @notice Provide features for creating new stores
contract Sellers is Users {
    /// @notice store all address of stores
    Store[] public storesAddress;
    /// @dev map sellers to stores
    mapping(address => Store) private stores;

    /// @dev creates new store for new seller
    function createStore(address _sellerAddress) private {
        Store storeAddress = new Store(_sellerAddress, erc20Contract);
        stores[_sellerAddress] = storeAddress;
        storesAddress.push(storeAddress);

        shareTokens(_sellerAddress, 20);
    }

    /// @notice admin can approve seller request; then store will created for seller
    function approvePotentialSeller(address _potentialSellerAddress) external
    stopInEmergency
    senderIs(TYPE_ADMIN)
    userIs(_potentialSellerAddress, TYPE_POTENTIAL_SELLER) {
        potentialSellersCount--;
        users[_potentialSellerAddress] = TYPE_SELLER;

        if (potentialSellersCount == 0) {
            delete potentialSellers;
        }

        createStore(_potentialSellerAddress);
    }

    /// @notice admin can add seller by address; then store will created for seller
    function addSeller(address _sellerAddress) external
    stopInEmergency
    senderIs(TYPE_ADMIN)
    userIs(_sellerAddress, TYPE_IS_NOT_REGISTERED) {
        users[_sellerAddress] = TYPE_SELLER;

        createStore(_sellerAddress);
    }

    /// @notice view function that return store address by seller address
    function getStoreBySellerAddress(address _sellerAddress) external view returns (Store) {
        return stores[_sellerAddress];
    }
}
