import { i18n } from 'i18n';
import StringField from 'modules/shared/fields/stringField';
import IdField from 'modules/shared/fields/idField';
import DateTimeField from 'modules/shared/fields/dateTimeField';

function label(name) {
  return i18n(`entities.questionnaires.fields.${name}`);
}

const fields = {
  id: new IdField('id', label('id')),
  title: new StringField('title', label('title'), {
    required: true,
  }),
  description: new StringField('description', label('description'), {
    required: true,
  }),
  date: new DateTimeField(
    'date',
    label('date'),
  ),
  updatedAt: new DateTimeField(
    'updatedAt',
    label('updatedAt'),
  ),
};

export default {
  fields,
};
