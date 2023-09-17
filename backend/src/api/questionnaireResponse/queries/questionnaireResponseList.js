const questionnaireResponseService = require(
  '../../../services/questionnaireResponseService'
)
const PermissionChecker = require('../../../services/iam/permissionChecker')
const permissions = require('../../../security/permissions').values
const graphqlSelectRequestedAttributes = require(
  '../../shared/utils/graphqlSelectRequestedAttributes'
)

const schema = `
  questionnaireResponseList(limit: Int, offset: Int, orderBy: QuestionnairesOrderByEnum): questionnaireResponsePage!
`

const resolver = {
  questionnaireResponseList: async (root, args, context, info) => {
    //new PermissionChecker(context).validateHas(permissions.casedRead)

    return new questionnaireResponseService(
      context
    ).findAndCountAll({ ...args, requestedAttributes: graphqlSelectRequestedAttributes(info, 'rows') })
  }
}

exports.schema = schema
exports.resolver = resolver
