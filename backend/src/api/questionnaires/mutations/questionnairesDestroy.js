const permissions = require('../../../security/permissions')
  .values;
const QuestionnaireService = require('../../../services/questionnaireService');
const PermissionChecker = require('../../../services/iam/permissionChecker');

const schema = `
  questionnairesDestroy(ids: [String!]!): Boolean
`;

const resolver = {
  questionnairesDestroy: async (root, args, context) => {
    
    new PermissionChecker(context).validateHas(
      permissions.casedDestroy,
    );

    await new QuestionnaireService(context).destroyAll(
      args.ids,
    );

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
