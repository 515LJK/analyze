import React from 'react';
import {NavLink} from 'react-router-dom';

function list() {
    return (
    <div className="list">
        <p>用户列表</p>
        <ul>
            {   
                ['小李', '小强', '小张'].map((val, index)=>{
                    return (
                        <li key={index}>
                            <NavLink to={`/users/${index}?id=${index}`} >{val}</NavLink>
                        </li>
                    )
                })
            }
        </ul>
    </div>
    )
}

export default list;