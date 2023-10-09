const schema = `
 type Questionnaire {
   id: String!
   resourceType: String!
   status: String!
   title: String!
   type: QuestionnaireTypeEnum!
   item: [QuestionnaireSchema]
   subjectType: String!
   publisher: User
   date: DateTime
   repeats: FrequencyEnum!
 }

 type QuestionnaireSchema {
   linkId: String!
   type: QuestionTypeEnum
   text: String!
   required: Boolean!
   answerOption: [Options]
 }

 type Options{
   value: String!
   label: String!
 }

`;

const resolver = {};

exports.schema = schema;

exports.resolver = resolver;
