// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract PostContract {

    struct Comment {
        string content; // 评论内容
        address author; // 作者地址
    }

    struct Advertisement {
        string title;
        string contentHash; // 广告内容哈希值 
        address author;
        bool show;
    }

    struct Post {
        string title;  // 标题
        string contentHash;  // 帖子内容的IPFS哈希值
        address payable author;  // 作者地址
        uint postId;
        uint fee;
        uint commentsNum; // 该帖子评论数量
        uint advertisementsNum; // 该帖子的广告数量
        uint advertisementFee; // 广告费
        mapping (uint => Comment) comments;
        mapping (uint => Advertisement) advertisements;
        uint heatvalue;//热度
    }

    mapping(uint256 => Post) public posts;  // 帖子映射
    uint private postIdCounter;  // 帖子ID计数器

    constructor () public {
        postIdCounter = 0;
    }

    /**
     * @dev 创建帖子
     * @param _title 标题
     * @param _contentHash 内容
     */
    function createPost(string memory _title, string memory _contentHash, uint _fee) public returns(uint) {  
        // 获取当前用户地址作为作者地址
        address payable author = msg.sender;
        uint id = ++postIdCounter;
        // 存储帖子信息
        posts[postIdCounter] = Post(
            _title,
            _contentHash,
            author,
            id,
            _fee*(10**18),
            0,
            0,
            10*(10**18),// 广告费默认10eth
            0
        );
        //postIdCounter++;
        return id;
    }

    // 发表评论
    function comment(uint _id, string memory _content) public {
        uint counter = ++posts[_id].commentsNum;// 获取目前有几条评论，并且评论数加一
        posts[_id].comments[counter] = Comment(
            _content,
            msg.sender
        );
    }

    // 发表广告
    function createAdvertisement(uint _id, string memory _title, string memory _content) public payable {
        // 获取当前广告费
        uint _fee = posts[_id].advertisementFee;
        require(msg.value == _fee,"金额不对");
        address payable receiveAddress = posts[_id].author;
        receiveAddress.transfer(_fee);// 转广告费

        uint counter = ++posts[_id].advertisementsNum;// 获取目前有几条广告，并且评论数加一
        posts[_id].advertisements[counter] = Advertisement(
            _title,
            _content,
            msg.sender,
            true
        );
    }

    // 广告费修改,如果该篇帖子不是免费帖子，则每有人付费阅读一次，广告费+10eth
    function changeFee(uint _id) public {
        if(posts[_id].fee!=0){
            posts[_id].advertisementFee=posts[_id].advertisementFee+10*(10**18);
        }
    }

    //获取广告
    function getAdvertisement(uint _id,uint _num) public view returns (string memory){
        return posts[_id].advertisements[_num].contentHash;
    }

    //获取广告数
    function getAdvertisementNum(uint _id) public view returns (uint){
        return posts[_id].advertisementsNum;
    }

    //获取广告费
    function getAdvertisementFee(uint _id) public view returns (uint){
        return posts[_id].advertisementFee;
    }

    // 改变广告状态
    function coverAd(uint _id, uint _num) public{
        require(posts[_id].author == msg.sender,'没有权限');
        posts[_id].advertisements[_num].show = false;
    }

    // 获取某个帖子的评论数量
    function getCommentNum(uint _id) public view returns (uint) {
        return posts[_id].commentsNum;
    }

    // 获取某个帖子的某一条评论的内容
    function getCommentContent(uint _id, uint _num) public view returns (string memory) {
        return posts[_id].comments[_num].content;
    }

    // 获取某个帖子的某一条评论的作者
    function getCommentAuthor(uint _id, uint _num) public view returns (address) {
        return posts[_id].comments[_num].author;
    }

    //根据帖子id获取阅读当前帖子需要支付的费用
    function getFee(uint _id) public view returns(uint){
        return posts[_id].fee;
    }
    //根据帖子id获取当前帖子的id
    function getAuthor(uint _id) public view  returns(address payable){
        return posts[_id].author;
    }
    //获取总帖子数
    function getIdCounter() public view returns(uint){
        return postIdCounter;
    }

    function getContent(uint _id) public view  returns(string memory){
        return posts[_id].contentHash;
    }

    function getTitle(uint _id) public view  returns(string memory){
        return posts[_id].title;
    }

    
    //计算热度值
    function caculateHeatvalue(uint _id) public {
         posts[_id].heatvalue=posts[_id].commentsNum+posts[_id].advertisementsNum;
    }

      //获取热度数
    function getHeatvalue(uint _id) public view  returns(uint){
        return posts[_id].heatvalue;
    }


    // 数字转换为字符串
    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
}