const EtherPortal = artifacts.require("./EtherPortal.sol");
const BN = web3.utils.BN;

contract("EtherPortal", accounts => {
  it("...should check the cost of gas payments.", async () => {

    const numPayments = [1,10,20,50,100]; // test making n payments, for each element of array numPayments
    const amount = 1; // amount in wei to pay each recipient
    const testAccount = accounts[1]; // account to test for correct balance update after payments


    const contract = await EtherPortal.deployed();

    const startingBalance = await web3.eth.getBalance(testAccount);
    let totalPayment = 0;
    const maxPayments = Math.max.apply(Math, numPayments);
    const amounts = Array(maxPayments).fill(amount); 
    let recipients = [];

    // create array of 100 (repeating) accounts with pre-existing state objects (i.e. accounts have been previously used)
    // note accounts without pre-existing state objects will cost 25k additional gas to pay
    for (i=0; i < Math.ceil(maxPayments/10); i++) {
      recipients = [...recipients, ...accounts];
    }

    // send amount of wei to each account address in recipients 
    for (i = 0; i < numPayments.length; i++) {
      const n = numPayments[i];
      const recipientList = recipients.slice(0,n);
      const tx = await contract.massTeleport(recipientList, amounts.slice(0,n), {value: n});
      console.log(`Cost of sending ${n} payments: ${tx.receipt.gasUsed} gas`);


      for (let recipient of recipientList) {
        if (recipient == testAccount) {
          totalPayment += amount;
        }
      }

    }

    const expectedBalance = new BN(startingBalance).add(new BN(totalPayment)).toString();
    const finalBalance = await web3.eth.getBalance(testAccount);
    console.log(finalBalance);

    assert.equal(expectedBalance, finalBalance, "Recipient balances did not update correctly");
  });
});
