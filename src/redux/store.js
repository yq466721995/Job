/* 
    redux最核心的管理对象模块
*/
import {applyMiddleware, createStore} from 'redux'
import reducer from './reducers'
import thunk from 'redux-thunk'

import {composeWithDevTools} from 'redux-devtools-extension'
//向外暴露store
export default createStore(reducer,composeWithDevTools(applyMiddleware(thunk)))