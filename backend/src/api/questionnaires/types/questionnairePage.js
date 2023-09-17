const schema = `
  type QuestionnairesPage {
    rows: [Questionnaire!]!
    count: Int!
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
