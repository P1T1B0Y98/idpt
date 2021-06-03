import actions from 'modules/cased/graph/casedGraphActions';


const initialData = {
  rows: [],
  count: 0,
  loading: false,
  record: null,
};

export default (state = initialData, { type, payload }) => {

  if (type === actions.SELECT_RECORD) {
    return {
      ...state,
      record: payload,
    };
  }


  if (type === actions.FETCH_STARTED) {
    return {
      ...state,
      loading: true,
      record: null,
    };
  }

  if (type === actions.FETCH_SUCCESS) {
    return {
      ...state,
      loading: false,
      rows: payload.rows,
      record: null,
      count: payload.count,
    };
  }

  if (type === actions.FETCH_ERROR) {
    return {
      ...state,
      loading: false,
      rows: [],
      record: null,
      count: 0,
    };
  }

  return state;
};
