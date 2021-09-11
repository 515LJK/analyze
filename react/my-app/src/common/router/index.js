import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import App from 'r-page/app';

const router = ()=> (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={App}/>
        </Switch>
    </HashRouter>
)

export default router;