import { i18n } from 'i18n'
import IdField from 'modules/shared/fields/idField'
import StringField from 'modules/shared/fields/stringField'
import DateTimeField from 'modules/shared/fields/dateTimeField'

function label (name) {
  return i18n(`entities.questionnaireResponse.fields.${name}`)
}

const fields = {
  id: new IdField('id', label('id')),
  title: new StringField('title', label('title')),
  item: new StringField('item', label('item')),
  subject: new StringField('subject', label('subject')),
  createdAt: new DateTimeField('createdAt', label('createdAt'))
}

export default { fields }