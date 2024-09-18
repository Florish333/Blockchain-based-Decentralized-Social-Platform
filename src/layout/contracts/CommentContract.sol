// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract CommentContract {
    //PostContract private postContract;  // 帖子合约实例

    mapping(uint256 => Comment[]) private comments; // 帖子评论映射

    struct Comment {
        uint256 commentId; // 评论ID
        string content; // 评论内容
        address commenter; // 评论者地址
    }

    /**
     * @dev 添加评论
     * @param _postId 帖子ID
     * @param _content 评论内容
     */
    function addComment(uint256 _postId, string memory _content) public {
        require(_postId > 0, "Invalid post ID");

        // 存储评论信息
        Comment memory comment = Comment({
            commentId: comments[_postId].length + 1,
            content: _content,
            commenter: msg.sender
        });

        // 添加评论到帖子评论列表
        comments[_postId].push(comment);
    }

    /**
     * @dev 获取帖子的评论数量
     * @param _postId 帖子ID
     * @return 评论数量
     */
    function getCommentsCount(uint256 _postId) public view returns (uint256) {
        require(_postId > 0, "Invalid post ID");

        return comments[_postId].length;
    }

    /**
     * @dev 获取帖子的评论列表
     * @param _postId 帖子ID
     * @return 评论列表
     */
    function getComments(
        uint256 _postId
    ) public view returns (Comment[] memory) {
        require(_postId > 0, "Invalid post ID");

        return comments[_postId];
    }
}
