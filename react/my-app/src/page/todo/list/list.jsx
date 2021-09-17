import React from 'react'
import {connect} from 'react-redux'
import {deleteList, setList, setItem} from 'r-redux/actions/list';
import { List as AntdList, Button, Checkbox } from 'antd';
import {CloseCircleOutlined} from '@ant-design/icons'
import css from './list.module.scss';
const List = (props) => {
  const {list, deleteList, setList, setItem} = props;
  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkAll, setCheckAll] = React.useState(false);
  const [finishNum, setFinishNum] = React.useState(0);

  function onCheckAllChange(e) {
    setList(list=>{
      return list.map(val=>({
        ...val,
        isSelect: e.target.checked
      }))
    });
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    setFinishNum(e.target.checked ? list.length : 0)
  }

  function selectItem(index, e) {
    const item = list[index]
    setItem(index, {
      ...item,
      isSelect: e.target.checked
    })
    const selectList = list.filter(val=>val.isSelect);
    setIndeterminate(!!selectList.length && selectList.length < list.length);
    setCheckAll(selectList.length === list.length);
    setFinishNum(selectList.length)
  }

  function clearFinish() {
    setIndeterminate(false)
    setCheckAll(false)
    setFinishNum(0)
    setList(list.filter(val=>!val.isSelect))
  }

  return (
    <div className={css.list}>
      <AntdList dataSource={list} renderItem={
        (item, index)=> (
          <AntdList.Item className={css.item}>
            <Checkbox checked={item.isSelect} onChange={selectItem.bind(this, index)}>{item.text}</Checkbox>
            <CloseCircleOutlined onClick={
              ()=>{
                deleteList(index)
              }
            } className={css.icon} />
          </AntdList.Item>
        )
      }></AntdList>
      <div className={css.statistical}>
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>已完成 {finishNum} / 任务总数 {list.length}</Checkbox>
        {finishNum > 0 ? <Button type="primary" danger onClick={clearFinish}>清除已完成任务</Button> : null}
      </div>
    </div>
  )
}

export default connect(state=>({
  list: state.list
}), {deleteList, setList, setItem})(List)
