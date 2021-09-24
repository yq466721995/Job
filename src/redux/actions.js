/* 
    包含n个action creator
    异步action
    同步action
*/
import io from 'socket.io-client'
import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER,
    RESET_USER,
    RECEIVE_USER_LIST,
    RECEIVE_MSG,
    RECEIVE_MSG_LIST,
    MSG_READ
} from './action-type'
// import { Result } from 'antd-mobile'
import {
    reqRegister,
    reqLogin,
    reqUpdateUser,
    reqUser,
    reqUserList,
    reqChatMsgList,
    reqReadMsg
} from '../api'

/* 
    单例对象
    1.创建对象之前：判断对象是否已经存在，只有不存在才创建
    2.创建对象之后：保存对象
*/
function initIO(dispatch, userid){
    //1.创建对象之前：判断对象是否已经存在，只有不存在才创建
    if(!io.socket){
        //连接服务器,得到与服务器的连接对象
        //2.创建对象之后：保存对象
        io.socket = io('ws://localhost:4000',{transports:['websocket','xhr-polling','jsonp-polling']})
        //绑定监听，接收服务器发送的消息
        io.socket.on('receiveMsg',function(chatMsg){
            // console.log('客户端接收服务器发送的消息',chatMsg)
            //只有当chatMsg是与当前用户有关的消息，才去分发同步action保存信息
            if(userid===chatMsg.from || userid===chatMsg.to){
                dispatch(receiveMsg(chatMsg,chatMsg.to === userid))
            }
        })
    }
}


async function getMsgList(dispatch, userid){
    initIO(dispatch, userid)
    const response = await reqChatMsgList()
    const result = response.data
    if(result.code===0){
        const {users, chatMsgs} = result.data
        //分发同步action
        dispatch(receiveMsgList({users, chatMsgs, userid}))
        // console.log('data:',chatMsgs)
    }
}

//异步发送消息的action
export const sendMsg = ({from, to, content}) => {
    return dispatch => {
        // console.log('客户端向服务器发送消息',{from, to, content})
        io.socket.emit('sendMsg',{from, to, content})
        // getMsgList(dispatch,from)
        // getMsgList(dispatch,to)
    }
}

//读取消息的异步action
export const readMsg = (from,to) => {
    return async dispatch => {
        const response = await reqReadMsg(from)
        const result = response.data
        if(result.code===0){
            const count = result.data
            //分发同步action
            dispatch(msgRead({count, from, to}))
        }
    }
}


//授权成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})
//错误提示信息的action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg})
//接收用户同步的action
const receiveUser = (user) => ({type: RECEIVE_USER, data: user})
//重置用户的同步action
export const resetUser = (msg) => ({type: RESET_USER, data: msg})
//接收用户列表的同步action
export const receiveUserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList})
//接收消息列表的同步action
export const receiveMsgList = ({users, chatMsgs, userid}) => ({type: RECEIVE_MSG_LIST,  data: {users, chatMsgs, userid}})
//接收一个消息的同步action
const receiveMsg = (chatMsg,isToMe) => ({type: RECEIVE_MSG, data: {chatMsg,isToMe}})
//读取了某个聊天消息的同步action
const msgRead = ({count, from, to}) => ({type: MSG_READ, data: {count, from, to}})


//注册异步action
export const register = (user) =>{
    const {username,password,password2,type} = user
    //做表单的前台验证，如果不通过，返回一个errorMsg的同步action
    if(!username || !password){
        return errorMsg('用户名或密码不能为空')
    }
    else if(password!==password2){
        return errorMsg('两次密码输入不一致')
    }

    //表单数据合法，返回一个发ajax请求的异步action函数
    return async dispatch =>{
        //发送注册的异步ajax请求
        /* const promise = reqRegister({username,password,type})
        promise.then(response=>{
            const result = response.data    //{code:0,data:user}或者{code:1,msg:''}
            console.log(result)
            return result
        }) */
        const response = await reqRegister({username,password,type})
        const result = response.data
        // console.log(result)
        if(result.code === 0){  //成功
            getMsgList(dispatch, result.data._id)
            //分发成功的同步action
            dispatch(authSuccess(result.data))
        }else{  //失败
            //分发错误提示信息的同步action
            dispatch(errorMsg(result.msg))
        }
    }
}

//登录异步action
export const login = (user) =>{

    const {username,password} = user
    //做表单的前台验证，如果不通过，返回一个errorMsg的同步action
    if(!username || !password){
        return errorMsg('用户名或密码不能为空')
    }

    return async dispatch =>{
        //发送注册的异步ajax请求
        /* const promise = reqLogin(user)
        promise.then(response=>{
            const result = response.data    //{code:0,data:user}或者{code:1,msg:''}
        }) */
        const response = await reqLogin(user)
        const result = response.data
        if(result.code === 0){  //成功
            getMsgList(dispatch, result.data._id)
            //分发成功的同步action
            dispatch(authSuccess(result.data))
        }else{  //失败
            //分发错误提示信息的同步action
            dispatch(errorMsg(result.msg))
        }
    }
}

//更新用户异步action
export const updateUser = (user) =>{
    return async dispatch =>{
        const response = await reqUpdateUser(user)
        const result = response.data
        if(result.code === 0){//更新成功：data
            dispatch(receiveUser(result.data))
        }else{//更新失败：msg
            dispatch(resetUser(result.msg))
        }
    }
}

//获取用户异步action
export const getUser = () => {
    return async dispatch =>{
        //执行异步请求
        const response = await reqUser()
        const result = response.data
        if(result.code === 0){  //成功
            getMsgList(dispatch, result.data._id)
            dispatch(receiveUser(result.data))
        }else{  //失败
            dispatch(resetUser(result.msg))
        }
    }
}

//获取用户列表的异步action
export const getUserList = (type) => {
    return async dispatch =>{
        //执行异步ajax请求
        const response = await reqUserList(type)
        const result = response.data
        //得到结果后，分发一个同步action
        if(result.code === 0){
            dispatch(receiveUserList(result.data))
        }
    }
}
