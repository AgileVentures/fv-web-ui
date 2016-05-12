import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';
import DocumentOperations from 'operations/DocumentOperations';

const DISMISS_ERROR = 'DISMISS_ERROR';

/**
* Multiple Dialect Actions
*/
const FV_DIALECTS_FETCH_START = "FV_DIALECTS_FETCH_START";
const FV_DIALECTS_FETCH_SUCCESS = "FV_DIALECTS_FETCH_SUCCESS";
const FV_DIALECTS_FETCH_ERROR = "FV_DIALECTS_FETCH_ERROR";

const FV_DIALECTS_UPDATE_START = "FV_DIALECTS_UPDATE_START";
const FV_DIALECTS_UPDATE_SUCCESS = "FV_DIALECTS_UPDATE_SUCCESS";
const FV_DIALECTS_UPDATE_ERROR = "FV_DIALECTS_UPDATE_ERROR";

const FV_DIALECTS_CREATE_START = "FV_DIALECTS_CREATE_START";
const FV_DIALECTS_CREATE_SUCCESS = "FV_DIALECTS_CREATE_SUCCESS";
const FV_DIALECTS_CREATE_ERROR = "FV_DIALECTS_CREATE_ERROR";

const FV_DIALECTS_DELETE_START = "FV_DIALECTS_DELETE_START";
const FV_DIALECTS_DELETE_SUCCESS = "FV_DIALECTS_DELETE_SUCCESS";
const FV_DIALECTS_DELETE_ERROR = "FV_DIALECTS_DELETE_ERROR";

/**
* Single Dialect Actions
*/

const FV_DIALECT_FETCH_START = "FV_DIALECT_FETCH_START";
const FV_DIALECT_FETCH_SUCCESS = "FV_DIALECT_FETCH_SUCCESS";
const FV_DIALECT_FETCH_ERROR = "FV_DIALECT_FETCH_ERROR";

const FV_DIALECT_FETCH_STATS_START = "FV_DIALECT_FETCH_STATS_START";
const FV_DIALECT_FETCH_STATS_SUCCESS = "FV_DIALECT_FETCH_STATS_SUCCESS";
const FV_DIALECT_FETCH_STATS_ERROR = "FV_DIALECT_FETCH_STATS_ERROR";

const FV_DIALECT_FETCH_ALL_START = "FV_DIALECT_FETCH_ALL_START";
const FV_DIALECT_FETCH_ALL_SUCCESS = "FV_DIALECT_FETCH_ALL_SUCCESS";
const FV_DIALECT_FETCH_ALL_ERROR = "FV_DIALECT_FETCH_ALL_ERROR";

const FV_DIALECT_UPDATE_START = "FV_DIALECT_UPDATE_START";
const FV_DIALECT_UPDATE_SUCCESS = "FV_DIALECT_UPDATE_SUCCESS";
const FV_DIALECT_UPDATE_ERROR = "FV_DIALECT_UPDATE_ERROR";

const FV_DIALECT_CREATE_START = "FV_DIALECT_CREATE_START";
const FV_DIALECT_CREATE_SUCCESS = "FV_DIALECT_CREATE_SUCCESS";
const FV_DIALECT_CREATE_ERROR = "FV_DIALECT_CREATE_ERROR";

const FV_DIALECT_DELETE_START = "FV_DIALECT_DELETE_START";
const FV_DIALECT_DELETE_SUCCESS = "FV_DIALECT_DELETE_SUCCESS";
const FV_DIALECT_DELETE_ERROR = "FV_DIALECT_DELETE_ERROR";

const FV_DIALECT_PUBLISH_START = "FV_DIALECT_PUBLISH_START";
const FV_DIALECT_PUBLISH_SUCCESS = "FV_DIALECT_PUBLISH_SUCCESS";
const FV_DIALECT_PUBLISH_ERROR = "FV_DIALECT_PUBLISH_ERROR";

const FV_DIALECT_UNPUBLISH_START = "FV_DIALECT_UNPUBLISH_START";
const FV_DIALECT_UNPUBLISH_SUCCESS = "FV_DIALECT_UNPUBLISH_SUCCESS";
const FV_DIALECT_UNPUBLISH_ERROR = "FV_DIALECT_UNPUBLISH_ERROR";

const fetchDialectsInPath = function fetchDialectsInPath(path, type) {
  return function (dispatch) {

    dispatch( { type: FV_DIALECTS_FETCH_START } );

    return DirectoryOperations.getDocumentByPath2(path, 'FVDialect')
    .then((response) => {
      dispatch( { type: FV_DIALECTS_FETCH_SUCCESS, documents: response } )
    }).catch((error) => {
        dispatch( { type: FV_DIALECTS_FETCH_ERROR, error: error } )
    });
  }
};

/*cosnt fetchDialectAndStats = function fetchDialectWithStats(path) {
	  return dispatch => Promise.all([
	    dispatch(fetchDialect(path)),
        dispatch(fetchDialectStats())
      ]);
}*/

const fetchDialect = function fetchDialect(pathOrId) {
  return function (dispatch) {

    dispatch( { type: FV_DIALECT_FETCH_START } );

    return DocumentOperations.getDocument(pathOrId, 'FVDialect', { headers: { 'X-NXenrichers.document': 'ancestry,dialect,permissions' } })
    .then((response) => {
      dispatch( { type: FV_DIALECT_FETCH_SUCCESS, document: response } )
    }).catch((error) => {
        dispatch( { type: FV_DIALECT_FETCH_ERROR, error: error } )
    });

  }
};

const fetchDialectStats = function fetchDialectStats(dialectPath, docTypes) {
  return function (dispatch) {

  dispatch( { type: FV_DIALECT_FETCH_STATS_START } );

  return DocumentOperations.getDialectStats(dialectPath, docTypes)
	.then((response) => {
	  dispatch( { type: FV_DIALECT_FETCH_STATS_SUCCESS, document: response } )
	  }).catch((error) => {
	        dispatch( { type: FV_DIALECT_FETCH_STATS_ERROR, error: error } )
	  });
	}
};

const publishDialect = function publishDialect(pathOrId) {
  return function (dispatch) {

    dispatch( { type: FV_DIALECT_PUBLISH_START } );

    return DocumentOperations.publishDialect(pathOrId)
    .then((response) => {
      dispatch( { type: FV_DIALECT_PUBLISH_SUCCESS, document: response } )
    }).catch((error) => {
        dispatch( { type: FV_DIALECT_PUBLISH_ERROR, error: error } )
    });

  }
};

const unpublishDialect = function unpublishDialect(pathOrId) {
  return function (dispatch) {

    dispatch( { type: FV_DIALECT_UNPUBLISH_START } );

    return DocumentOperations.unpublishDialect(pathOrId)
    .then((response) => {
      dispatch( { type: FV_DIALECT_UNPUBLISH_SUCCESS, document: response } )
    }).catch((error) => {
        dispatch( { type: FV_DIALECT_UNPUBLISH_ERROR, error: error } )
    });

  }
};

const updateDialect2 = RESTActions.update('FV_DIALECT2', 'FVDialect', {});
const fetchDialect2 = RESTActions.fetch('FV_DIALECT2', 'FVDialect', { headers: { 'X-NXenrichers.document': 'ancestry,dialect,permissions' } });
const fetchDialects = RESTActions.query('FV_DIALECTS', 'FVDialect', { headers: { 'X-NXenrichers.document': 'ancestry' } });

const actions = { fetchDialectsInPath, fetchDialect, updateDialect2, fetchDialect2, publishDialect, unpublishDialect, fetchDialects, fetchDialectStats };

const computeDialectQuery = RESTReducers.computeQuery('dialects');
const computeDialectFetch = RESTReducers.computeFetch('dialect2');

const reducers = {
  computeDialectsInPath(state = { isFetching: false, response: { get: function() { return ''; } }, success: false }, action) {
    switch (action.type) {
      case FV_DIALECTS_FETCH_START:
        return Object.assign({}, state, { isFetching: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_DIALECTS_FETCH_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_DIALECTS_FETCH_ERROR:
      case DISMISS_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
  computeDialect(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {
    switch (action.type) {
      case FV_DIALECT_FETCH_START:
      case FV_DIALECT_UPDATE_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      // Send modified document to UI without access REST end-point
      case FV_DIALECT_FETCH_SUCCESS:
      case FV_DIALECT_UPDATE_SUCCESS:
        return Object.assign({}, { response: action.document, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_DIALECT_FETCH_ERROR:
      case FV_DIALECT_UPDATE_ERROR:
      case DISMISS_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
  computeDialects: computeDialectQuery.computeDialects,
  computeDialect2: computeDialectFetch.computeDialect2,
  computeDialectStats(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {
    switch (action.type) {
      case FV_DIALECT_FETCH_STATS_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      case FV_DIALECT_FETCH_STATS_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true });
      break;

      case FV_DIALECT_FETCH_STATS_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error});
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
  computeDialectPublish(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {
    switch (action.type) {
      case FV_DIALECT_PUBLISH_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      case FV_DIALECT_PUBLISH_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true });
      break;

      case FV_DIALECT_PUBLISH_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
  computeDialectUnpublish(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {
    switch (action.type) {
      case FV_DIALECT_UNPUBLISH_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      case FV_DIALECT_UNPUBLISH_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true });
      break;

      case FV_DIALECT_UNPUBLISH_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  }
};

const middleware = [thunk];

export default { actions, reducers, middleware };