/* 
    消息主界面路由容器组件
*/
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'
const Item = List.Item
const Brief = Item.Brief

/* 
    对chatMsgs按chat_id进行分组，并得到每个组的lastMsg组成的数组
    1.  找出每个聊天的lastMsg，并用一个容器对象来保存{chat_id:lastMsg}
    2.  得到所有lastMsg的数组
    3.  对数组进行排序(按create_time降序)
*/
function getLastMsgs(chatMsgs, userid){
    //1.  找出每个聊天的lastMsg，并用一个容器对象来保存{chat_id, lastMsg}
    const lastMsgObjs = {}
    chatMsgs.forEach(msg => {
        
        //对msg进行个体统计
        if(msg.to===userid && !msg.read){
            msg.unReadCount = 1
        }else{
            msg.unReadCount = 0
        }

        //得到msg聊天的标识id
        const chatId = msg.chat_id
        //获取以保存的当前组的lastMsg
        let lastMsg = lastMsgObjs[chatId]
        //没有
        if(!lastMsg){
            lastMsgObjs[chatId] = msg
        }else{//有
            //累加unReadCount=已经统计的 + 当面msg的
            const unReadCount = lastMsg.unReadCount + msg.unReadCount
            //如果msg比lastMsg晚，就将msg保存为lastMsg
            if(msg.create_time>lastMsg.create_time){
                lastMsgObjs[chatId] = msg
            }
            //将unReadCount保存在最新的lastMsg上
            lastMsgObjs[chatId].unReadCount = unReadCount
        }
    });
    //2.  得到所有lastMsg的数组
    const lastMsgs = Object.values(lastMsgObjs)

    //3.  对数组进行排序(按create_time降序)
    lastMsgs.sort(function(m1, m2){ //如果结果<0，将m1放在前面，如果结果为0，不变，如果结果>0，将m2放在前面
        return m2.create_time - m1.create_time
    })
    // console.log(lastMsgs)
    return lastMsgs
}

class Message extends Component {
    render() {

        const {user} = this.props
        //得到当前用户的id
        const meId = user._id
        const {users, chatMsgs} = this.props.chat
        //对chatMsgs按chat_id进行分组
        const lastMsgs = getLastMsgs(chatMsgs,meId)
        // console.log(lastMsgs)

        return (
            <List style={{marginTop:50, marginBottom:50}}>
                {
                    lastMsgs.map(msg => {
                        //得到目标用户的id
                        const targetUserId = msg.to === meId ? msg.from : msg.to
                        //得到目标用户的信息
                        const targetUser = users[targetUserId]
                        const targetIcon = targetUser.header ? require(`../../assets/images/${targetUser.header}.png`).default : null
                        return (
                            <Item
                                key={msg._id}
                                extra={<Badge text={msg.unReadCount}/>}
                                thumb={targetIcon}
                                arrow='horizontal'
                                onClick={()=>this.props.history.push(`/chat/${targetUserId}`)}
                            >
                                {targetUser.username}
                                <Brief>{msg.content}</Brief>
                            </Item>
                        )
                    } )
                }
            </List>
        )
    }
}
export default connect(
    state => ({
        user: state.user, 
        chat: state.chat
    }),
    {}
)(Message)
