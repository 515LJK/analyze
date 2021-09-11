import React from 'react';
import {Provider} from 'react-redux'
import store from '../../redux/store'
import User from './user'

export default class Id extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <User />
            </Provider>
        )
    }
}