// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;
import "./CommentContract.sol";
import "./LikeContract.sol";
import "./UserContract.sol";

contract PostContract {
    LikeContract private likeContract;  // 点赞合约实例
    CommentContract private commentContract;  // 评论合约实例
    UserContract private userContract;  // 用户合约实例

    struct Post {
        uint256 postId;  // 帖子ID
        string title;  // 标题
        string contentHash;  // 帖子内容的IPFS哈希值
        address payable author;  // 作者地址
        uint256 likes;  // 点赞数
        uint256 commentsCount;  // 评论数
        uint256 views;  //浏览数
        uint256 releaseTime;  //发布时间
        uint256 impactFactor;  //影响因子
        uint256[] advertisements;  //帖子下的广告id数组
    }

    mapping(uint256 => Post) private posts;  // 帖子映射
    uint256 private postIdCounter;  // 帖子ID计数器

    constructor  (
        address _likeContractAddress,
        address _commentContractAddress,
        address _userContractAddress
    ) public {
        likeContract = LikeContract(_likeContractAddress);
        commentContract = CommentContract(_commentContractAddress);
        userContract = UserContract(_userContractAddress);
        postIdCounter = 1;
    }

    /**
     * @dev 创建帖子
     * @param _title 标题
     * @param _contentHash 内容
     */
    function createPost(string memory _title, string memory _contentHash) public {
        // 将帖子内容存储到IPFS，获取内容的IPFS哈希值
        string memory contentHash = _contentHash;
        
        // 获取当前用户地址作为作者地址
        address payable author = msg.sender;

        // 存储帖子信息
        posts[postIdCounter] = Post(
            postIdCounter,
            _title,
            contentHash,
            author,
            0,
            0,
            0,
            now,
            0,
            new uint256[](0)
        );
        postIdCounter++;
    
        // 将帖子ID添加到用户发布的帖子列表中
        userContract.addUserPost(author, postIdCounter - 1);
    }

    /**
     * @dev 获取帖子详情
     * @param _postId 帖子ID
     * @return 帖子结构体
     */
    function getPost(uint256 _postId) public view returns (Post memory) {
        require(_postId > 0 && _postId <= postIdCounter, "Invalid post ID");

        return posts[_postId];
    }

    /**
     * @dev 添加评论
     * @param _postId 帖子ID
     * @param _content 评论内容
     */
    function addComment(uint256 _postId, string memory _content) public {
        require(_postId > 0 && _postId <= postIdCounter, "Invalid post ID");

        // 调用评论合约的addComment方法添加评论
        commentContract.addComment(_postId, _content);
        posts[_postId].commentsCount++;
    }

    /**
     * @dev 点赞帖子
     * @param _postId 帖子ID
     */
    function likePost(uint256 _postId) public {
        require(_postId > 0 &&_postId <= postIdCounter, "Invalid post ID");

        // 调用点赞合约的likePost方法进行点赞
        likeContract.likePost(_postId);
        posts[_postId].likes++;
    }

    /**
     * @dev 计算影响因子
     * @param _postId 帖子ID
     */
    function calculateImpactFactor(uint256 _postId) public {
        // 类似Stack Overflow的算法（可以根据需求调整权重）
        uint256 impactFactor = (posts[_postId].likes * 4) + (posts[_postId].commentsCount * 3) + (log(posts[_postId].views + 1) * 2) + (timeFactor(posts[_postId].releaseTime));

        posts[_postId].impactFactor=impactFactor;
    }

    /**
     * @dev log浏览量（用以平滑浏览量的值）
     * @param x 浏览量
     */
    function log(uint256 x) internal pure returns (uint256) {
        uint256 result = 0;
        while (x > 1) {
            result++;
            x /= 2;
        }
        return result;
    }

    /**
     * @dev 计算时间因素（随时间递减热度）
     * @param releastime 帖子发布时间
     */
    function timeFactor(uint256 releastime) internal view returns (uint256) {
        uint256 timeDiff = block.timestamp - releastime;
        // 假设每经过一天热度减少10%
        uint256 daysPassed = timeDiff / 1 days;
        if (daysPassed >= 10) {
            return 0;
        }
        return (10 - daysPassed) * 10;
    }

    /**
     * @dev 将广告ID添加到帖子下的广告数组中
     * @param _postId 帖子ID
     * @param _adId 广告ID
     */
    function addAdvertisementToPost(uint256 _postId, uint256 _adId) external {
        require(_adId > 0, "Invalid ad ID");
        require(posts[_postId].postId != 0, "Post does not exist");

        posts[_postId].advertisements.push(_adId);
    }

    /**
     * @dev 获取帖子的影响因子
     * @param _postId 帖子id
     * @return 影响因子
     */
    function getImpactFactor(uint256 _postId) public view returns (uint256) {
        require(_postId > 0, "Invalid post ID");

        return posts[_postId].impactFactor;
    }
}