const schema = `
  input QuestionnaireInput {
    title: String!
    questionnaire_type: QuestionnaireTypeEnum!
    questionnaireSchema: [QuestionnaireSchemaInput]
    frequency: FrequencyEnum!  
  }

  input QuestionnaireSchemaInput {
    type: QuestionTypeEnum
    placeholder: String
    field: String!
    question: String!
    rules: [RulesInput]
    options: [OptionsInput]
    questionnaireSchema: [RulesInput]
  }

  input RulesInput {
    required: Boolean!
    message: String!
  }

  input OptionsInput {
    field: String!
    value: String!
    label: String
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
