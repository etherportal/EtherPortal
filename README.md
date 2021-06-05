# EtherPortal
Safely and privately push batch transfers of ether to recipients without risk of fallback() shenanigans and at lower gas costs

See https://fravoll.github.io/solidity-patterns/pull_over_push.html for motivation

EtherPortal provides a batch transfer push (as opposed to pull) method using the selfdestruct opcode to achieve the following properties

1. Immune to fallback shenanigans
    -ether is transferred without any calling opcodes, thus recipients' fallback() does not trigger
    -no need to worry about single fallback() reverting entire batch transfer
    -avoid unpredictable gas costs from arbitrary code at recipients' fallback()
    -no risk of reentrancy attack

2. Transfer is untraceable from the recipients' address
    -transaction is more private, ether transfers do not leave transaction history at the recipient's address
    -for example see https://ropsten.etherscan.io/address/0x60756E15b55a6d5320cb28D1915925B45BE6ccd6
    -account has 1 wei, but no transaction history (as of 6/5/2021)
    -where/when did the ether originate? 

3. Lower gas costs than direct transfer from EOA
    -savings of ~30% for batch payment to 100 (existing) addresses)
    -existing means address has pre-existing state object (i.e. address has previously been used)
    -gas cost ~= 66.3k + 12.9k*(total number of recipients) + 27.6k*(number of nonexistent recipients) using solc 0.7.6
    -gas cost ~= 83.9k + 14.0k*(total number of recipients) + 27.6k*(number of nonexistent recipients) using solc 0.8.4
    -gas costs are tested on Ropsten, optimistic they can be reduced further with Yul assembly given significant compiler differences

Gas cost savings are optimized by repeatedly invoking selfdestruct() at a single contract address. Due to the selfdestruct opcodes implementation, the contract's state object is only removed after the entire transaction call terminates. This means the contract instance can continue to be called and receive ether even after invoking selfdestruct, as long as it is within the same transaction call. Instead of creating a selfdestructing contract for each payment, significant gas savings are achieved by repeatedly reusing the same contract instance for invoking selfdestruct.

See https://github.com/ethereum/go-ethereum/blob/92b8f28df3255c6cef9605063850d77b46146763/core/vm/instructions.go#L785 and https://github.com/ethereum/go-ethereum/blob/92b8f28df3255c6cef9605063850d77b46146763/core/state/statedb.go#L443 to see the nuances of the selfdestruct opcode that makes this possible. 

# Try it out on Ropsten
ContractAddress = '0xA17905d10C527a781372765E9644f4811aa0F38C' // compiled using solc 0.8.4
ContractAddress = '0xA5Cb8CB81A927b538B73BfF314f8545c6441052e' // compiled using solc 0.7.6

# Help
See how much further gas optimization can be achieved with Yul assembly 

