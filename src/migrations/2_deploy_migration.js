var UserContract = artifacts.require("./UserContract.sol");
var PostContract = artifacts.require("./PostContract.sol");
var BoardContract = artifacts.require("./BoardContract.sol");

module.exports = async function (deployer) {
    await deployer.deploy(PostContract);
  
    const PostContractInstance = await PostContract.deployed();
  
    await deployer.deploy(UserContract, PostContractInstance.address);
  
    const UserContractInstance = await UserContract.deployed();
  
    await deployer.deploy(BoardContract, PostContractInstance.address,UserContractInstance.address);
  };