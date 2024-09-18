//主要页面布局页
import React, { useState } from 'react';
import {Route,Router,Switch} from 'dva/router'
import Advertisement from '../page/advertisement'
import Input from '../page/input'
import Inputad from '../page/inputad'
import Homepage from'../page/homepage'
import Success from '../page/success' 
import SuccessSet from '../page/successSet'
import News from '../page/news'
import Allad from '../page/allad'
import Page0 from '../detailpage/page0'
import {
  FundViewOutlined,
  CommentOutlined ,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import {useHistory} from 'dva'

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem('主页', '/homepage', <UserOutlined />),
  //getItem('广告', '/allad', <FundViewOutlined />),
  getItem('发帖', '/input', <CommentOutlined />),
  getItem('热度榜', '/news', <TeamOutlined />,),
  
];
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const history=useHistory()
  
  const MenuClick=({key})=>{
    console.log(key,'jj')
    history.push(key)
  };


  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu onClick={MenuClick} theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
     
           
      <Layout>
      {/*<Route path="/" >
      <Advertisement ></Advertisement></Route>*/}
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          
          <div
            style={{
              padding: 40,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
              <Route path="/input" >
            <Input ></Input></Route>
            <Route path="/allad" >
            <Allad ></Allad></Route>
            <Route path="/inputad" >
              <Inputad></Inputad>
            </Route>
            <Route path="/homepage" >
            <Homepage ></Homepage></Route>
            <Route path="/success" >
            <Success ></Success></Route>
            <Route path = '/successSet'>
            <SuccessSet></SuccessSet></Route>
            <Route path="/news">
              <News></News>
            </Route>
            <Route path="/page0">
              <Page0></Page0>
            </Route>
            
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;