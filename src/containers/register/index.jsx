/* 
    注册路由组件
*/
import React, { Component } from 'react'
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Radio,
    Button,
} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {register} from '../../redux/actions'

import Logo from '../../components/logo'
const ListItem = List.Item

class Register extends Component {

    state = {
        username: '',  //用户名
        password: '',  //密码
        password2:'',  //确认密码
        type:'dashen',  //用户类型
    }

    //点击注册调用
    register = ()=>{
        // console.log(this.state)
        this.props.register(this.state)
        // console.log(this.props.register(this.state))
    }

    //处理输入数据的改变：更新对应的状态
    handleChange = (name,val)=>{

        //更新状态
        this.setState({
            [name]:val  //属性名不是name，而是name的值
        })
    }

    toLogin = ()=>{
        this.props.history.replace('/login')
    }

    render() {
        const {type} = this.state
        const {msg,redirectTo} = this.props.user
        //如果redirectTo有值，则注册成功，就需要重定向到指定的路由
        if(redirectTo){
            return <Redirect to={redirectTo}></Redirect>
        }
        return (
            <div>
                <NavBar>人&nbsp;人&nbsp;直&nbsp;聘</NavBar>
                <Logo/>
                <WingBlank>
                    <List>
                        <WhiteSpace/>
                        {msg?<div className="error-msg">{msg}</div>:null}
                        <WhiteSpace/>
                        <InputItem onChange={ val =>{ this.handleChange('username',val) } } placeholder='请输入用户名'>用户名：</InputItem>
                        <WhiteSpace/>
                        <InputItem type='password' placeholder='请输入密码' onChange={ val =>{ this.handleChange('password',val) } }>密&nbsp;&nbsp;&nbsp;码：</InputItem>
                        <WhiteSpace/>
                        <InputItem type='password' placeholder='请再次输入密码' onChange={ val =>{ this.handleChange('password2',val) } }>确认密码：</InputItem>
                        <WhiteSpace/>
                        <ListItem>
                            <span>用户类型：</span>
                            &nbsp;&nbsp;&nbsp;
                            <Radio checked={type==='dashen'} onChange={ () =>{ this.handleChange('type','dashen') }}>大神</Radio>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={type==='laoban'} onChange={ () =>{ this.handleChange('type','laoban') }}>老板</Radio>
                        </ListItem>
                        <WhiteSpace/>
                        <Button type="primary" onClick={this.register}>注&nbsp;&nbsp;册</Button>
                        <Button onClick={this.toLogin}>已有账号</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {register}
)(Register)