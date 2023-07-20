const schema = `
  type AssessmentsPage {
    rows: [Assessment!]!
    count: Int!
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
