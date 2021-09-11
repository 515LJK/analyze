import React from 'react';
import {connect} from 'react-redux';

class Name extends React.Component {
    render() {
        return (<span>{this.props.name}</span>)
    }
}

export default connect(state=>({
    name: state.user.name
}))(Name)