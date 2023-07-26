import model from 'modules/assessments/assessmentsModel';

const { fields } = model;

export default [
  fields.id,
  fields.title,
  fields.createdAt,
  fields.updatedAt,
];
