const permissions = require('../../../security/permissions')
  .values;
const AssessmentService = require('../../../services/assessmentService');
const PermissionChecker = require('../../../services/iam/permissionChecker');

const schema = `
  assessmentsDestroy(ids: [String!]!): Boolean
`;

const resolver = {
  assessmentsDestroy: async (root, args, context) => {
    new PermissionChecker(context).validateHas(
      permissions.casedDestroy,
    );

    await new AssessmentService(context).destroyAll(
      args.ids,
    );

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
