//所有页面上方滑动展示广告页面
import React ,{useState,useEffect}from 'react';
import { Carousel,Button ,Card,Image} from 'antd';
const contentStyle = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};
const App = () => {
  //const [visible, setVisible] = useState(false);
  
  return(
  <Carousel autoplay>
    <div>
      <h3 style={contentStyle}>
      <Image style={contentStyle} src="https://img0.baidu.com/it/u=1878556986,2867494654&fm=253&fmt=auto&app=138&f=JPEG?w=938&h=500"> 
     {/*} preview={{
        visible,
        onVisibleChange: (value) => {
          setVisible(value);
        },
      }}>*/}
        </Image>
  </h3>
    </div>
    <div>
      <h3 style={contentStyle} >
      <Image  ></Image></h3>
    </div>
    <div>
      <h3 style={contentStyle}>
      <Image ></Image></h3>
    </div>
    <div>
      <h3 style={contentStyle}>
    <Image ></Image></h3>
    </div>
  </Carousel>
)};
export default App;
