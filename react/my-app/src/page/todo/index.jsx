import React, { useState } from 'react'
import css from './index.module.scss';
import { Input } from 'antd';
import List from './list/list.jsx';
import {connect} from 'react-redux'
import {addList} from 'r-redux/actions/list';

const Index = (props) => {
  const [inputText, setInputText] = useState('')
  const {addList} = props;
  function inputChange(e) {
    const value = e.target.value;
    setInputText(()=>value);
  }

  function sureInput() {
    const obj = {
      text: inputText,
      isSelect: false
    }
    addList(obj)
    setInputText(value=>'')
  }

  return (
    <div className={css.todo}>
      <div className={css.wrapper}>
        <Input value={inputText} onChange={inputChange} onPressEnter={sureInput} placeholder="请输入你要做的事情，按下回车确定" />
        <List></List>
      </div>
    </div>
  )
}

export default connect(()=>({}), {addList})(Index)
