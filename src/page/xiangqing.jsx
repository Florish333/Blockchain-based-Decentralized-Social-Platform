import React, { useState,useEffect } from 'react';
import { Button, Popconfirm } from 'antd';
import { useHistory } from 'react-router-dom'
import { Result } from 'antd';

const App = ({detailHref,id,postinstance,address,userinstance}) => {
  const item="原item" 
  const ID =Number(id); 
  const [fee,setFee] = useState(0);
  useEffect(() => {
    (async () => {
      let Test = await userinstance.methods.check(ID).call({from:address});
      if(Test||((await postinstance.methods.getAuthor(ID))==address)){
        setFee(0);
      }
      else{
        var _fee = await postinstance.methods.getFee(ID).call({from:address});
        setFee(Number(_fee)/(10**18));
      }
    })();
  }, []);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const history = useHistory()
  const showPopconfirm = () => {
    setOpen(true);
  };
  const handleOk = async() => {
    let result;
    let test = await userinstance.methods.check(ID).call({from:address});
    if(!test){
    try{
      result = await userinstance.methods.purchase(ID).send({from:address,value:fee*(10**18)}).on('transactionHash',(hash)=>{console.log(hash)});
    }catch(error){
      console.log('支付时出错',error);
      return;
    }
    console.log("支付结果是：",result)}
    localStorage.setItem('data', ID);
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
      window.location = detailHref
    }, 2000);
  };
  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  return (
    <Popconfirm
      title="注意！"
      description={'本次阅读需要花费'+fee+'ETH'}
      open={open}
      onConfirm={handleOk}
      okButtonProps={{
        loading: confirmLoading,
      }}
      onCancel={handleCancel}
    >
      <Button type="primary" onClick={showPopconfirm}>
        查看详情
      </Button>
    </Popconfirm>
  );
};
export default App;