// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import "./ERC20.sol";

/// @title Auction contract
contract Auction is Ownable {
    struct Lot {
        string name;
        string description;
        string image;
        uint startPrice;
        uint currentPrice;
        uint dateStart;
        uint dateEnd;
        address buyer;
    }

    /// @dev triggered when customer try send new bet
    event AllowedBalance(uint amount, uint balance, address owner, address delegate);

    /// @dev auction duration; can be change in development process
    uint constant private duration = 10 minutes;

    /// @notice lot information
    Lot public lot;
    /// @notice status of auction
    uint public status = 0;

    /// @dev address of seller
    address public seller;

    /// @dev address of erc20 tokens
    ERC20 private erc20Contract;

    constructor(address _seller, ERC20 _erc20Contract) public {
        seller = _seller;
        erc20Contract = _erc20Contract;
    }

    /// @notice function that start auction, init product
    function start(string memory _name, string memory _description,
        string memory _image, uint _startPrice) external onlyOwner {
        require(status == 0, "Wrong status");
        require(_startPrice > 2, "Start price is less than minimum");
        lot = Lot(_name, _description, _image,
            _startPrice, _startPrice, now, now + duration, seller);

        status = 1;
    }

    /// @notice clients can bet and win auction
    function bet(uint amount) external returns (bool) {
        require(status == 1, "Wrong status");
        require(now < lot.dateEnd, "Auction have already finished");
        require(lot.buyer != msg.sender, "Can't bet personal bet");
        require(amount > lot.currentPrice, "Not enough tokens");

        uint balance = erc20Contract.allowance(msg.sender, address(this));

        emit AllowedBalance(amount, balance, msg.sender, address(this));

        if (balance >= amount) {
            address previousBuyer = lot.buyer;
            uint previousAmount = lot.currentPrice;

            lot.currentPrice = amount;
            lot.buyer = msg.sender;

            if (previousBuyer != seller) {
                erc20Contract.returnApproved(previousBuyer, previousAmount);
            }

            return true;
        }

        return false;
    }

    // seller can finish auction
    function finish() external onlyOwner {
        require(now >= lot.dateEnd, "It's not time for finishing your auction");
        require(seller != msg.sender, "Only sender can finish auction");
        require(status == 1, "Wrong status");

        status = 2;

        if (lot.buyer == seller) {
            return;
        }

        erc20Contract.transferFrom(lot.buyer, seller, lot.currentPrice);
    }

    function kill() external {
        if (msg.sender == seller) {
            selfdestruct(address(uint160(owner())));
        }
    }
}
