import React, { useEffect, useState } from 'react';
import { ConfigProvider, Flex, Form, Input, Popconfirm, Table, Typography } from 'antd';
import axios from 'axios';
import { useAuth } from '../contexts/useAuth';
const EditableCell = ({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              message: `Please Input ${title}!`,
            },
          ]}
        >
          <Input/>
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};


const EditStats = ({Type,Stats,handlePageChange,isSS}) => {
  const {authToken} = useAuth();
  const [form] = Form.useForm();
  const [data, setData] = useState(Stats);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.RegNo === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      Company: '',
      Amount: '',
      ...record,
    });
    setEditingKey(record.RegNo);
  };
  const cancel = () => {
    setEditingKey('');
  };
  const save = async (RegNo) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => RegNo === item.RegNo);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
      try {
        console.log(row);
        const {data}= await axios.post(`${process.env.REACT_APP_API}/data/update-Data`,{
          query:Type,
          RegNo,
          Company:Type==='Intern'?row.InternCompany:row.PlacementCompany,
          Amount:Type==='Intern'?row.Stipend:row.CTC
        },{
          headers:{
            Authorization:authToken
          }
        })
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const columns = [
    {
      title: 'Reg No',
      dataIndex: 'RegNo',
      width: '15%'
    },
    {
      title: 'Name',
      dataIndex: 'Name',
      width: '25%',
      hidden:isSS
    },
    {
      title: 'Company',
      dataIndex: `${Type}Company`,
      width: isSS?'35%':'40%',
      editable: true,
    },
    {
      title: 'Amount',
      dataIndex: Type==='Intern'?'Stipend':'CTC',
      width: '10%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Flex vertical align='center' gap={5}>
            <Typography.Link
              onClick={() => save(record.RegNo)}
              
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </Flex>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  useEffect(()=>{
    setData(Stats);
  },[Stats]);
  return (
    <ConfigProvider>
      <Form form={form} component={false}
        style={{width:'100%'}}
      >
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            pageSize:10,total:111,
            onChange:(e)=>{handlePageChange(e)},
            showSizeChanger:false
          }}
          style={{
            width:'100%'
          }}
          size='small'
        />
      </Form>
    </ConfigProvider>
  );
};
export default EditStats;