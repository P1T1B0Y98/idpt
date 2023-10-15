const schema = `
 type QuestionnaireResponse {
   id: String!
   questionnaire: Questionnaire!
   item: JSON
   authored: String
   subject: User
   meta: JSON
 }
`

const resolver = {}

exports.schema = schema

exports.resolver = resolver
