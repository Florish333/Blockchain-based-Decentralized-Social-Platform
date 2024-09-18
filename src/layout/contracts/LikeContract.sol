// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;


contract LikeContract {

    mapping(uint256 => mapping(address => bool)) private likes;  // 记录用户是否对帖子点过赞
    mapping(uint256 => uint256) private likesCount;  // 记录帖子的点赞数量

    event LikeEvent(uint256 indexed postId, address indexed user);

    /**
     * @dev 点赞帖子
     * @param _postId 帖子ID
     */
    function likePost(uint256 _postId) public {
        require(_postId > 0, "Invalid post ID");

        // 确保用户未对帖子重复点赞
        require(!likes[_postId][msg.sender], "Already liked");

        // 标记当前用户对帖子点赞
        likes[_postId][msg.sender] = true;

        // 更新点赞数量
        likesCount[_postId]++;

        // 触发点赞事件
        emit LikeEvent(_postId, msg.sender);
    }

    /**
     * @dev 检查用户是否已对帖子点赞
     * @param _postId 帖子ID
     * @return 是否已点赞
     */
    function hasLiked(uint256 _postId) public view returns (bool) {
        require(_postId > 0, "Invalid post ID");

        return likes[_postId][msg.sender];
    }

    /**
     * @dev 获取帖子的点赞数量
     * @param _postId 帖子ID
     * @return 点赞数量
     */
    function getLikesCount(uint256 _postId) public view returns (uint256) {
        require(_postId > 0, "Invalid post ID");

        return likesCount[_postId];
    }
}