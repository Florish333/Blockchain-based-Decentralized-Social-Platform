// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract UserContract {
    struct User {
        address userAddress;  // 用户地址
        string username;  // 用户名
        string avatarHash;  // 用户头像的 IPFS 哈希值
        string bio;  // 用户简介
        string password;  // 用户密码
        address[] following;  // 关注的用户数组
        uint256[] posts;  // 发布的帖子数组
        uint256[] advertisements;  //发布的广告id数组
    }

    mapping(address => User) private users;  // 用户地址到用户信息的映射

    /**
     * @dev 创建用户
     * @param _username 用户名
     * @param _avatarHash 用户头像的 IPFS 哈希值
     * @param _bio 用户简介
     * @param _password 用户密码
     */
    function createUser(string memory _username, string memory _avatarHash, string memory _bio, string memory _password) public {
        require(bytes(_username).length > 0, "Invalid username");
        require(bytes(_avatarHash).length > 0, "Invalid avatar hash");
        require(users[msg.sender].userAddress == address(0), "User already exists");

        User memory user = User({
            userAddress: msg.sender,
            username: _username,
            avatarHash: _avatarHash,
            bio: _bio,
            password: _password,
            following: new address[](0),
            posts: new uint256[](0),
            advertisements: new uint256[](0)
        });

        users[msg.sender] = user;
    }

    /**
     * @dev 关注用户
     * @param _user 要关注的用户地址
     */
    function followUser(address _user) public {
        require(_user != address(0), "Invalid user address");
        require(users[msg.sender].userAddress != address(0), "User does not exist");

        users[msg.sender].following.push(_user);
    }

    /**
     * @dev 获取用户信息
     * @param _user 用户地址
     * @return 用户名、用户头像的 IPFS 哈希值、用户简介、关注的用户数组、发布的帖子数组
     */
    function getUser(address _user) public view returns (string memory, string memory, string memory, address[] memory, uint256[] memory) {
        require(_user != address(0), "Invalid user address");

        User memory user = users[_user];

        return (user.username, user.avatarHash, user.bio, user.following, user.posts);
    }

    /**
     * @dev 验证用户密码
     * @param _user 用户地址
     * @param _password 用户密码
     * @return 验证结果
     */
    function verifyPassword(address _user, string memory _password) public view returns (bool) {
        require(_user != address(0), "Invalid user address");

        User memory user = users[_user];
        return (keccak256(bytes(user.password)) == keccak256(bytes(_password)));
    }
        /**
     * @dev 将帖子ID添加到用户发布的帖子数组中
     * @param _user 用户地址
     * @param _postId 帖子ID
     */
    function addUserPost(address _user, uint256 _postId) external {
        require(_postId > 0, "Invalid post ID");
        require(users[_user].userAddress != address(0), "User does not exist");

        users[_user].posts.push(_postId);
    }

    /**
     * @dev 将广告ID添加到用户发布的广告数组中
     * @param _user 用户地址
     * @param _adId 广告ID
     */
    function addUserAdvertisement(address _user, uint256 _adId) external {
        require(_adId > 0, "Invalid ad ID");
        require(users[_user].userAddress != address(0), "User does not exist");

        users[_user].advertisements.push(_adId);
    }
}

