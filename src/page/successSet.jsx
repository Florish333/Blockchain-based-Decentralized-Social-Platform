import React from 'react';
import { Button, Result } from 'antd';
import {useHistory} from 'dva'
const App = () => {
  const history=useHistory() 
     const toallad=()=>{
        history.push('/homepage')
      }
      const backagain=()=>{
        history.push('./input')
      }
  return(
        <Result
    status="success"
    title="Successfully posted"
    subTitle="Please contact us promptly if you have any further questions"
    extra={[
      <Button type="primary" key="console" onClick={toallad}>
        主页
      </Button>,
      <Button key="buy" onClick={backagain}>再发一篇</Button>,
    ]}
  />
      )
  
  };
export default App;