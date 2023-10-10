const schema = `
 type QuestionnaireResponse {
   id: String!
   questionnaire: Questionnaire!
   item: JSON
   createdAt: DateTime
   subject: User
   meta: JSON
 }
`

const resolver = {}

exports.schema = schema

exports.resolver = resolver
