/* 
    登录路由
*/
import React, { Component } from 'react'
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Button
} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {login} from '../../redux/actions'

import Logo from '../../components/logo'

class Login extends Component {

    state = {
        username: '',  //用户名
        password: '',  //密码
    }

    login = ()=>{
        // console.log(this.state)
        this.props.login(this.state)
    }

    //处理输入数据的改变：更新对应的状态
    handleChange = (name,val)=>{

        //更新状态
        this.setState({
            [name]:val  //属性名不是name，而是name的值
        })
    }

    toLogin = ()=>{
        this.props.history.replace('/register')
    }

    render() {
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
                        <InputItem placeholder='请输入用户名' onChange={ val =>{ this.handleChange('username',val) } }>用户名：</InputItem>
                        <WhiteSpace/>
                        <InputItem type='password' placeholder='请输入密码' onChange={ val =>{ this.handleChange('password',val) } }>密&nbsp;&nbsp;&nbsp;码：</InputItem>
                        <WhiteSpace/>
                        <Button type="primary" onClick={this.login}>登&nbsp;&nbsp;录</Button>
                        <Button onClick={this.toLogin}>没有账号</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {login}
)(Login)