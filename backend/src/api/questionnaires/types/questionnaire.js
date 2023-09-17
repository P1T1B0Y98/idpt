const schema = `
 type Questionnaire {
   id: String!
   title: String!
   questionnaire_type: QuestionnaireTypeEnum!
   owner: [Task!]
   questionnaireSchema: [QuestionnaireSchema]
   createdAt: DateTime
   createdBy: User
   updatedAt: DateTime
   frequency: FrequencyEnum!
 }

 type QuestionnaireSchema {
   type: QuestionTypeEnum
   placeholder: String
   field: String!
   question: String!
   rules: [RuleType]
   options: [Options]
   questionnaireSchema: [Rules]
 }

 type Options{
   field: String!
   value: String!
   label: String
 }

 type Rules {
   required: Boolean
   message: String!
 }

 type RecurringInfo {
  recurring: Boolean
  frequency: String
}
`;

const resolver = {};

exports.schema = schema;

exports.resolver = resolver;
