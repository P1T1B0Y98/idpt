const schema = `
  input WearableDataFilterInput {
    id: String
    type: String
    frequency: String
    timestamp: String
    patient: String
    createdAtRange: [ DateTime ]
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;