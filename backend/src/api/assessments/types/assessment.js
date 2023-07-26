const schema = `
 type Assessment {
   id: String!
   title: String!
   assessment_type: AssessmentTypeEnum!
   owner: [Task!]
   assessmentSchema: [AssessmentSchema]
   createdAt: DateTime
   createdBy: User
   updatedAt: DateTime
   frequency: FrequencyEnum!
 }

 type AssessmentSchema {
   type: QuestionTypeEnum
   placeholder: String
   field: String!
   question: String!
   rules: [RuleType]
   options: [Options]
   assessmentSchema: [Rules]
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
