import React from 'react';
import {NavLink} from 'react-router-dom';
import qs from 'querystring'

const details = ['你好，我是小李', '你好，我是小强', '你好，我是小张']
function users(props) {
    // const {id} = props.match.params;
    const {search} = props.location;
    const {id} = qs.parse(search.slice(1))

    const detail = details[id] || '';
    return (
        <p>{detail}</p>
    )
}

export default users;