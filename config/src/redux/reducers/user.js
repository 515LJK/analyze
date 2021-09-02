import {SET_USER_ID, SET_USER_NAME, SET_USER_LIKE} from '../constant';
const user = {
    name: '',
    id: '',
    like: ''
}
export default function userReducer(preState = user, action) {
    const {type, data} = action;
    switch (type) {
        case SET_USER_ID:
            return {
                ...preState,
                id: data
            }
        case SET_USER_NAME:
            return {
                ...preState,
                name: data
            }
        case SET_USER_LIKE:
            return {
                ...preState,
                like: data
            }
            break;
        default:
            return preState
    }
}