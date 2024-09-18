import React from 'react';
import { Card, Space,Button,Table,Input } from 'antd';
import {useHistory} from 'dva'
import { SearchOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
const data = [
  {
    key: '1',
    name: 'John Brown',
    cost: 11111,
    classification: "产品广告",
    describe: '我们都是有问题的人',
  },
  {
    key: '2',
    name: 'Joe Black',
    cost:223322,
    classification:'品牌广告',
    describe: '人类失去联想，世界将会怎样',
  },
  {
    key: '3',
    name: 'Jim Green',
    cost:1214341,
    classification:'观念广告',
    describe: '心里的话，用影像说',
  },
  {
    key: '4',
    name: 'Jim Red',
    cost:2789,
    classification:'公益广告',
    describe: '出来逛，迟早要买的',
  },
];


const App = () => {
   
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
      clearFilters();
      setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
       
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({
                  closeDropdown: false,
                });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? '#1677ff' : undefined,
          }}
        />
      ),
      onFilter: (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: '#ffc069',
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    });
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        ...getColumnSearchProps('name'),
      },
      {
        title:'资金/¥',
        dataIndex:'cost',
        key:'cost',
        width:'15%',
        //...getColumnSearchProps('cost'),
      },
      {
        title: '广告分类',
        dataIndex: 'classification',
        key: 'classification',
        width: '20%',
        ...getColumnSearchProps('classification'),
      },
      {
        title: '广告简述',
        dataIndex: 'describe',
        key: 'describe',
       // ...getColumnSearchProps('address'),
        
      },
    ];
    const history=useHistory() 
     const toinputad=()=>{
        history.push('/inputad')
      }
    return(
        <Space direction="vertical" size={16}>
    <Card
      title="广告总览"
      extra={<Button type="primary" key="console" onClick={toinputad}>创建广告</Button>}
      style={{
        width: 1220,
      }}
    >
      <p><Table columns={columns} dataSource={data} /></p>
      
    </Card>
   
  </Space>
    )
  
};
export default App;