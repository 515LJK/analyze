import {SET_USER_ID, SET_USER_LIKE, SET_USER_NAME} from '../constant';

export const setUserName = data => ({type: SET_USER_NAME, data});
export const setUserLike = data => ({type: SET_USER_LIKE, data});
export const setUserId = data => ({type: SET_USER_ID, data});