import { combineReducers } from 'redux'
import todos from './todos'
import token from './token';

const rootReducer = combineReducers({
    todos,
    token,
});
export default rootReducer;