//发表评论页面
import Web3 from 'web3';
import PostContract from '../build/contracts/PostContract.json';  // 读取帖子合约信息
import UserContract from '../build/contracts/UserContract.json';  //读取用户合约信息
import {storeFile, storeImage} from './web3Storage';
import {create} from 'ipfs-http-client';
import React ,{useState,useEffect}from 'react';
import { Form,Input,Space,Tag ,Button} from 'antd';
import PictureWall from './picturewall';
import { useHistory } from 'dva'
const { TextArea } = Input;
const {CheckableTag}=Tag;
const tagsData = ['Free', '10', '50', '100'];

const pressenter1 =(e)=>{
  console.log(e.target.value)
  
}
const pressenter2 = (e) => {
  console.log( e.target.value);
};
const App = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    console.log('You choosen: ', nextSelectedTags);
    setSelectedTags(nextSelectedTags);
  };

  let [transactionHash, setTransactionHash] = useState('');
    let [userAddress, setUserAddress] = useState('');
    let [web3, setWeb3] = useState(null);
    let [postInstance,setPostInstance] = useState(null);
    const [content, setContent] = useState('');
    let [userInstance, setUserInstance] = useState('');
    const [title, setTitle] = useState('');

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
        userAddress = accounts[0];
        setUserAddress(accounts[0]);
        console.log('用户地址为：',userAddress);
      }

    const init = async () => {
      await initWeb3();
      initContract();
    }
    init();
  }, []); // 只在组件挂载时运行
  //获取题目
  const handleTitleChange = event => {
    // access textarea value
    setTitle(event.target.value);
  };
  //获取内容
  const handleContentChange = event => {
    // access textarea value
    setContent(event.target.value);
  };

  //获取图片
  const [image,setImage] = useState([]);
  const getValueFromSon = parma => {
    setImage(parma);
  }

  const validateMessages = {
    required: '请输入${label}',
  }  

  const formItemLayout ={
    labelCol:{
      span: 2,
    },
    wrapperCol:{
      span: 8,}
  }

  const history=useHistory() 
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    history.push('/successSet')
  }

  const handleCreatePost = async () => {
    try{
      //const ipfsStorage = new IpfsStorage();
      let CID = '';
      let postTitle = title;
      var postContent = content;
      let fee = 0;
      if(selectedTags.length == 0){
        fee = 0;
      }else if(selectedTags == 'Free'){
        fee = 0;
      }else{
        fee = Number(selectedTags);
      }
      
      let post = [postTitle,postContent,fee];
      await storeImage(image).then((cid1) =>{
        // 成功存储后的处理
        console.log('成功存储图片, CID:', cid1);
      }).catch((error) => {
        // 存储失败时的处理
        console.error('图片存储失败:', error);
      });

      //调用发帖方法
      await storeFile(postContent).then((cid) => {
        // 成功存储后的处理
        console.log('成功存储, CID:', cid);
        CID = cid;
      }).catch((error) => {
        // 存储失败时的处理
        console.error('存储失败:', error);
      });

      await postInstance.methods.createPost(
        postTitle,
        CID,//将文件内容的cid上链存储
        fee
        ).send({from:userAddress}).on('transactionHash',(hash)=>{console.log(hash)});
        onFinish();
    } catch(error){
      console.log('发帖时出错：',error);
    }
  }
  
  return(
  <>
  <Form {...formItemLayout} validateMessages={validateMessages} onFinish={onFinish}>
    <TextArea  
      value={title}
      showCount
      maxLength={20}
      style={{
        height: 40,
        marginBottom: 24,
      }}
      onChange={handleTitleChange}
      onPressEnter={pressenter1}
      placeholder="theme"
    />
    <span
        style={{
          marginLeft : 25,
          marginRight: 12,
        }}
      >
        Please select the price of your post!（default:free）
      </span>
      <Space size={[0, 8]} wrap>
        {tagsData.map((tag) => (
          <CheckableTag
            key={tag}
            checked={selectedTags.includes(tag)}
            onChange={(checked) => handleChange(tag, checked)}
          >
            {tag}
          </CheckableTag>
        ))}
      </Space>
    <TextArea 
      value={content}
      showCount
      style={{
        height: 120,
        marginTop:20,
        marginBottom: 24,
      }}
      onChange={handleContentChange}
      onPressenter={pressenter2}
      placeholder="content"
    />
    <Space wrap>
    <PictureWall sendValueToFather={getValueFromSon.bind(this)}/>
    <Button type="primary" size="large" onClick={handleCreatePost} style={{
      marginLeft:950,
      width:80,
    }}>发布</Button>

    </Space>
    </Form>
    
  </>)
};
export default App;