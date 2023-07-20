const AssessmentService = require('../../../services/assessmentService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  assessmentUpdate(id: String!, data: AssessmentInput!): Assessment!
`;

const resolver = {
  assessmentUpdate: async (root, args, context) => {
    new PermissionChecker(context).validateHas(
      permissions.casedEdit,
    );

    return new AssessmentService(context).update(
      args.id,
      args.data,
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
