import React from 'react';
import { Button, Result } from 'antd';
import {useHistory} from 'dva'
const App = () => {
  const history=useHistory() 
     const toallad=()=>{
        history.push('/allad')
      }
      const backagain=()=>{
        history.push('./inputad')
      }
  return(
        <Result
    status="success"
    title="Successfully purchased advertising service!"
    subTitle="Please contact us promptly if you have any further questions"
    extra={[
      <Button type="primary" key="console" onClick={toallad}>
        主页
      </Button>,
      <Button key="buy" onClick={backagain}>再来一单</Button>,
    ]}
  />
      )
  
  };
export default App;