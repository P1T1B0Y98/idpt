const AssessmentService = require('../../../services/assessmentService')
const PermissionChecker = require('../../../services/iam/permissionChecker')
const permissions = require('../../../security/permissions').values

const schema = `
  assessmentCreate(data: AssessmentInput!): Assessment!
`

const resolver = {
  assessmentCreate: async (root, args, context) => {
    console.log(args.data, 'it should come here.')

    return new AssessmentService(context).create(args.data)
  }
}
exports.schema = schema
exports.resolver = resolver
