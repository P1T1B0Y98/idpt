const AssessmentService = require('../../../services/assessmentService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  assessmentsFind(id: String!): Assessment!
`;

const resolver = {
  assessmentsFind: async (root, args, context) => {
    new PermissionChecker(context).validateHas(
      permissions.casedRead,
    );

    return new AssessmentService(context).findById(args.id);
  },
};

exports.schema = schema;
exports.resolver = resolver;
