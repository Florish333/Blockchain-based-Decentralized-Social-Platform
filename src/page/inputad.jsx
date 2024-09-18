//广告上传页面
import Web3 from 'web3';
import PostContract from '../build/contracts/PostContract.json';  // 读取帖子合约信息
import React,{useEffect, useState} from 'react'
import Picturewall from './picturewall' 
import {useHistory} from 'dva'
import {storeImage} from './web3Storage'
import{
  InputNumber,
  Form,
  Input,
  Cascader,
  Upload,
  Button,
  Icon,
  Result,
  Col,
  Statistic
} from 'antd'

const {Item}= Form
const {TextArea}= Input
//广告级联分类数据
const options = [
  {
    value: 'shangye',
    label: '商业广告',
    children:[
      {
        value :'chanping',
        label :'产品广告'
      },
      {
        value: 'pinpai',
        label: '品牌广告',
      },
      {
        value: 'guannian',
        label: '观念广告',
      }
    ]
  },
  {
    value: 'gongyi',
    label: '公益广告',
  },
];
const onChange = (value) => {
  console.log(value);
};

const validateMessages = {
  required: '请输入${label}',
  
};
//const [flag,setflag]=useState(false)
//数据校验函数，如果submit后成功获取数据，会在console页面打印所有value值

const ProductAddUpdate=()=>{
  
    let [transactionHash, setTransactionHash] = useState('');
    let [userAddress, setUserAddress] = useState('');
    let [adContent, setAdContent] = useState('');
    let [adTitle, setAdTitle] = useState('');
    let [web3, setWeb3] = useState(null);
    let [postInstance,setPostInstance] = useState(null);
    const [fee,setFee] = useState(0);
    const [postId,setPostId] = useState(localStorage.getItem('data'));

    useEffect(() => {
      const initWeb3 = async () => {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            try {
              // 请求用户账号授权
              await window.ethereum.enable();
            } catch (error) {
              // 用户拒绝了访问
              console.error("User denied account access")
            }
          }
          // 老版 MetaMask
          else if (window.web3) {
            web3 = new Web3(window.web3.currentProvider);
          }
         // 如果没有注入的web3实例，回退到使用 Ganache
          else {
            web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
          }
          setWeb3(web3);
      }

      const initContract = async () => {
        postInstance = await new web3.eth.Contract(PostContract.abi,'0xafe21B9f0c2938C66AbcA29Df731D645FD6a97be');// 记得补充帖子合约地址
        postInstance.setProvider(web3.eth.currentProvider);
        console.log(postInstance.options);
        setPostInstance(postInstance);//通过postInstance.methods调用合约方法

        var accounts = await web3.eth.getAccounts();
        web3.eth.defaultAccount = accounts[0];
        console.log(web3.eth.defaultAccount);
        userAddress =accounts[0];
        setUserAddress(userAddress);
        console.log('地址为：',userAddress);

      }

    const init = async () => {
      await initWeb3();
      await initContract();
      let _fee = Number(await postInstance.methods.getAdvertisementFee(postId).call({from:userAddress}));
      setFee(_fee/(10**18));
    }
    init();

  }, []); // 只在组件挂载时运行

  const formItemLayout ={
    labelCol:{
      span: 2,
    },
    wrapperCol:{
      span: 8,}
    }
  const tailLayout = {
      wrapperCol: {
        offset: 6,
        span: 16,
      },
    };
   
    const history=useHistory() 
    const onFinish = (values) => {
      console.log('Received values of form: ', values);
      history.push('/success')
    }

    //获取图片
  const [image,setImage] = useState([]);
  const getValueFromSon = parma => {
    setImage(parma);
  }

    const adTitleChange = event =>{
      setAdTitle(event.target.value);
    }

    //发布广告
    const handlePublishAdvertisement = async () => {

      await storeImage(image).then((cid1) =>{
        setAdContent(cid1);
        console.log('成功存储图片, CID:', adContent);
      }).catch((error) => {
        // 存储失败时的处理
        console.error('图片存储失败:', error);
      });

      try {
        // 调用合约的发布广告函数
        await postInstance.methods.createAdvertisement(
          postId,
          adTitle,
          adContent
        ).send({from:userAddress,value:fee*(10**18)}).on('transactionHash',(hash)=>{console.log(hash)});
      } catch (error) {
        console.error('发布广告时出错：', error);
      }   
      console.log(transactionHash);
    }
      return(
        <Form {...formItemLayout} validateMessages={validateMessages} onFinish={onFinish}>
        
        <Item label="广告描述" name="describe" rules={[{required:true}]}>
          <TextArea value={adTitle} onChange={adTitleChange}
           placeholder="请输入广告描述"
               autoSize={{
                minRows: 2,
                maxRows: 6,
              }}
          />
        </Item>
        
        <Item label="广告图片" name="picture" rules={[{required:true}]}>
           <Picturewall sendValueToFather={getValueFromSon.bind(this)}/>
        </Item>
        <Item label="广告价格" name="price" >
        <Col span={12}>
          <Statistic title="" value={`${fee}ETH`} />
        </Col>
        </Item>
        <Item {...tailLayout}><Button type='primary'  htmlType="submit"  onClick={handlePublishAdvertisement}>提交</Button>
        </Item>
        
        
        {transactionHash && (
          <div>
            交易哈希：{transactionHash}
          </div>
        )}
        
      </Form>
      )
}



export default ProductAddUpdate;