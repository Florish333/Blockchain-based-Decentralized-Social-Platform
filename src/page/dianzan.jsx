import React, { useState ,useRef} from 'react';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Button,Space} from 'antd';
const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );
const App = () => {
  const [count, setCount] = useState(0);
  const flag = useRef(true)
  const handleCount =()=>{  
    if(flag.current){
      flag.current = false
      setCount(count+1) // 这里等待请求完后端数据后，将状态设成 true
      setTimeout(()=>{
        flag.current = true
      },3000)
    } 
  }
  return (
    <a>
    <Button onClick = {()=>{handleCount()}} ><IconText icon={LikeOutlined} text={count}/></Button>,
    </a>
  );
};
export default App