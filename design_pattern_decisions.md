## Restricting Access

*Config contract.* Use **onlyOwner** modifier to provide access only for the owner of the contract (main admin). Also, *managePossibilityToBecomePotentialSeller* function **provides the possibility for the only owner control potential seller flow.

*Store contract.* Use **isSeller** modifier to provide access only for the seller (owner of the store).

## Mortal

*Config contract.* **kill** **function provides the possibility to destruct the main Marketplace contract.

*Store & Auction contract*. **kill** function provides the possibility for seller to destroy Store and Auction contracts.

## Circuit Breaker

*Config contract.* Implement **setStopValue** function and **stopInEmergency** and **onlyInEmergency** modifiers.
