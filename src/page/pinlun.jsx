import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Modal, Space,List,Avatar,Input} from 'antd';
import {storeFile,retrieveText} from './web3Storage';

const { TextArea } = Input;

const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );
const LocalizedModal = ({ID,PostInstance,Address}) => {
    const [open, setOpen] = useState(false);
    const showModal = () => {
      setOpen(true);
    };
    const hideModal = () => {
      setOpen(false);
    };

    const [content, setContent] = useState('');

    const handleContentChange = event =>{
      setContent(event.target.value);
    }

    //评论
    const comment = async() =>{
      let CID='';
      try{
        await storeFile(content).then((cid) => {
          // 成功存储后的处理
          console.log('成功存储, CID:', cid);
          CID = cid;
        }).catch((error) => {
          // 存储失败时的处理
          console.error('存储失败:', error);
        });
        
        await PostInstance.methods.comment(
          ID,
          CID,
        ).send({from:Address}).on('transactionHash',(hash)=>{console.log(hash)});
      }catch(error){
        console.log('评论时出错',error);
      }
    }
    
    let [comments,setComments] = useState([]);
    let [authors,setAuthors] = useState([]);
    let [num,setNum] = useState(0);
    const [data,setData] = useState([]);

    const showComment = async() => {
      num = Number(await PostInstance.methods.getCommentNum(ID).call({from:Address}));
      let i = num;
      while(i){
        let _comment = await PostInstance.methods.getCommentContent(ID,i).call({from:Address});
        _comment = String(await retrieveText(_comment));
        comments.push(_comment);
        setComments(comments);
        let _author = await PostInstance.methods.getCommentAuthor(ID,i).call({from:Address});
        authors.push(_author);
        setAuthors(authors);
        i--;
      }

      const newData = Array.from({
        length: num,
      }).map((_, i) => ({
        id:i+1,
        title:authors[i],
        description:comments[i],
      }))
      setData(newData);
    }

    useEffect(()=>{
      const init =async() =>{
        await showComment();
      }
      init();
    },[])
       
    return (
      <>
        <Button  onClick={showModal}>
        <IconText icon={MessageOutlined}/>
        </Button>
        <Modal
          title="评论区"
          open={open}
          onOk={hideModal}
          onCancel={hideModal}
          okText="确认"
          cancelText="取消" 
        >
           <List
    itemLayout="horizontal"
    dataSource={data} 
    renderItem={(item, index) => (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
          title={<a href="">{item.title}</a>}
          description={item.description}
        />
      </List.Item>
    )}
  />

  <TextArea value={content} onChange={handleContentChange} rows={4} placeholder="请输入评论"  />
                      <Button onClick={comment}>发表评论</Button>
        </Modal>
      </>
    );
  };
  const App = ({id,postinstance,address}) => {
    const [modal, contextHolder] = Modal.useModal();
   
    return (
      <>
        <Space>
          <LocalizedModal ID={id} PostInstance={postinstance} Address={address}/>
        </Space>
        {contextHolder}
      </>
    );
  };
export default App;