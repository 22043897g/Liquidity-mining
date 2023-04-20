// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./StandardToken.sol";

contract MyUSDT is StandardToken {
    string private constant NAME = "MyUSDT";
    string private constant SYMBOL = "MU";
    uint256 private INITIAL_SUPPLY = 500 * 1000;

    constructor() {
        _name = NAME;
        _symbol = SYMBOL;
        _totalSupply = INITIAL_SUPPLY;
        _balances[msg.sender] = INITIAL_SUPPLY;
    }
}
