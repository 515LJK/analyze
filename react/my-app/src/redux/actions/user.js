import {SET_USER_ID, SET_USER_NAME, SET_USER_LIKE} from '../constant'

export const setUserName = data=>({
    type: SET_USER_NAME,
    data
})
export const setUserId = data=>({
    type: SET_USER_ID,
    data
})
export const setUserLike = data=>({
    type: SET_USER_LIKE,
    data
})