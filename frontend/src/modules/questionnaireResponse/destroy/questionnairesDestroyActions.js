import { i18n } from 'i18n';
import Message from 'view/shared/message';
import { getHistory } from 'modules/store';
import Errors from 'modules/shared/error/errors';
import QuestionnairesService from 'modules/questionnaires/questionnairesService';
import listActions from 'modules/questionnaires/list/questionnairesListActions';

const prefix = 'QUESTIONNAIRES_DESTROY';

const actions = {
  DESTROY_STARTED: `${prefix}_DESTROY_STARTED`,
  DESTROY_SUCCESS: `${prefix}_DESTROY_SUCCESS`,
  DESTROY_ERROR: `${prefix}_DESTROY_ERROR`,

  DESTROY_ALL_STARTED: `${prefix}_DESTROY_ALL_STARTED`,
  DESTROY_ALL_SUCCESS: `${prefix}_DESTROY_ALL_SUCCESS`,
  DESTROY_ALL_ERROR: `${prefix}_DESTROY_ALL_ERROR`,

  doDestroy: (id) => async (dispatch) => {
    try {
      dispatch({
        type: actions.DESTROY_STARTED,
      });

      await QuestionnairesService.destroyAll([id]);

      dispatch({
        type: actions.DESTROY_SUCCESS,
      });

      Message.success(
        i18n('entities.questionnaires.destroy.success'),
      );

      getHistory().push('/questionnaires');
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: actions.DESTROY_ERROR,
      });
    }
  },

  doDestroyAll: (ids) => async (dispatch) => {
    try {
      dispatch({
        type: actions.DESTROY_ALL_STARTED,
      });

      await QuestionnairesService.destroyAll(ids);

      dispatch({
        type: actions.DESTROY_ALL_SUCCESS,
      });

      if (listActions) {
        dispatch(listActions.doChangeSelected([]));
      }

      Message.success(
        i18n('entities.questionnaires.destroyAll.success'),
      );

      getHistory().push('/questionnaires');
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: actions.DESTROY_ALL_ERROR,
      });
    }
  },
};

export default actions;
