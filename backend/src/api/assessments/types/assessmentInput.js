const schema = `
  input AssessmentInput {
    title: String!
    assessment_type: AssessmentTypeEnum!
    assessmentSchema: [AssessmentSchemaInput]
    frequency: FrequencyEnum!  
  }

  input AssessmentSchemaInput {
    type: QuestionTypeEnum
    placeholder: String
    field: String!
    question: String!
    rules: [RulesInput]
    options: [OptionsInput]
    assessmentSchema: [RulesInput]
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
