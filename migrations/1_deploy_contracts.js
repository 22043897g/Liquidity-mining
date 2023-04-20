const MyToken = artifacts.require('MyToken');
const MyUSDT = artifacts.require('MyUSDT');
const Pool = artifacts.require('Pool');

module.exports = async function (deployer) {
    await deployer.deploy(MyToken);
    const instance1 = await MyToken.deployed();
    await deployer.deploy(MyUSDT);
    const instance2 = await MyUSDT.deployed();
    await deployer.deploy(Pool,instance1.address,instance2.address);
};
