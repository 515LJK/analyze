import React from 'react';
import {connect} from 'react-redux';

class Like extends React.Component {
    render() {
        return (<span>{this.props.like}</span>)
    }
}

export default connect(state=>({
    like: state.user.like
}))(Like)