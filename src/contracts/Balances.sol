pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

contract Balances {

    constructor() public {}

    struct Account {
        address addr;
        uint256 val;
    }

    struct Transition {
        address from;
        address to;
        uint256 val;
    }

    function index(bytes32 key, uint256 size) pure public returns (uint256) {
        bytes32 hash = keccak256(abi.encodePacked(key));
        return uint256(hash) & size;
    }

    // NOTE: Do an assert in case a collision is found.
    function hashmap(bytes32[] calldata values) pure public returns(uint256[] memory){
        uint256[] memory keys = new uint[](values.length);
        for (uint256 i = 0; i < values.length; i++) {
            keys[i] = index(values[i], values.length);
        }

        return keys;
    }

    function execute(Account memory acc, Transition calldata ts) pure private returns(Account memory) {
        if (acc.addr == ts.from) {
            acc.val -= ts.val;
        }

        if(acc.addr == ts.to) {
            acc.val += ts.val;
        }

        return acc;
    }

    function submit(
        Account calldata prev,
        Account calldata next,
        Transition calldata ts) pure public {

        Account memory test = execute(prev, ts);

        assert(next.addr == test.addr && next.val == test.val);
    }
}
