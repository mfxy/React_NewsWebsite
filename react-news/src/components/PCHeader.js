import React from 'react';
import {Row,Col,Button,Menu,Icon,Avatar,
    Form,Modal,Input,Tabs,message} from 'antd';
import {Link} from 'react-router';
// import {icon} from '../images/icon.png'

const base_url = "http://newsapi.gugujiankong.com/Handler.ashx?action=";

class PCHeader extends React.Component{
    constructor(){
        super();
        this.state = {
            current: "top",
            modalVisible: false,
            action: 'login',
            hasLogined: false,
            userNickname: "",
            userID: 0
        }
    }

    showModal(value){
        this.setState({modalVisible: value});
    }

    handleSubmit(e){
        e.preventDefault();
        var fetchOptions = { method: 'GET' };
        var formData = this.props.form.getFieldsValue();
        console.log(formData);
        fetch(base_url + this.state.action
		+ "&username="+formData.userName+"&password="+formData.password
		+"&r_userName=" + formData.r_userName + "&r_password="
		+ formData.r_password + "&r_confirmPassword="
        + formData.r_confirmPassword, fetchOptions)
        .then(response=>response.json())
        .then(json=>{
            this.setState({userNickname: json.NickUserName, userID: json.UserId});
            localStorage.userID = json.UserId;
            localStorage.userNickname = json.NickUserName;
        })
        if(this.state.action==="login"){
            this.setState({hasLogined:true});
        }
        message.success("Login!");
        this.showModal(false);
    }

    // handleClick(e){
    //     this.setState({current:e.key});
    //     if(e.key=="register"){
    //         this.showModal(true);
    //     }
    // }

    callback(key){
        if(key===1){
            this.setState({action:'login'});
        }else if(key===2){
            this.setState({action:'register'});
        }
    }

    logout(){
        localStorage.userID='';
        localStorage.userNickname='';
        this.setState({hasLogined:false});
        message.success("Logout!")
    }

    componentWillMount(){
        if(localStorage.userID!==''){
            this.setState({
                hasLogined:true,
                userNickname:localStorage.userNickname,
                userID:localStorage.userID
            });
        }
    }

    render(){
        const {getFieldDecorator} = this.props.form;

        const userShow = this.state.hasLogined 
        ?
        // <Menu.Item key="logout">
        <div style={{textAlign: "center"}}>
            <Avatar size="large">{this.state.userID}</Avatar>
            <span> Hi, {this.state.userNickname} </span>
            <Link to="/userinfo" target="_blank">
                <Button type="primary">Info</Button>&nbsp;
            </Link>
            <Button type="ghost" onClick={this.logout.bind(this)}>Logout</Button>
        </div>
        // </Menu.Item> 
        :
        // <Menu.Item key="register">
        <div style={{textAlign: "center"}}>
            <Button type="primary" onClick={()=>this.showModal(true)}><Icon type="user" />Sign Up</Button>
        </div>
        // </Menu.Item>
        ;

        return(
            <header>
                <Modal title="User" visible={this.state.modalVisible}
                onCancel={()=>this.showModal(false)} footer={null}>
                    <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}>
                        <Tabs.TabPane key="1" tab="Login">
                            <Form onSubmit={this.handleSubmit.bind(this)}>
                                <Form.Item>
                                    {getFieldDecorator('userName')(<Input  placeholder="Username"/>)}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('password')(<Input type="password" placeholder="Password" />)}
                                </Form.Item>
                                <Button type="primary" htmlType="submit">Login</Button>
                            </Form>
                        </Tabs.TabPane>
                        <Tabs.TabPane key="2" tab="Sign up">
                            <Form onSubmit={this.handleSubmit.bind(this)}>
                                <Form.Item>
                                    {getFieldDecorator("r_userName")(<Input placeholder="Username" />)}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator("r_password")(<Input type="password" placeholder="Password" />)}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator("r_confirmPassword")(<Input type="password" placeholder="Confirm Password" />)}
                                </Form.Item>
                                <Button type="primary" htmlType="submit">Sign Up</Button>
                            </Form>
                        </Tabs.TabPane>
                    </Tabs>
                </Modal>

                <Row>
                    <Col span={2}></Col>
                    <Col sm={20} md={10}>
                        <a href="/" className="logo">
                            {/* <img src={icon} alt="logo"/> */}
                            <span>News Website</span>
                        </a>
                    </Col>
                    <Col sm={20} md={10}>
                        {/* <Menu selectedKeys={[this.state.current]} mode="horizontal"
                        onClick={this.handleClick.bind(this)}>
                            <Menu.Item key="top">
                                <Icon type="home"/> Top
                            </Menu.Item>
                            <Menu.Item key="sports">
                                <Icon type="rocket"/> Sports
                            </Menu.Item>
                            <Menu.Item key="entertainment">
                                <Icon type="video-camera"/> Entertainment
                            </Menu.Item>
                            <Menu.Item key="technology">
                                <Icon type="appstore"/> Technology
                            </Menu.Item> */}
                            {userShow}
                        {/* </Menu> */}
                    </Col>
                    <Col span={2}></Col>
                </Row>
            </header>
        );
    }
}

export default PCHeader = Form.create()(PCHeader);