import React from 'react';
import User from './user';
import {Provider} from 'react-redux';
import store from '../../redux/store';
class Index extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <User />
            </Provider>
        )
    }
}

export default Index;