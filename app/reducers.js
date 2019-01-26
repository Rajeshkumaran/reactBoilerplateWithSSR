/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { ROUTER_STORE_KEY } from 'utils/constants';

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers = {}, history = {}) {
  return combineReducers({
    [ROUTER_STORE_KEY]: connectRouter(history),
    ...injectedReducers,
  });
}
