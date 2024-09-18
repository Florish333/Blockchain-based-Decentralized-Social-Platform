import { Avatar, Divider, List, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
const App = ({postinstance,boardinstance,useraddr,hotdata}) => {
  
  const [data1, setData1] = useState([]);

  useEffect(() => {
    setData1(hotdata);
    console.log('loooooooooook here:',hotdata);
  }, []);
  return (
    <div
      id="scrollableDiv"
      style={{
        height: 210,
        overflow: 'auto',
        padding: '0 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)',
      }}
    >
     {/* <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore={data.length < 50}
        loader={
          <Skeleton
            avatar
            paragraph={{
              rows: 1,
            }}
            active
          />
        }
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >*/}
        <List
          dataSource={data1}
          renderItem={(item) => (
            <List.Item key={item.email}>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}//头像
                title={<a href="">{item.Name}</a>}//跳转网页
                description={item.title}//描述
              />
              <div>跳转</div> 
            </List.Item>
          )}
        />
      {/*</InfiniteScroll>*/}
    </div>
  );
};
export default App;