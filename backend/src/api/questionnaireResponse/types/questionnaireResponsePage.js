const schema = `
  type questionnaireResponsePage {
    rows: [QuestionnaireResponse!]!
    count: Int!
  }
`

const resolver = {}

exports.schema = schema
exports.resolver = resolver
