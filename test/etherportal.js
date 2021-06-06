const EtherPortal = artifacts.require("./EtherPortal.sol");
const BN = web3.utils.BN;

contract("EtherPortal", accounts => {
  it("...should log the cost of gas payments and check final balances are consistent.", async () => {

    const numTransfers = [1,10,20,100]; // test making n batch transfers, for each element n of the array
    const amount = 1; // amount of wei to transfer to each recipient

    for (let numTransfer of numTransfers) {
      await testPortal(numTransfer, amount);
    }

  });

});


async function testPortal(numRecipients, amountToTransfer) {

  const amounts = Array(numRecipients).fill(amountToTransfer); // array of amounts to pay each recipient

  const recipients = Array(numRecipients);

  for (i=0; i<numRecipients; i++) {
    var account = await web3.eth.accounts.create();
    recipients[i] = account.address;
  }

  const contract = await EtherPortal.deployed();

  const totalValue = amountToTransfer*numRecipients;

  const tx1 = await contract.massTeleport(recipients, amounts, {value: totalValue});
  console.log(`Cost of sending ${numRecipients} payments to nonexistent accounts: ${tx1.receipt.gasUsed} gas`);

  const tx2 = await contract.massTeleport(recipients, amounts, {value: totalValue});
  console.log(`Cost of sending ${numRecipients} payments to existing accounts: ${tx2.receipt.gasUsed} gas`);

  const expectedBalance = (amountToTransfer*2).toString();
  const finalBalances = Array(numRecipients);

  for (i=0; i<numRecipients; i++) {
    finalBalances[i] = await web3.eth.getBalance(recipients[i]);
    assert.equal(expectedBalance, finalBalances[i], `Balance did not update correctly for ${recipients[i]} with balance: ${finalBalances[i]}`);

  }

  return finalBalances;
}