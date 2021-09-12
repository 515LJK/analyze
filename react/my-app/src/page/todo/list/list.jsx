import React from 'react'
// import { Input } from 'antd';
import { List as AntdList } from 'antd';
import css from './list.module.scss';
const List = (props) => {
  const {list} = props;
  return (
    <div className={css.list}>
      <AntdList dataSource={list} renderItem={
        item=> (
          <AntdList.Item>
            {item.text}
          </AntdList.Item>
        )
      }></AntdList>
    </div>
  )
}

export default List
