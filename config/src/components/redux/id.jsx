import React from 'react';
import {connect} from 'react-redux';

class Id extends React.Component {
    render() {
        return (<span>{this.props.id}</span>)
    }
}

export default connect(state=>({
    id: state.user.id
}))(Id)