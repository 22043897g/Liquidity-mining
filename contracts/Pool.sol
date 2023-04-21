// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "./ERC20.sol";

contract Pool {
    ERC20 public MyToken;
    ERC20 public MyUSDT;
    uint public rewardPerBlock = 100;
    uint public lastUpdate;
    uint public MyTokenAmount;
    //RPT = Reward Per Token
    uint public latestRPT;
    mapping(address => uint) public userLatestRPT;
    mapping(address => uint) public rewards;
    mapping(address => uint) public balanceOf;

    constructor(address _MyToken, address _MyUSDT) {
        MyToken = ERC20(_MyToken);
        MyUSDT = ERC20(_MyUSDT);
        lastUpdate = block.number;
    }

    function updateReward (address _account) internal {
        latestRPT = getRPT();
        lastUpdate = block.number;
        rewards[_account] = earned(_account);
        userLatestRPT[_account] = latestRPT;
    }

    function getToken(address addr) view external returns (uint){
        return balanceOf[addr];
    }

    //获取最新的Reward Per Token
    function getRPT() internal view returns (uint) {
        if (MyTokenAmount == 0) {
            return latestRPT;
        }
        return latestRPT +(rewardPerBlock * (block.number - lastUpdate) * 1e18) / MyTokenAmount;  //*1e18防止结果被约为0
    }

    function deposit(uint _amount) external  {
        require(_amount > 0, "You can not deposite nothing.");
        updateReward(msg.sender);
        MyToken.transferFrom(msg.sender, address(this), _amount);
        balanceOf[msg.sender] += _amount;
        MyTokenAmount += _amount;
    }

    function withdraw(uint _amount) external  {
        require(_amount > 0, "You can not withdraw nothing.");
        updateReward(msg.sender);
        balanceOf[msg.sender] -= _amount;
        MyTokenAmount -= _amount;
        MyToken.transfer(msg.sender, _amount);
    }

    function earned(address _account) public view returns (uint) {
        //用户的挖矿奖励 = 用户质押的代币总数 *（当前累计的每单位质押代币获得收益之和 - 上次更新时累计的每单位质押代币获得收益之和）+ 当前奖励余额
        return((balanceOf[_account] * (getRPT() - userLatestRPT[_account]))/1e18) + rewards[_account];
    }

    function claim() external {
        updateReward(msg.sender);
        uint reward = rewards[msg.sender];
        require(reward > 0,"You do not have any rewards.");
        rewards[msg.sender] = 0;
        MyUSDT.transfer(msg.sender, reward);
    }
}
