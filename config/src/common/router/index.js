import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import Hook from '../../components/hook/hook';
import App from '../../components/app/app';
import User from '../../components/redux/index';
import List from '../../components/router/list';
import Users from '../../components/router/user';

const router = ()=> (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={App}/>
            <Route exact path="/hook" component={Hook}/>
            <Route path="/user" component={User} />
            <Route path="/list" component={List} />
            <Route path="/users/:id" component={Users} />
        </Switch>
    </HashRouter>
)

export default router;