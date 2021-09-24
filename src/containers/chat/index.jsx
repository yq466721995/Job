/*
    对话聊天的路由组件
*/
import React, { Component } from 'react'
import {NavBar, List, InputItem, Grid, Icon} from 'antd-mobile'
import {connect} from 'react-redux'

import {sendMsg, readMsg} from '../../redux/actions'

const Item = List.Item

class Chat extends Component {

    state = {
        content: '',
        isShow: false   //是否显示表情列表
    }
    //当第一次render()调用时加载
    componentWillMount(){
        //初始化表情列表数据
        const emojis = [
            '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
            '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
            '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
            '🤤', '😪', '😝', '🤮', '😎', '😭', '😱', '😖',
            '😓', '😤', '😡', '👌', '🤞', '👈', '👉', '👆',
            '👇', '👍', '🙏'
        ]
        this.emojis = emojis.map( emoji => ({text: emoji}) )
    }

    // 切换表情列表的显示
    toggleShow = () =>{
        const isShow = !this.state.isShow
        this.setState({isShow: isShow})
        if(isShow){
            // 切换表情列表的显示
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
            }, 0)
        }
    }

    handleSend = () =>{
        //收集数据
        const from = this.props.user._id
        const to = this.props.match.params.userid
        const content = this.state.content.trim()

        //发送请求(发消息)
        if(content){
            this.props.sendMsg({from, to, content})
        }
        //清除输入数据
        this.setState({content: '', isShow: false})
    }

    componentDidMount() {
        // 初始显示列表
        window.scrollTo(0, document.body.scrollHeight)
    }
    componentDidUpdate () {
        // 更新显示列表
        window.scrollTo(0, document.body.scrollHeight)
    }
    componentWillUnmount(){ //在退出之前
        //发请求更新消息的未读状态
        const from = this.props.match.params.userid
        const to = this.props.user._id 
        this.props.readMsg(from,to)
    }

    render() {

        const {user} = this.props
        const {users, chatMsgs} = this.props.chat

        //计算当前聊天的chatId
        const meId = user._id
        if(!users[meId]){   //如果还没有获取数据，先不做任何显示
            return null
        }

        const targetId = this.props.match.params.userid
        const chatId = [meId, targetId].sort().join('_')
        // console.log(chatMsgs)

        //对chatMsgs进行过滤
        const msgs = chatMsgs.filter(msg => msg.chat_id===chatId)
        // console.log(msgs)
        //得到目标用户的header头像和自己的header头像
        const meIcon = user.header ? require(`../../assets/images/${user.header}.png`).default : null
        const targetHeader = users[targetId].header
        const targetIcon = targetHeader ? require(`../../assets/images/${targetHeader}.png`).default : null

        return (
            <div id='chat-page'>
                <NavBar 
                    icon={<Icon type='left'/>}
                    className='sticky-header'
                    onLeftClick={() => this.props.history.goBack()}
                >
                    {users[targetId].username}
                </NavBar>
                <List style={{marginTop: 40, marginBottom: 40}}>
                    {
                        msgs.map(msg=>{
                            if(targetId===msg.from){   //对方发给我的
                                return (
                                    <Item 
                                        key={msg._id} 
                                        thumb={targetIcon}
                                    >
                                        {msg.content}
                                    </Item>
                                )
                            }else{  //发给对方的消息
                                return (
                                    <Item 
                                        key={msg._id} 
                                        className='chat-me' 
                                        extra={<img src={meIcon} 
                                        alt='我'/>}
                                    >
                                        {msg.content}
                                    </Item>
                                )
                            }
                        })
                    }
                </List>
                <div className='am-tab-bar'>
                    <InputItem placeholder="请输入"
                        onFocus={ () => this.setState({isShow: false}) } 
                        extra={ 
                            <span>
                                <span onClick={this.toggleShow} style={{marginRight: 5}}>😊</span>
                                <span onClick={this.handleSend}>发送</span>
                            </span>
                        } 
                        value={this.state.content} 
                        onChange={ val => this.setState({content: val}) } 
                    />
                    {
                        this.state.isShow ? <Grid
                        data={this.emojis}
                        square
                        columnNum={8}
                        carouselMaxRow={4}
                        isCarousel={true}
                        onClick={ (item) => {
                            this.setState({content: this.state.content + item.text})
                        }}
                    /> : null
                    }
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user, chat: state.chat}),
    {sendMsg, readMsg}
)(Chat)