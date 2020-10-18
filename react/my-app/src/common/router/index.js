import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import Hook from '../../components/hook/hook';
import App from '../../components/app/app';

const router = ()=> (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={App}/ >
            <Route exact path="/hook" component={Hook}/ >
        </Switch>
    </HashRouter>
)

export default router;