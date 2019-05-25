import * as actionTypes from '../actions/types';
import { combineReducers } from 'redux';

//User reducer
const initialUSerState = {
    currentUser: null,
    isLoading: true
};

const user_reducer = (state =initialUSerState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                currentUser: action.payload.currentUser,
                isLoading:false
            }
        case actionTypes.CLEAR_USER:
            return {
                ...initialUSerState,
                isLoading:false
            }
        default:
            return state;
    }
}

//Channel Reducer
const inintialChannelState = {
    currentChannel: null,
    isPrivateChannel: false,
userPosts: null};

const channel_reducer = (state = inintialChannelState, action) => {
    switch (action.type) {
        case actionTypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: action.payload.currentChannel
            }
        case actionTypes.SET_PRIVATE_CHANNEL:
            return {
                ...state,
                isPrivateChannel: action.payload.isPrivateChannel
            }
        case actionTypes.SET_USER_POSTS:
            return {
                ...state,
                userPosts: action.payload.userPosts
            }
        default:
            return state;
    }
}
const rootReducer = combineReducers({
    user: user_reducer,
    channel: channel_reducer
})
export default rootReducer