// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6 <0.9.0;
// solc 0.7.6 achieves significantly lower gas costs than the latest release, solc 0.8.4


contract EtherPortal {

    function massTeleport(address payable[] memory _recipients, uint[] memory _amounts) public payable returns (bool) {
      
      uint numRecipients = _recipients.length;
      require(numRecipients == _amounts.length, 'Inconsistent parameter array lengths');

      Wormhole unstablePortal = new Wormhole(); 

      for (uint i=0; i < numRecipients; i++) {
        unstablePortal.teleportEtherTo{value: _amounts[i]}(_recipients[i]); // transfer ether to recipient by invoking selfdestruct() in the portal
      }

      uint remainingBalance = address(this).balance;
      if (remainingBalance > 0) {
        unstablePortal.teleportEtherTo{value: remainingBalance}(payable(msg.sender)); // return any unused ether to sender
      }

      return true;
    }


    // function will permanently erase msg.value off the blockchain
    // ether erased in this manner cannot be recovered, even if an entity could effortlessly conjure up private keys to any and all addresses
    // of dubious utility, but perhaps of academic interest for questions such as "what is the total amount of ether on the blockchain" 
    function voidEther() public payable {

      Wormhole unstablePortal = new Wormhole();
      unstablePortal.teleportEtherTo{value: msg.value}(payable(address(unstablePortal)));

    }
}



contract Wormhole {

  // note selfdestruct can be repeatedly invoked by the same contract instance, as it is within the same transaction call
  function teleportEtherTo(address payable _recipient) public payable {
    selfdestruct(_recipient);
  }
}


