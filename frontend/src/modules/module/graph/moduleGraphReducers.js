import actions from 'modules/module/graph/moduleGraphActions';


const initialData = {
  rows: [],
  count: 0,
  loading: false,
  filter: {},
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
      filter: payload ? payload.filter : {},
    };
  }

  if (type === actions.FETCH_SUCCESS) {
    return {
      ...state,
      loading: false,
      rows: payload.rows,
      record: payload.rows[0],
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
