import { SET_TO_LIST, SET_TO_ITEM, ADD_LIST, DELETE_LIST } from '../constant';

const defaultList = [
  {
    text: '吃饭',
    isSelect: false
  },
  {
    text: '睡觉',
    isSelect: false
  },
  {
    text: '打豆豆',
    isSelect: false
  },
]
export default function reducer(state = defaultList, action) {
  const {type, data} = action;
  const list = [...state]
  switch (type) {
    case SET_TO_LIST:
      return [
        ...data
      ]
    case SET_TO_ITEM:
      const [index, obj] = data;
      Object.assign(list[index], obj)
      return list;
    case ADD_LIST:
      list.push(data)
      return list
    case DELETE_LIST:
      list.splice(data, 1);
      return list
    default:
      return state
  }
}