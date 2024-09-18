// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "./PostContract.sol";

contract UserContract {
    PostContract private postContract;

    struct User {
        address userAddress;  // 用户地址
        mapping(uint => bool) readable; // 该用户可阅读的帖子
        bool existence;
    }

    mapping(address => User) public users;  // 用户地址到用户信息的映射
    uint public userCounter;// 用户数量计数器
    mapping (uint => User) public userId;

    constructor (address _postContractAddress) public {
        postContract = PostContract(_postContractAddress);
        userCounter = 0;
    }

    function createUser() public {
        if (users[msg.sender].existence != true){
            users[msg.sender].userAddress = msg.sender;
            users[msg.sender].readable[0] = true;
            users[msg.sender].existence = true;
            userCounter++;
            userId[userCounter]=users[msg.sender];
        }
    }

    //获取总用户数
    function getUserCounter() public view returns(uint){
        return userCounter;
    }
    // 通过id查询用户地址
    function getUser(uint _id) public view returns(address){
        return userId[_id].userAddress;
    }
   
    // 检查用户是否有阅读权限
    function check(uint _id) public view returns(bool){
        return users[msg.sender].readable[_id];
    }

    function purchase(uint _id) public payable returns(bool){
        bool result = false;
        if(users[msg.sender].readable[_id]){
            result = true;
        }else{
            uint fee = postContract.getFee(_id);
            require(msg.value == fee,"金额不对");
            address payable receiveAddress = postContract.getAuthor(_id);
            receiveAddress.transfer(fee);
            postContract.changeFee(_id);
            users[msg.sender].readable[_id] = true;
            result = true;
        }
        return result;
    }

    //获取账户状态
    function getExistence(address _a) public view returns (bool){
        return users[_a].existence;
    }
}