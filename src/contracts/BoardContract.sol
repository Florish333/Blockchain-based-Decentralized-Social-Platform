// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "./PostContract.sol";
import "./UserContract.sol";

contract BoardContract {
    PostContract private postContract;
    UserContract private userContract;

    event TransEvent(address,uint);

    //展出的帖子
    struct Exhibit {
        string title;
        uint id; // 帖子的id 
        address author;// 帖子作者
        uint startDate;// 起始日期
        uint expireDate;// 终止日期
    }

    //展板
    struct Board {
        uint count;// 已经展示的贴子数
        uint lastTime;// 创建展板时间
        uint span;// 分钱周期
        uint fee; // 每分钟单价（为方便测试，实际可调整为月、年）
    }

    Board public board;

    constructor (address _postContractAddress,address _userContractAddress) public {
        postContract = PostContract(_postContractAddress);
        userContract = UserContract(_userContractAddress);
        board = Board(
            0,// 初始展示0篇
            now,// 创建展板时间
            1 minutes,// 分钱周期1分钟（便于测试）
            10*(10**18)// 初始为10eth
        );
    }

    mapping (uint=>Exhibit) exhibits;

    function getContractAddress() public view returns(address payable ){
        address payable _payableAddr = address(uint160(address(this)));
        return _payableAddr;
    }

    //展示帖子
    function showThePost (uint _id, uint time) public payable returns(bool){
        if(board.count>=3){
            return false;
        }
        address payable _address = address(uint160(address(this)));
        uint _fee = (time/60)*board.fee*(userContract.getUserCounter());
        require(msg.value==_fee,"支付金额不对");
        _address.transfer(msg.value);//向合约转账
        board.count++;
        exhibits[board.count]=Exhibit(
            postContract.getTitle(_id),
            _id,
            postContract.getAuthor(_id),
            now,
            now+time
        );
        return true;
    }

    //获取目前展示帖子的单价
    function getBoardFee() public view returns(uint){
        return board.fee*(userContract.getUserCounter());
    }

    //获取要展示的帖子数
    function getBoardCount() public view returns(uint){
        return board.count;
    }

    //获取展示帖子的id
    function getId(uint _num) public view returns(uint){
        return exhibits[_num].id;
    }

    //获取展示帖子的到期时间
    function getExpireDate(uint _num) public view returns(uint){
        return exhibits[_num].expireDate;
    }

    //检查帖子是否到期
    function check() public {
        bool[4] memory expired;
        uint num=board.count;
        //判断哪几篇帖子没过期
        while(num>0){
            if(exhibits[num].expireDate<=now){
                expired[num]=false;
            }else{
                expired[num]=true;
            }
            num--;
        }
        uint _count = 0;
        //判断没过期的数量
        while(++num<=board.count){
            if(expired[num]){
                _count++;
            }
        }
        uint i=1;
        //去除过期的帖子
        while(i<=board.count){
            uint j=i;
            while(j<=board.count){
                if(expired[j]){
                    exhibits[i]=exhibits[j];
                    expired[j]=false;
                    break;
                }
                j++;
            }
            i++;
        }
        //更换栈顶
        board.count=_count;
    }

    // 检查是否到分红时间
    function checkTime()public payable returns(bool){
        if(now>board.lastTime+board.span){
            board.lastTime = now;
            distribute();
            return true;
        }else{
            return false;
        }
    }

    //分钱给所有用户
    function distribute() public payable {
        uint num = userContract.getUserCounter();
        address payable  _address = getContractAddress();
        uint _balance = _address.balance;
        uint divident = 0;
        //分红，若有小数，则留到下一次分配
        if(_balance%num==0){
            divident=_balance/num;
        }else{
            _balance = _balance-(_balance%num);
            divident = _balance/num;
        }
        //分别给每一个用户地址转账
        while(num!=0){
            address payable _receiver = address(uint160(userContract.getUser(num)));
            _receiver.transfer(divident);
            num--;
        }
    }
    
    function() external payable { 
        emit TransEvent(address(this),1);
    }

}