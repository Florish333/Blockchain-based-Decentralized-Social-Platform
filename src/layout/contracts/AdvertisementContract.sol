// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "./PostContract.sol";  

contract AdvertisementContract {
    struct Advertisement {
        uint256 adId;             // 广告ID
        address payable advertiser; // 广告商地址
        string contentHash;       // 广告内容的IPFS哈希值
        uint256 impactFactor;      // 帖子影响因子
        uint256 feePerView;       // 每次阅读费用
        uint256 totalViews;       // 总共可阅读次数
        uint256 viewsLeft;        // 剩余可阅读次数
        uint256 creationTime;     // 广告创建时间
        uint256 existenceDuration; // 广告存在时常（以秒为单位）
        uint256 postId;           // 广告存在的帖子ID
    }

    mapping(uint256 => Advertisement) private advertisements; // 广告映射
    uint256 private adIdCounter;  // 广告ID计数器

    PostContract private postContract;  // 帖子合约实例
    uint256[] private pendingApprovalAds; // 待审核广告队列

    constructor(address _postContractAddress) public {
        postContract = PostContract(_postContractAddress);
    }

    /**
     * @dev 发布广告
     * @param _advertiser 广告商地址
     * @param _contentHash 广告内容的IPFS哈希值
     * @param _postId 帖子ID
     * @param _totalviews 总共可阅读次数
     * @param _existenceDuration 广告存在时常（以秒为单位）
     */
    function publishAdvertisement(address payable _advertiser, string memory _contentHash, uint256 _postId, uint256 _totalviews, uint256 _existenceDuration) public payable {
        require(_totalviews > 0, "Invalid total views");

        // 将广告内容存储到IPFS，获取内容的IPFS哈希值
        string memory contentHash = _contentHash;

        // 获取帖子影响因子
        uint256 impactFactor = postContract.getImpactFactor(_postId);

        // 计算每次阅读的费用
        uint256 feePerView = impactFactor;

        // 存储广告信息
        advertisements[adIdCounter] = Advertisement(
            adIdCounter,
            _advertiser,
            contentHash,
            impactFactor,
            feePerView,
            _totalviews,
            _totalviews,
            now,  // 当前区块时间
            _existenceDuration,
            _postId // 当且帖子的ID
        );
        adIdCounter++;
        pendingApprovalAds.push(adIdCounter); // 添加广告到待审核队列
        
        
    }

    /**
     * @dev 支付广告费
     * @param _adId 广告ID
     */
    function payment(uint256 _adId) public payable {
        require(_adId > 0 && _adId <= adIdCounter, "Invalid advertisement ID");

        Advertisement storage ad = advertisements[_adId];
        
        if (now > ad.creationTime + ad.existenceDuration) {
            // 广告存在时常已过，支付相应阅读次数的费用
            uint256 fee = ad.feePerView * (ad.totalViews-ad.viewsLeft); // 广告费
            postContract.getPost(ad.postId).author.transfer(fee);
            delete advertisements[_adId]; // 删除广告
        } else {
            // 如果阅读次数用完，支付所有广告费
            if (ad.viewsLeft == 0) {
                uint256 fee = ad.feePerView * ad.totalViews; // 广告费
                require(msg.value >= fee, "Insufficient payment");
                postContract.getPost(ad.postId).author.transfer(fee);
                delete advertisements[_adId]; // 删除广告
            }
        }
    }

    /**
     * @dev 获取广告内容
     * @param _adId 广告ID
     * @return 广告内容哈希值
     */
    function getAdvertisementHash(uint256 _adId) public returns (string memory) {
        require(_adId > 0 && _adId <= adIdCounter, "Invalid advertisement ID");
        Advertisement storage ad = advertisements[_adId];
        require(ad.viewsLeft > 0, "Insufficient views left");
        ad.viewsLeft--; // 每读一次减少一次可阅读次数
        return ad.contentHash; // 返回广告内容哈希值
    }

    /**
     * @dev 贴主审核广告
     * @param _adId 广告ID
     * @param _postId 当前帖子ID
     */
    function approveAdvertisement(uint256 _adId, uint256 _postId) public {
        require(_adId > 0 && _adId <= adIdCounter, "Invalid advertisement ID");
        require(postContract.getPost(advertisements[_adId].postId).author == msg.sender, "Only post owner can approve");

        removePendingApproval(_adId); // 从待审核队列中移除
        // 将广告ID添加到帖子下的广告数组中
        postContract.addAdvertisementToPost(_postId, adIdCounter - 1);
    }

    /**
     * @dev 从待审核队列中移除广告
     * @param _adId 广告ID
     */
    function removePendingApproval(uint256 _adId) private {
        for (uint256 i = 0; i < pendingApprovalAds.length; i++) {
            if (pendingApprovalAds[i] == _adId) {
                // 将待审核队列中的广告移除
                pendingApprovalAds[i] = pendingApprovalAds[pendingApprovalAds.length - 1];
                pendingApprovalAds.pop();
                break;
            }
        }
    }
}