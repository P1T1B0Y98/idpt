const QuestionnaireService = require('../../../services/questionnaireService')
const PermissionChecker = require('../../../services/iam/permissionChecker')
const permissions = require('../../../security/permissions').values

const schema = `
  questionnaireCreate(data: QuestionnaireInput!): Questionnaire!
`

const resolver = {
  questionnaireCreate: async (root, args, context) => {
    new PermissionChecker(context).validateHas(permissions.casedCreate)
    return new QuestionnaireService(context).create(args.data)
  }
}
exports.schema = schema
exports.resolver = resolver
