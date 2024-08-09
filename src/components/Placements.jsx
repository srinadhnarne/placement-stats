import React, { useEffect, useState } from 'react'
import {Flex,Menu, Layout, Switch, Divider, Table, ConfigProvider,Modal, Button, Form, Input, Space } from 'antd'
import {BookOutlined, UserOutlined} from '@ant-design/icons'
import { useTheme } from '../contexts/useTheme';
import axios from 'axios'
import { useAuth } from '../contexts/useAuth';
import toast from 'react-hot-toast';
import EditStats from './EditStats';

const Placements = () => {
    const {authToken,setAuthToken,userData,setUser} = useAuth();
    const {currentTheme,setTheme} = useTheme();
    const {Sider,Content} = Layout;
    const [currentPage,setCurrentPage] = useState(1); 
    const [Stats,setStats] = useState(null);
    const [dataloading,setDataLoading] = useState(false);
    const {Column, ColumnGroup} = Table;
    const [isSmallScreen,setSmallScreen] = useState(true);
    const [cummulatedData,setCumulated] = useState([0,0]);
    const [name,setName] = useState(null);
    const [email,setEmail] = useState(null);
    const [password,setPassword] = useState(null);
    const [security,setSecurity] = useState(null);
    const [AuthPage,setAuthPage] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            if(window.innerWidth<=800){
                setSmallScreen(true);
                setCurrentPage(2);
            }
            else
            {
                setSmallScreen(false)
            }
        };
        
        window.onload = handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const [Logging,setLogging] = useState(false);
    const handleOk = async ()=>{
        // setIsModalOpen(false);
        if(!email||!password){
            return alert('Enter Credentials');
        }
        const emailRegex = /^2021ugec[0-9]{3}@nitjsr.ac.in$/
        if(!emailRegex.test(email)) return alert('Enter Correct email')
        try {
            setLogging(true);
            const {data} = await axios.post(`${process.env.REACT_APP_API}/auth/login`,{
                email,password
            });
            if(data.success){
                setLogging(false);
                setAuthToken(data.token);
                setUser(data.user);
                setIsModalOpen(false);
                toast.success(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
            setLogging(false);
        }
    }

    const handleSignUp = async ()=>{
        if(!email||!password||!name||!security){
            return alert('Enter All Credentials');
        }
        const emailRegex = /^2021ugec[0-9]{3}@nitjsr.ac.in$/
        if(!emailRegex.test(email)) return alert('Enter Correct email')
        try {
            setLogging(true);
            const {data} = await axios.post(`${process.env.REACT_APP_API}/auth/signup`,{
                email,password,name,security
            });
            if(data.success){
                setAuthToken(data.token);
                setUser(data.user);
                setLogging(false);
                setIsModalOpen(false);
                toast.success(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const handleForgot = async ()=>{
        if(!email||!password||!security){
            return alert('Enter All Credentials');
        }
        const emailRegex = /^2021ugec[0-9]{3}@nitjsr.ac.in$/
        if(!emailRegex.test(email)) return alert('Enter Correct email')
        try {
            setLogging(true);
            const {data} = await axios.post(`${process.env.REACT_APP_API}/auth/reset-password`,{
                email,password,security
            });
            if(data.success){
                setLogging(false);
                setAuthPage(0);
                toast.success(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const handleSection = (val)=>{
        if((!isSmallScreen||val>2)&&currentPage!==val) {
            setCurrentPage(val);
            // if(val>1&&val<5)setStats(null);
        }
        if(val===2){
            setCumulated([0,0]);
        }
        if(val===1&&!authToken) {
            showModal();
        }
    }

    const [items,setItems] = useState([
        {
            key: '1',
            icon: React.createElement(UserOutlined),
            label: "LOGIN"
        },
        {
            key: '2',
            icon: React.createElement(BookOutlined),
            label: "ALL PLACEMENTS",
        },
        {
            key: '3',
            icon: React.createElement(BookOutlined),
            label: "6M/6M+PPO",
        },
        {
            key: '4',
            icon: React.createElement(BookOutlined),
            label: "FTE/6M+FTE",
        }
    ])

    useEffect(()=>{
        
        if(userData){
            const newItems = [...items];
            if(userData.role===1&&items.length<5){
                newItems.push({
                    key: '5',
                    icon: React.createElement(BookOutlined),
                    label: "EDIT 6M/6M+PPO",
                },{
                    key: '6',
                    icon: React.createElement(BookOutlined),
                    label: "EDIT FTE/6M+FTE",
                });
            }
            newItems[0].label=userData.name;
            setItems(newItems);
            // console.log(items);
        }
    },[userData])



    const onChange = (checked)=>{
        if(checked){
            setTheme('dark');
        }
        else{
            setTheme('light');
        }
    }

    const get6M = async (pgNo)=>{
        try {
            setDataLoading(true);
            const {data} = await axios.post(`${process.env.REACT_APP_API}/data/get-6M/${pgNo!==undefined?pgNo:1}`,{},{
                headers:{
                    Authorization:authToken
                }
            });
            if(data?.success){
                setStats(data?.SixMData);
                setDataLoading(false);
            }
        } catch (error) {
            console.log(error);
            const {data} = error.response;
            toast.error(data?.message);
            if(error?.response?.status===401) handleLogout();
            setDataLoading(false);
        }
    }

    const getFTE = async (pgNo)=>{
        try {
            setDataLoading(true);
            const {data} = await axios.post(`${process.env.REACT_APP_API}/data/get-FTE/${pgNo!==undefined?pgNo:1}`,{},{
                headers:{
                    Authorization:authToken
                }
            });
            if(data?.success){
                setStats(data?.FTEData);
                setDataLoading(false);
            }
        } catch (error) {
            console.log(error);
            const {data} = error.response;
            toast.error(data?.message);
            if(error?.response?.status===401) handleLogout();
            setDataLoading(false);
        }
    }

    const getAllData = async (pgNo)=>{
        try {
            setDataLoading(true);
            const {data} = await axios.post(`${process.env.REACT_APP_API}/data/get-All/${pgNo!==undefined?pgNo:1}`,{},{
                headers:{
                    Authorization:authToken
                }
            });
            console.log(data);
            if(data?.success){
                setStats(data?.AllData);
                setDataLoading(false);
            }
        } catch (error) {
            console.log(error);
            // if(error)
            const {data} = error.response;
            toast.error(data?.message);
            if(error?.response?.status===401) handleLogout();
            setDataLoading(false);
        }
    }

    const handlePageChange = (e)=>{
        // console.log(e,currentPage)
        if(currentPage===2) getAllData(e);
        else if(currentPage===3||currentPage===5) get6M(e);
        else if(currentPage===4||currentPage===6) getFTE(e);
    }

    const getAccumulatedInfo = async (queryType)=>{
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_API}/data/get-cummulated-data/${queryType}`,{
                headers:{
                    Authorization:authToken
                }
            });
            // console.log(data);
            if(data?.success){
                setCumulated(data.accumulatedData);
            }
        } catch (error) {
            console.log(error);
            if(error?.response?.status===401) handleLogout();
        }
    }

    const handleLogout = ()=>{
        localStorage.removeItem('ECE-authToken');
        localStorage.removeItem('ECE-User');
        setAuthToken(null);
        setUser(null);
        setCumulated([0,0]);
        setStats(null);
        const newItems = [...items];
        newItems[0].label='LOGIN';
        if(newItems.length===6) items.splice(5,2);
        setItems(newItems);
    }

    useEffect(()=>{
        handlePageChange(1);
        if(currentPage===2){
            setCumulated([0,0]);
            getAccumulatedInfo('All');
        }
        else if(currentPage===3||currentPage===5) {
            getAccumulatedInfo('Intern');
        }
        else if(currentPage===4||currentPage===6) {
            getAccumulatedInfo('FTE');
        }
        // eslint-disable-next-line
    },[currentPage]);
    

    return (
    <Layout theme={currentTheme} style={{height:'100vh',width:'100vw',minWidth:'400px'}}>
        <Sider 
            theme={currentTheme}
            breakpoint="lg"
            collapsedWidth="0"
        >
            <Flex align='center' justify='space-between' vertical style={{height:'100%', paddingBottom:'20px'}}>
                <Menu theme={currentTheme} items={items} onClick={(e)=>{handleSection(Number(e.key))}} />
                <Flex align='center' gap={15} vertical>
                    {authToken&&<a href='/' onClick={()=>{handleLogout()}}>Logout</a>}
                    <Switch onChange={onChange}/> 
                </Flex>
            </Flex>
        </Sider>
        <Content style={{ 
            height:'100vh',
            width:'inherit',
            padding: '16px 16px',
            backgroundColor: currentTheme==='dark'?'rgb(0,21,41,0.9)':'rgb(255,250,250)',
            color:currentTheme==='dark'?'rgb(160,168,176)':'black'
            }}
        >
            <Flex
                style={{
                height:'100%',
                boxShadow:'0 0 14px grey',
                borderRadius:'20px',
                padding:'20px',
                width:'100%'
                }}
                vertical
                align='center'
            >
                <div
                    style={{
                        fontWeight:'700',
                        fontSize:'20px',
                        display:'flex',
                        justifyContent:'center',
                        alignItems:'center',
                        textAlign:'center'
                    }}

                >
                    ECE 2021-2025 PLACEMENT STATSTICS
                </div>
                <Divider variant='solid' style={{padding:'2px',margin:'6px'}}/>
                <ConfigProvider
                    theme={{
                        token:currentTheme==='light'?
                                {
                                    colorPrimary: 'rgb(125,155,150)',
                                    colorText: 'rgb(0,0,0)',
                                    colorBgContainer: 'rgb(255,250,250)'
                                }:
                                {
                                    colorPrimary: 'rgb(175,155,200)',
                                    colorText: 'rgb(160,168,176)',
                                    colorBgContainer: 'rgb(10,40,70)'
                                }
                    }}
                >
                    {(currentPage<5)&&
                        <Table 
                            dataSource={Stats} 
                            pagination={{
                                pageSize:10,total:111,
                                onChange:handlePageChange,
                                showSizeChanger:false
                            }}
                            size={`small`} 
                            style={{
                                width:'100%', 
                                borderRadius:'10px',
                            }} 
                            loading={dataloading}
                            bordered
                        >
                            <Column title="REGISTRATION NUMBER" dataIndex="RegNo" key="RegNo"/>
                            {!isSmallScreen&&<Column title='Name' dataIndex={"Name"} key={'_id'}/>}
                            {(currentPage!==4)&&
                            <ColumnGroup title="6M/6M+PPO">
                                <Column title="Company" dataIndex="InternCompany" key="_id"/>
                                <Column title="Stipend(K/M)" dataIndex={"Stipend"} key={"_id"}/>
                            </ColumnGroup>}
                            {(currentPage!==3)&&
                            <ColumnGroup title="FTE/6M+FTE">
                                <Column title="Company" dataIndex="PlacementCompany" key="_id"/>
                                <Column title="CTC(L.P.A)" dataIndex="CTC" key='_id'/>
                            </ColumnGroup>}
                        </Table>
                    }
                    {(currentPage===5||currentPage===6)&&
                        <EditStats 
                            Type={currentPage===5?'Intern':'Placement'} 
                            Stats={Stats} 
                            handlePageChange={handlePageChange} 
                            isSS={isSmallScreen}
                        />
                    }
                </ConfigProvider>
                <Flex 
                    style={{
                        width:'100%',
                        textAlign:'left'
                    }}
                    vertical
                >
                    <div>
                        Students with {currentPage===2?'Placement':currentPage===3?'6M/6M+PPO':currentPage===4&&'FTE/6M+FTE'} : {cummulatedData[0]}
                    </div>
                    {   currentPage===3?
                        <div>
                            Avg Stipend : {cummulatedData[1]} K/M
                        </div>:
                        currentPage===4&&
                        <div>
                            Avg CTC : {cummulatedData[1]} L.P.A 
                        </div>
                    }
                </Flex>
                {/* <Pagination align="start" defaultCurrent={1} onChange={(e)=>handlePageChange(e)} total={111} showSizeChanger={false}/> */}
            </Flex>
        </Content>
        <Modal 
            title="ENTER CREDENTIALS" 
            open={isModalOpen}
            onCancel={()=>setIsModalOpen(false)}
            okText={AuthPage===0?'LOGIN':AuthPage===1?'SIGN UP':'RESET PASSWORD'} 
            cancelButtonProps={{ hidden: true }}
            footer={null}
            centered
            style={{textAlign:'center'}}
        >
            <Form>
                {
                    AuthPage===1&&
                    <Form.Item>
                        <Input 
                            required 
                            placeholder="Name" 
                            type='text' 
                            value={name}
                            onChange={(e)=>{setName(e.target.value);setLogging(false)}}
                        />
                    </Form.Item>
                }
                <Form.Item>
                    <Input 
                        required 
                        placeholder="E-mail" 
                        type='email' 
                        value={email} 
                        onChange={(e)=>{setEmail(e.target.value);setLogging(false)}}/>
                </Form.Item>
                <Form.Item>
                    <Input 
                        required 
                        placeholder="Password" 
                        type='password' 
                        value={password}
                        onChange={(e)=>{setPassword(e.target.value);setLogging(false)}}/>
                </Form.Item>
                {
                    AuthPage!==0&&
                    <Form.Item>
                        <Input 
                            required 
                            placeholder="Security Answer" 
                            type='text' 
                            value={security}
                            onChange={(e)=>{setSecurity(e.target.value);setLogging(false)}}
                        />
                    </Form.Item>
                }
                <Form.Item>
                    {AuthPage===0&&<Button type="primary" onClick={handleOk} disabled={Logging?true:false}>LOGIN</Button>}
                    {AuthPage===1&&<Button type="primary" onClick={handleSignUp} disabled={Logging?true:false}>SIGN UP</Button>}
                    {AuthPage===2&&<Button type="primary" onClick={handleForgot} disabled={Logging?true:false}>RESET PASSWORD</Button>}
                </Form.Item>
                <Space>
                    {AuthPage!==1&&
                        <>
                            <a onClick={()=>{setAuthPage(1);setLogging(false)}}>Sign Up</a>
                            <div> | </div>
                        </>
                    }
                    {AuthPage!==0&&<a onClick={()=>{setAuthPage(0);setLogging(false)}}>Login</a>}
                    {AuthPage!==2&&
                        <>
                            <div> | </div>
                            <a onClick={()=>{setAuthPage(2);setLogging(false)}}>Forgot Password?</a>
                        </>
                    }
                </Space>
            </Form>
        </Modal>
    </Layout>
  )
}

export default Placements