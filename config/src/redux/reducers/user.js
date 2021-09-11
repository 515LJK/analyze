import {SET_USER_ID, SET_USER_NAME, SET_USER_LIKE} from '../constant'
const user = {
    name: '',
    id: '',
    like: ''
}

export default function reducer(state = user, action) {
    const {type, data} = action;
    switch(type) {
        case SET_USER_ID:
            return {
                ...state,
                id: data
            };
        case SET_USER_NAME:
            return {
                ...state,
                name: data
            };
        case SET_USER_LIKE:
            return {
                ...state,
                like: data
            };
        default: 
            return state
    }
}