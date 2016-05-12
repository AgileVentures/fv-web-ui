// Middleware
import thunk from 'redux-thunk';

import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

const updatePortal = RESTActions.update('FV_PORTAL', 'FVPortal', {});
const fetchPortal = RESTActions.fetch('FV_PORTAL', 'FVPortal', { headers: { 'X-NXenrichers.document': 'ancestry,portal' } });

const actions = { fetchPortal, updatePortal };

const computePortalFactory = RESTReducers.computeFetch('portal');

const reducers = {
  computePortal: computePortalFactory.computePortal
};

const middleware = [thunk];

export default { actions, reducers, middleware };