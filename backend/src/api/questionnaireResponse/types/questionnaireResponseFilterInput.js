const schema = `
  input QuestionnaireResponseFilterInput {
    title: String
    subject: String
    createdAtRange: [ DateTime ]
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
