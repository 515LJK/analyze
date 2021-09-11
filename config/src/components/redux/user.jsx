import React from 'react';
import Name from './name';
import Like from './like';
import Id from './id';
import {connect} from 'react-redux';
import {setUserName, setUserId, setUserLike} from '../../redux/actions/user';
class User extends React.Component {
    setName = (event)=> {
        const value = event.target.value;
        this.props.setUserName(value)
    }
    setId = (event)=> {
        const value = event.target.value;
        this.props.setUserId(value)
    }
    setLike = (event)=> {
        const value = event.target.value;
        this.props.setUserLike(value)
    }

    render() {
        return (
        <div className="content">
            <div className="set">
                <input type="text" onChange={this.setName} placeholder="输入用户姓名" />
                <br></br>
                <input type="text" onChange={this.setId} placeholder="输入用户id" />
                <br></br>
                <input type="text" onChange={this.setLike} placeholder="输入用户爱好" />
            </div>
            <div className="show">
                <p>用户名字: <Name /></p>
                <p>用户爱好: <Like /></p>
                <p>用户Id: <Id /></p>
            </div>
        </div>)
    }
}

export default connect(()=>({}), {setUserName, setUserId, setUserLike})(User)