## How to start?

For local testing you need setup your blockchain, for that you can use ganache.

Then you need to build and deploy your contracts:

```jsx
truffle migrate --reset
```

Share contracts config with frontend:

```jsx
npm run scripts-init-contracts
```

If you would like to test on Rinkeby testnet, you should pass argument:

```jsx
npm run scripts-init-contracts deployed
```

Then you can start FE, connect your metamask with app and  try all features:

```jsx
npm run start
```

## Docs

Online marketplace that operates on the blockchain.

Owner of marketplace can control general config.

There are a list of stores on a central marketplace where shoppers can purchase goods posted by the store owners.

The central marketplace is managed by administrators. The owner can add administrators. Admins allow store owners to add stores to the marketplace. 

Store owners can manage their store’s products and funds. 

Shoppers can visit stores and purchase goods that are in stock using cryptocurrency.

User Stories:

An administrator opens the web app. The web app reads the address and identifies that the user is an admin, showing them admin functions, such as managing store owners. An admin adds an address to the list of approved store owners, so if the owner of that address logs into the app, they have access to the store owner functions.

An approved store owner logs into the app. The web app recognizes its address and identifies them as a store owner. They are shown the store owner functions. They can add/remove products to the store or change any of the products’ prices. They can also withdraw any funds that the store has collected from sales.

A shopper logs into the app. The web app does not recognize their address so they are shown the generic shopper application. From the main page, they can browse all of the stores that have been created in the marketplace. 

Clicking on a store will take them to a product page. They can see a list of products offered by the store. Shoppers can purchase a product, which will debit their account and send it to the store. The quantity of the item in the store’s inventory will be reduced by the appropriate amount.

Some additional features:

1. **Auction**. store owner can start an auction, for that he chooses one product. Then shoppers can start to send bet. Then the owner can finish the auction.
2. Give store owners the option to accept any **ERC-20 token.**
3. Deploy your dApp to a **testnet**
4. Serve the UI from **IPFS** or a traditional web server
