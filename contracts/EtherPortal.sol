// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6 <0.9.0;
// solc 0.7.6 results in significantly lower gas costs than the latest release at this time, solc 0.8.4
// makes me optimistic that nontrivial gas savings can be made through Yul assembly


contract EtherPortal {

    // safely and privately push batch ether transfer of amounts onto recipients
    // ~30% lower gas cost than direct EOA transfer for batch transfer to 100 recipients 
    // due to selfdestruct opcode implementation, recipients' fallback() cannot trigger from transfers made this way
    // immune to reentrancy, single fallback() revert cancelling entire batch, unpredictable fallback() gas costs
    // payment is also (relatively) private, when checking recipients address on etherscan, there is no transaction history of transfers made through this method

    function massTeleport(address payable[] memory _recipients, uint[] memory _amounts) public payable returns (bool) {
      
      uint numRecipients = _recipients.length;
      require(numRecipients == _amounts.length, 'Inconsistent parameter array lengths');

      // open transfer portal, note portal only closes at the end of transaction, no matter how many times selfdestruct() is invoked
      WormHole unstablePortal = new WormHole(); 

      for (uint i=0; i < numRecipients; i++) {
        unstablePortal.teleportEtherTo{value: _amounts[i]}(_recipients[i]); // pay recipient by invoking selfdestruct() within the portal
      }

      if (address(this).balance > 0) {
        unstablePortal.teleportEtherTo{value: address(this).balance}(payable(msg.sender)); // return any unused ether to sender
      }

      return true;
    }


    // function will permanently erase msg.value off the blockchain
    // ether erased in this manner cannot be recovered, even if an entity could effortlessly conjure up private keys to any and all addresses
    // of dubious utility, but perhaps of academic interest for questions such as "what is the total amount of ether on the blockchain" 
    function voidEther() public payable {

      WormHole unstablePortal = new WormHole();
      unstablePortal.teleportEtherTo{value: msg.value}(payable(address(unstablePortal)));

    }
}



// note selfdestruct can be repeatedly invoked for the same contract instance within the same transaction call
// contract's state object is only removed after the transaction call ends
// significant gas savings for repeatedly invoking selfdestruct within one contract instance, rather than creating a selfdestructing contract for each payment
// see https://github.com/ethereum/go-ethereum/blob/92b8f28df3255c6cef9605063850d77b46146763/core/vm/instructions.go#L785
// and https://github.com/ethereum/go-ethereum/blob/92b8f28df3255c6cef9605063850d77b46146763/core/state/statedb.go#L443
contract WormHole {

  function teleportEtherTo(address payable _recipient) public payable {
    selfdestruct(_recipient);
  }
}


