//评论显示与查看页面
import Web3 from 'web3';
import PostContract from '../build/contracts/PostContract.json';
import UserContract from '../build/contracts/UserContract.json';
import BoardContract from '../build/contracts/BoardContract.json'
import React,{ useState,useEffect } from 'react';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, List, Space ,Button,Badge,Popconfirm} from 'antd';
import Dianzan from './dianzan';
import Shoucang from './shoucang'
import Pinlun from './pinlun'
import Xiangqing from './xiangqing'
import { render } from '@testing-library/react';

const App = () => {

  let [userAddress, setUserAddress] = useState('');
  let [web3, setWeb3] = useState(null);
  let [postInstance,setPostInstance] = useState(null);
  let [boardInstance,setBoardInstance] = useState(null);
  let [contents, setContents] = useState([]);
  let [count, setCount] = useState(0);
  let [data, setData] = useState([]);
  let [userInstance,setUserInstance] = useState(null);
  let [author,setAuthor] = useState([]);
  let [data1, setData1] = useState([]);
  let [contents1, setContents1] = useState([]);
  let [author1,setAuthor1] = useState([]);
  let [iid,setIid] = useState([]);

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
      await postInstance.setProvider(web3.eth.currentProvider);
      console.log(postInstance.options);
      setPostInstance(postInstance);//通过postInstance.methods调用合约方法
      
      userInstance = new web3.eth.Contract(UserContract.abi,'0x1CC33fDE18FA7a8E8A7782e8cB8CB58C7aE87999');//记得补充用户合约地址
      postInstance.setProvider(web3.currentProvider);
      setUserInstance(userInstance); 

      boardInstance = await new web3.eth.Contract(BoardContract.abi,'0x92A46774efa768A8A91dB3904ecbA2e232027748');// 记得补充板子合约地址
      boardInstance.setProvider(web3.eth.currentProvider);
      setBoardInstance(boardInstance);
      
    var accounts = await web3.eth.getAccounts();
    web3.eth.defaultAccount = accounts[0];
    console.log(web3.eth.defaultAccount);
    userAddress = accounts[0];
    setUserAddress(accounts[0]);
    console.log('地址为：',userAddress);
  }

  const init = async () => {
    try{
      await initWeb3();
      await initContract();
      //判断是否要创建账户
      if(!await userInstance.methods.getExistence(userAddress).call({from:userAddress})){
        await userInstance.methods.createUser().send({from:userAddress}).on('transactionHash',(hash)=>{console.log(hash)});
      }
      //分红
      await boardInstance.methods.checkTime().send({from:userAddress});
      //调整展示栏
      await boardInstance.methods.check().send({from:userAddress}).on('transactionHash',(hash)=>{console.log(hash)});
      //加载展示栏
      await loadMoreData();
      //加载主页
      await handleContentChange();
    }catch(error){
      console.log('加载主页时出错：',error);
    }
  }
  init();
}, []); // 只在组件挂载时运行

  //改变展示栏内容
  const loadMoreData = async() => {
    let num = await boardInstance.methods.getBoardCount().call({from:userAddress});
    num=Number(num);
    let j=num;
    while(j){
      var _id = await boardInstance.methods.getId(j).call({from:userAddress});
      iid.push(_id);
      setIid(iid);
      var title = await postInstance.methods.getTitle(_id).call({from:userAddress});
      contents1.push(title);
      setContents1(contents1);
      var _author = await postInstance.methods.getAuthor(_id).call({from:userAddress});
      author1.push(_author);
      setAuthor1(author1);
      j--;
    }
    const newdata = Array.from({
      length: num,
    }).map((_, i) => ({
      Name: author1[i],
      avatar:`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
      title:contents1[i],
      description:iid[i],
      postinstance:postInstance,
      userinstance:userInstance,
      address:userAddress,
      href: `http://localhost:3000/#/page0`,
    }))
    setData1(newdata);
  };

// 改变列表内容
const handleContentChange = async () => {
  
  count = await postInstance.methods.getIdCounter().call({from:userAddress});
  console.log('目前有：',count);
  setCount(count);
  var it = 1;
  while(it != Number(count)+1){
    var title = '';
    title = await postInstance.methods.getTitle(it).call({from:userAddress});
    contents.push(title);
    var _author = await postInstance.methods.getAuthor(it).call({from:userAddress});
    author.push(_author);
    setAuthor(author);
    it++;
  }

  setContents(contents);

  const newdata = Array.from({
    length: contents.length,
  }).map((_, i) => ({
    href: `http://localhost:3000/#/page0`,
    title: author[i],
    avatar:`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
    description:i+1,
    postinstance:postInstance,
    userinstance:userInstance,
    address:userAddress,
    content:contents[i],
  }))
  setData(newdata);
};

  return(
    <div>
      <div>置顶展示栏
      <div
      id="scrollableDiv"
      style={{
        height: 210,
        overflow: 'auto',
        padding: '0 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)',
      }}
    >
        <List
          dataSource={data1}
          renderItem={(item) => (
            <List.Item key={item.email}>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}//头像
                title={<a href="">{item.Name}</a>}//跳转网页
                description={item.title}//描述
              />
              <div><Xiangqing detailHref={item.href} id={item.description} postinstance={item.postinstance} address={item.address}
          userinstance={item.userinstance}>跳转</Xiangqing></div> 
            </List.Item>
          )}
        />
        </div>
      </div>
      <div>
      <List
    itemLayout="vertical"
    size="large"
    pagination={{
      onChange: (page) => {
        console.log(page);
      },
      pageSize: 3,
    }}
    dataSource={data}

   renderItem={(item) => (
      <List.Item
        key={item.title}
        actions={[
          <Dianzan></Dianzan>,
          <Shoucang></Shoucang>,
          <Pinlun id={item.description} postinstance={item.postinstance} address={item.address}></Pinlun>,
        ]}
      >
    <List.Item.Meta
       avatar={<Avatar src={item.avatar} />}
        title={item.title}
        description={
          <Xiangqing detailHref={item.href} id={item.description} postinstance={item.postinstance} address={item.address}
          userinstance={item.userinstance}></Xiangqing>
        }
      >
         </List.Item.Meta>
      {item.content}
    </List.Item>
      
    )}
  />
      </div>
    </div>
  )}
export default App;