/* 
    选择用户头像的UI组件
*/
import React, { Component } from 'react'
import {List,Grid} from 'antd-mobile'
import PropTypes from 'prop-types'

export default class HeaderSelector extends Component {

    state = {
        icon:null   //图片对象，默认没有值
    }

    static propTypes = {
        setHeader:PropTypes.func.isRequired
    }

    constructor(props){
        super(props)
        //准备需要的列表数据
        this.headerList = []
        for(let i=0;i<20;i++){
            this.headerList.push({
                text: '头像' + (i+1),
                // 在react中使用require进行导入本地图片时，无法显示图片，仔细检查发现图片的base64编码是在default属性里面,因此在此进行require进行引入图片时，加入default即可
                icon: require(`../../assets//images/头像${i+1}.png`).default   //不能使用import
            })
        }
    }

    handleClick = ({text,icon})=>{
        //更新当前组件状态
        this.setState({
            icon
        })

        //调用组件更新父组件状态
        this.props.setHeader(text)
    }

    render() {
        const {icon} = this.state
        //头部界面
        const ListHeader = !icon? '请选择头像':(
            <div>
                已选择头像：<img src={icon} alt="header"/>
            </div>
        )

        return (
            <List renderHeader={ () => ListHeader }>
                <Grid data={this.headerList} columnNum={5} onClick={this.handleClick}/>
            </List>
        )
    }
}
