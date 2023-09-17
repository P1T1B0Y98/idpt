import list from 'modules/questionnaires/list/questionnairesListReducers';
import form from 'modules/questionnaires/form/questionnairesFormReducers';
import destroy from 'modules/questionnaires/destroy/questionnairesDestroyReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
  // view,
  destroy,
  // importer: importerReducer,
});
