//import React from 'react';
import Web3 from 'web3';
import { Space, Table, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import PostContract from '../build/contracts/PostContract.json';
const { Column, ColumnGroup } = Table;

const App = () => {
  const [contents, setContents] = useState([]);
  const [author, setAuthor] = useState([]);
  const [count, setCount] = useState(0);
  let [web3, setWeb3] = useState(null);
  let [postInstance,setPostInstance] = useState(null);
  let [userAddress, setUserAddress] = useState('');
  let [heatValues, setHeatValues] = useState([]);
  const [data, setData] = useState([]);

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
    fetchHeatValues();
  }
  init();
  
  }, []); // 只在组件挂载时运行
  
  // 新增 fetchHeatValues 函数用于获取热度值
  const fetchHeatValues = async () => {
    const count = await postInstance.methods.getIdCounter().call({ from: userAddress });
    setCount(count);
    let it = 1;
    
    while (it <= Number(count)) {
      await postInstance.methods.caculateHeatvalue(it).send({from:userAddress});
      var heatValue = Number(await postInstance.methods.getHeatvalue(it).call({ from: userAddress }));
      var title = await postInstance.methods.getTitle(it).call({from:userAddress});
      var _author = await postInstance.methods.getAuthor(it).call({from:userAddress});
      heatValues.push({ id: it, heatValue:heatValue, author:_author, content:title}); // 存储id和对应的热度值
      setHeatValues(heatValues); // 更新状态
      it++;
    }


    const sortBy=(attr,rev)=>{
      if( rev==undefined ){ rev=1 }else{ (rev)?1:-1; }
      return function (a,b){
          a=a[attr];
          b=b[attr];
          if(a<b){ return rev*-1}
          if(a>b){ return rev* 1 }
          return 0;
      }
    }

    const sortedData = heatValues.sort(sortBy('heatValue',-1));
/*
    // 为排序后的数据添加序号
    const sortedDataWithRank = sortedData.map((item, index=0) => ({
      ...item,
      rank: index + 1, // 序号，从1开始
    }));*/
    console.log('looooooook',sortedData)

    const newdata = Array.from({
      length: sortedData.length,
    }).map((_, i) => ({
      href: `http://localhost:3000/#/page0`,
      title: heatValues[i].author,
      avatar:`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
      description:heatValues[i].id,
      postinstance:postInstance,
      address:userAddress,
      content:heatValues[i].content,
      heat:heatValues[i].heatValue,
    }))
    setData(newdata);
  };


  return (
<Table dataSource={data}>
    <ColumnGroup title="Rank and Name">
      <Column title="热度" dataIndex="heat" key="heat" />
      <Column title="作者地址" dataIndex="title" key="title" />     
    </ColumnGroup>
    <Column title="标题" dataIndex="content" key="content" /> 
    <Column
      title="Action"
      key="action"
      render={(_, record) => (
        <Space size="middle">
          <a>跳转</a>
        </Space>
      )}
    />
  </Table>
  );
};

export default App;