const assert = require('assert');
const Pool = artifacts.require('Pool');
const MyToken = artifacts.require('MyToken');
const MyUSDT = artifacts.require('MyUSDT');

const Web3 = require('web3');
const Assert = require("assert");
const web3 = new Web3('http://localhost:8545');

contract('TEST',async function(accounts){
    beforeEach(async () => {
        MT = await MyToken.new({ from: accounts[0] });
        MU = await MyUSDT.new({ from: accounts[0] });
        P = await Pool.new(MT.address,MU.address,{from:accounts[0]});
        accounts = await web3.eth.getAccounts();
    });

    describe("Test", () => {
        it('test',async () => {
            //转入足够多的USDT，模拟收益
            await MU.transfer(P.address,500000,{from:accounts[0]});
            //0号地址存入MyToken
            await MT.approve(P.address,10000,{from:accounts[0]});
            await P.deposit(10000,{from:accounts[0]});
            //1-4号地址存入MyToken
            for(let i = 1; i<5; i++){
                await MT.transfer(accounts[i],1000*i,{from:accounts[0]});
                await MT.approve(P.address,1000*i,{from:accounts[i]});
                await P.deposit(1000*i,{from:accounts[i]});
                const balanceMyToken = await P.getToken.call(accounts[i-1]);
                const balanceMyUSDT = await P.earned.call(accounts[i-1]);
                const height = await web3.eth.getBlockNumber();
                console.log(i-1);
                console.log("Height:",height);
                console.log("MyToken:",balanceMyToken.words[0]);
                console.log("MyUSDT:",balanceMyUSDT.words[0]);
            }
            // 每次存款时查询上一个地址的余额，其中一次测试结果如下
            // 每次存款间隔三个区块，所以0号地址在查询时获得了3*100个USDT，1号地址在查询时获得了1000/(1000+10000)*300≈27个USDT
            // 2号地址在查询时获得了2000+/(1000+2000+10000)*300≈46个USDT，3号地址在查询时获得了3000/(1000+2000+3000+10000)*300≈56个USDT
            // 0
            // Height: 310
            // MyToken: 10000
            // MyUSDT: 300
            // 1
            // Height: 313
            // MyToken: 1000
            // MyUSDT: 27
            // 2
            // Height: 316
            // MyToken: 2000
            // MyUSDT: 46
            // 3
            // Height: 319
            // MyToken: 3000
            // MyUSDT: 56

            // 0号地址取回部分token
            await P.withdraw(4000,{from:accounts[0]});
            let balanceInContract = await MT.balanceOf.call(accounts[0]);
            Assert.equal(484000,balanceInContract.words[0]);  //一共50w，给了1-4号一共1w，自己存入1w后取回6k

            // 0号地址取回收益
            await P.claim({from:accounts[0]});
            balanceInContract = await MU.balanceOf.call(accounts[0]);
            // console.log("MyUSDT:",balanceMyUSDT.words[0]);
            console.log("USDTBalance:",balanceInContract.words[0]);
            //结果为USDTBalance: 1077
            //300 + 10000/11000*300 + 10000/13000*300 + 10000/16000*300 + 10000/20000*100 + 6000/16000*100 ≈ 1077
        });
    });
});