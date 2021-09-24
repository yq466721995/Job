/* 
    入口js
*/
import React from 'react'
import ReactDOM from 'react-dom'
import 'lib-flexible'
import {Provider} from 'react-redux'
/* import { Button } from 'antd-mobile' */
import {HashRouter} from 'react-router-dom'
import App from './App'
import store from './redux/store'

import initReactFastclick from 'react-fastclick';
initReactFastclick();

// import './test/socketio_test'

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <App/>
        </HashRouter>
    </Provider>
    ,document.getElementById('root')
)