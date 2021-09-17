import {SET_TO_LIST, ADD_LIST, DELETE_LIST, SET_TO_ITEM} from '../constant'

export const setList = data=>({
    type: SET_TO_LIST,
    data
})

export const setItem = (...args)=>({
    type: SET_TO_ITEM,
    data: args
})

export const addList = data=>({
    type: ADD_LIST,
    data
})

export const deleteList = data=>({
    type: DELETE_LIST,
    data
})