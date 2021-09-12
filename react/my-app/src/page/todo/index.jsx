import React, { useState } from 'react'
import css from './index.module.scss';
import { Input } from 'antd';
import List from './list/list.jsx';

const Index = () => {
  const [list, setList] = useState([]);

  function sureInput(e) {
    const value = e.target.value;
    setList(list=>{
      const obj = {
        text: value,
        isSelect: false
      }
      return [
        ...list,
        obj
      ]
    })
  }

  return (
    <div className={css.todo}>
      <div className={css.wrapper}>
        <Input onPressEnter={sureInput} placeholder="请输入你要做的事情，按下回车确定" />
        <List list={list}></List>
      </div>
    </div>
  )
}

export default Index
