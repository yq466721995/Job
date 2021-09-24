/* 
    个人中心主界面路由容器组件
*/
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Result, List, WhiteSpace, Button, Modal} from 'antd-mobile'
import Cookies from 'js-cookie'

import {resetUser} from '../../redux/actions'

const Item = List.Item
const Brief = Item.Brief

class Personal extends Component {

    loginout = ()=>{
        // alert('-------')
        Modal.alert('退出','确定退出登录吗？',[
            {
                text: '取消'
            },
            {
                text: '确认',
                onPress: () => {
                    //清除cookie中的userid
                    Cookies.remove('userid')
                    //清除redux管理的user
                    this.props.resetUser()
                }
            }
        ])
    }

    render() {
        const {username, info, header, company, post, salary} = this.props.user
        return (
            <div style={{marginBottom: 50, marginTop: 45}}>
                <Result img={<img src={require(`../../assets/images/${header}.png`).default} style={{width:50}} alt='header'/>} title={username} message={company}/>
                <List renderHeader={()=>'相关信息'}>
                    <Item multipleLine>
                        <Brief>职位：{post}</Brief>
                        <Brief>简介：{info}</Brief>
                        { salary ? <Brief>薪资：{salary}</Brief> : null }
                    </Item>
                </List>
                <WhiteSpace/>
                <List>
                    <Button type='warning' onClick={this.loginout}>退出登录</Button>
                </List>
            </div>
        )
    }
}
export default connect(
    state => ({user: state.user}),
    {resetUser}
)(Personal)
