// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./StandardToken.sol";

contract MyToken is StandardToken {
    string private constant NAME = "MyToken";
    string private constant SYMBOL = "MT";
    uint256 private INITIAL_SUPPLY = 500 * 1000;

    constructor() {
        _name = NAME;
        _symbol = SYMBOL;
        _totalSupply = INITIAL_SUPPLY;
        _balances[msg.sender] = INITIAL_SUPPLY;
    }
}
