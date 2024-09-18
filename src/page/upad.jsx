import { Button, Modal,Form,Input,Card,DatePicker,Statistic,Col } from 'antd';
import React, { useState } from 'react';

const App = ({postinstance,boardinstance,useraddr}) => {
  const {Item}= Form
  const {TextArea}= Input
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const [min, setMin] = useState(1);
  const [fee, setFee] = useState(0);

  const showModal = async() => {
      setOpen(true);
      let _fee = await boardinstance.methods.getBoardFee().call({from:useraddr}); 
      setFee(Number(_fee)/(10**18));
  };

  const handleMinChange=event=>{
    setMin(event.target.value);
  }

  const handleOk = async() => {
    setModalText('The modal will be closed after two seconds');
    let data = localStorage.getItem('data');
    let flag=false;
    try{
      flag=await boardinstance.methods.showThePost(data,min*60).send({from:useraddr,value:min*fee*(10**18)}).on('transactionHash',(hash)=>{console.log(hash)});
    }catch(error){
      console.log('上置顶错误',error);
    }
    if(flag){
      console.log('发布成功');
    }else{
      console.log('发布失败');
    }
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        上置顶
      </Button>
      <Modal
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>
<Card>
    <Item label="上主页时间" name="time">
    <Input.Group compact>
      <Input
        style={{
          width: '30%',
        }}
        defaultValue="单位：分"
      />
      <Input defaultValue="1" style={{width: '70%',}} value={min} onChange={handleMinChange}/>
    </Input.Group>
    </Item>
    <Item label="总价格：" name="money">
    <Col span={20}>
      <Statistic title={`每分钟单价${fee}ETH`} value={`总共需支付${min*fee}ETH`} />
    </Col>
    </Item>
</Card>


        </p>
      </Modal>
    </>
  );
};
export default App;