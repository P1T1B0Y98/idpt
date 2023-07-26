import list from 'modules/assessments/list/assessmentsListReducers';
import form from 'modules/assessments/form/assessmentsFormReducers';
import destroy from 'modules/assessments/destroy/assessmentsDestroyReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
  // view,
  destroy,
  // importer: importerReducer,
});
