const schema = `
  input QuestionnaireInput {
    title: String!
    description: String!
    type: QuestionnaireTypeEnum!
    item: [QuestionnaireSchemaInput]
    repeats: FrequencyEnum!  
  }

  input QuestionnaireSchemaInput {
    linkId: String!
    type: QuestionTypeEnum
    text: String!
    required: Boolean!
    rules: [RulesInput]
    answerOption: [OptionsInput]
  }

  input RulesInput {
    required: Boolean!
    message: String!
  }

  input OptionsInput {
    value: String!
    label: String!
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
