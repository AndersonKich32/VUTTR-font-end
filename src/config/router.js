import {BrowserRouter, Switch, Route} from 'react-router-dom'
import React from 'react'
import Home from '../pages/home'

export default function Routes(props){
    return(
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Home}/>
            </Switch>
        </BrowserRouter>
    )
}