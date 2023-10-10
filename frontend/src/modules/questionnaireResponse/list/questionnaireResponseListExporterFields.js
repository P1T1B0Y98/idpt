import model from 'modules/questionnaireResponse/questionnaireResponseModel';

const { fields } = model;

export default [
  fields.id,
  fields.title,
  fields.subject,
  fields.item,
  fields.createdAt, 
];
