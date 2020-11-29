// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.0;

import "./ERC20.sol";
import "./Auction.sol";

/// @title Store contract
/// @notice Provide features for creating new stores
contract Store {
    /// @notice triggered when seller changes name
    event ChangeName(string oldName, string newName);
    /// @notice triggered when add product
    event AddProduct(string name, string description, string image, uint price, uint id);
    /// @notice triggered when remove product
    event RemoveProduct(uint id);
    /// @notice triggered when price was changed
    event ChangePrice(uint id, uint oldPrice, uint newPrice);
    /// @notice triggered when client buy product
    event BuyProduct(uint id, address buyer, uint amount);

    struct Product {
        string name;
        string description;
        string image;
        uint price;
    }

    /// @dev balance of seller
    uint private balance;
    /// @dev name of store
    string public name;
    /// @notice seller address
    address public seller;

    /// @dev address of erc20 tokens
    ERC20 private erc20Contract;
    /// @notice count of auctions
    uint public auctionsCount = 0;
    /// @dev mapping index to auction address
    mapping(uint => Auction) private auctions;

    /// @notice count of products
    uint public productsCount = 0;
    /// @dev mapping index to products
    mapping(uint => Product) private products;

    constructor(address _seller, ERC20 _erc20Contract) public {
        name = "JohnStore";
        seller = _seller;
        erc20Contract = _erc20Contract;
    }

    modifier isSeller() {
        require(msg.sender == seller);
        _;
    }

    modifier priceIsValid(uint _price) {
        require(_price > 0);
        _;
    }

    /// @notice seller can change name of store
    function changeName(string memory _name) external isSeller {
        emit ChangeName(name, _name);
        name = _name;
    }

    /// @notice seller can add product
    function addProduct(string memory _name, string memory _description,
        string memory _image, uint _price) external isSeller priceIsValid(_price) {

        products[productsCount] = Product(_name, _description, _image, _price);

        emit AddProduct(_name, _description, _image, _price, productsCount);

        productsCount++;
    }

    /// @notice seller can remove product
    function removeProduct(uint _id) external isSeller {
        delete products[_id];

        emit RemoveProduct(_id);
    }

    /// @notice seller can change price of product
    function changePrice(uint _id, uint _price) external isSeller priceIsValid(_price) {
        emit ChangePrice(_id, products[_id].price, _price);

        products[_id].price = _price;
    }

    /// @notice seller can get current balance
    function getBalance() external view isSeller returns (uint){
        return balance;
    }

    /// @notice seller can withdraw ethrs
    function withdraw(uint amount) external payable isSeller {
        require(amount <= balance, "Not enough ethrs on your balance");

        balance -= amount;
        msg.sender.transfer(amount);
    }

    /// @notice user can buy product
    function buy(uint _id) external payable priceIsValid(products[_id].price) {
        require(msg.value >= products[_id].price, "Sent not enough ethrs");

        balance += msg.value;

        emit BuyProduct(_id, msg.sender, msg.value);
    }

    /// @notice return info about product
    /// @return product info
    function getProduct(uint _id) external view priceIsValid(products[_id].price)
    returns (string memory, string memory, string memory, uint) {
        Product memory product = products[_id];

        return (product.name, product.description, product.image, product.price);
    }

    function getAuction(uint auctionId) external view returns (Auction)  {
        return auctions[auctionId];
    }

    /// @notice start auction for some special product
    function startAuction(uint _id, uint _startPrice) external
    isSeller
    priceIsValid(_startPrice)
    priceIsValid(products[_id].price) {
        Product storage product = products[_id];

        Auction auctionAddress = new Auction(seller, erc20Contract);
        Auction auction = Auction(auctionAddress);

        auction.start(product.name, product.description, product.image, _startPrice);

        auctions[auctionsCount++] = auctionAddress;
    }

    /// @notice finish auction
    function finishAuction(Auction auctionAddress) external isSeller {
        Auction auction = Auction(auctionAddress);

        auction.finish();
    }

    /// @notice destruct contract
    function kill() external {
        if (msg.sender == seller) {
            selfdestruct(msg.sender);
        }
    }
}
