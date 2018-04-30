import { combineReducers } from 'redux';
import * as childReducers from './items';

export default combineReducers(childReducers);
