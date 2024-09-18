import Web3 from 'web3';
import PostContract from '../build/contracts/PostContract.json';  // 读取帖子合约信息
import BoardContract from '../build/contracts/BoardContract.json'
import React, { useState,useEffect } from 'react';
import { retrieveText } from '../page/web3Storage';
import Advertisement from '../page/advertisement';
import { Button } from 'antd';
import {useHistory} from 'dva'
import Upad from '../page/upad'

const App =()=>{

  let [userAddress, setUserAddress] = useState('');
  let [web3, setWeb3] = useState(null);
  let [postInstance,setPostInstance] = useState(null);
  let [boardInstance, setBoardInstance] = useState(null);
  let [content,setContent] = useState('');
  
  useEffect(() => {
    const initWeb3 = async () => {
      let web3;
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
        return web3;
    }

    const initContract = async (web3) => {
      let postInstance = await new web3.eth.Contract(PostContract.abi,'0xafe21B9f0c2938C66AbcA29Df731D645FD6a97be');// 记得补充帖子合约地址
      postInstance.setProvider(web3.eth.currentProvider);
      console.log(postInstance.options);
      setPostInstance(postInstance);//通过postInstance.methods调用合约方法

      let boardInstance = await new web3.eth.Contract(BoardContract.abi,'0x92A46774efa768A8A91dB3904ecbA2e232027748');// 记得补充板子合约地址
      boardInstance.setProvider(web3.eth.currentProvider);
      console.log(boardInstance.options);
      setBoardInstance(boardInstance);

      var accounts = await web3.eth.getAccounts();
      web3.eth.defaultAccount = accounts[0];
      console.log(web3.eth.defaultAccount);
      userAddress = accounts[0];
      setUserAddress(accounts[0]);
      console.log('地址为：',userAddress);
      return postInstance;
    }

    const init = async () => {
      const web3 = await initWeb3();
      const postInstance = await initContract(web3);
      await handleContentChange(postInstance);
    }
    (async () => {
      await init();
    })();
}, []); // 只在组件挂载时运行

const handleContentChange = async(postInstance) => {
  let data = localStorage.getItem('data');
  var cid = await postInstance.methods.getContent(data).call({from:userAddress});
  const content = await retrieveText(cid);
  setContent(content);
};

    const history=useHistory() 
     const tofatie=()=>{
        history.push('/inputad')
      }
    return(
        <div>
          <div><Advertisement></Advertisement></div>
            <div>{content}</div>
            <Button type="primary" key="console" onClick={tofatie}>
        发广告
      </Button>
      <Upad postinstance={postInstance} boardinstance={boardInstance} useraddr = {userAddress}></Upad>
        </div>
        
    )
}
export default App;
