import React, { Component } from 'react'
import {Route,Switch} from 'react-router-dom'
import Register from './containers/register'
import Main from './containers/main'
import Login from './containers/login'

import './assets/css/index.less'

export default class App extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path='/register' component={Register}/>
                    <Route path='/login' component={Login}/>
                    <Route component={Main}/>
                </Switch>
            </div>
        )
    }
}
