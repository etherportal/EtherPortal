
truffle console --network ropsten

address = '0xA17905d10C527a781372765E9644f4811aa0F38C' //solc 0.8.4
address = '0xA5Cb8CB81A927b538B73BfF314f8545c6441052e' //solc 0.7.6
artifacts = require('./client/src/contracts/EtherPortal.json')
contract = await new web3.eth.Contract(artifacts.abi, address)

tx = await contract.methods.voidEther().send({from:accounts[0],value:10**17})

random = ['0x1Ad1222F9a90767354c6dCF05Df144B2825e5aD8', '0xE41A36BF66960B35428b56564f77Ae3f3781b76d', '0xb106610AE00B6292e0666E094e3616F7fE78d6AA', '0x25a0CCEaA473b7B0b8236722Cc0c5B11BA0d3211', '0x4a219719D9b377413caCB765744e893D44946829', '0xB3c46a02A1D4Df8B32F2C2739F20c7DED3C5f60f', '0xb9ECAD7F4c7911d9e653e593e19d9337e30d2e41', '0x24438a7feBa973CA9c4563703C85C21170617488', '0x16289970c6F5AD6dacF13BA8Da33416f212D17d5', '0xECB319F69936F4040dA649e2fb1A98f317Da0198']

recipients = Array(100).fill(accounts[0]); 
amounts = Array(100).fill(1); 

n=20;
paytx = await contract.methods.massTeleport(recipients.slice(0,n),amounts.slice(0,n)).send({value: n, from:accounts[0]})

paytx = await contract.methods.massTeleport(random,amounts.slice(0,n=10)).send({value: 10, from:accounts[0]})


web3.eth.accounts.create()

// ropsten
// solc 0.8.4 - 
// gas cost ~ 83.9k + 14.0k*(total number of recipients) + 27.6k*(number of nonexistent recipients)
// 363160 gas to pay 20 existing accounts
// 223516 gas to pay 10 existing accounts
// 97826 gas to pay 1 existing account
// 499504 gas to pay 10 nonexistent accounts


// solc 0.7.6
// gas cost ~ 66.3k + 12.9k*(total number of recipients) + 27.6k*(number of nonexistent recipients)
// 1359574 gas to pay 100 existing accounts
// 324931 gas to pay 20 existing accounts
// 195608 gas to pay 10 existing accounts
// 79206 gas to pay 1 existing account
// 471608 gas to pay 10 nonexistent accounts



