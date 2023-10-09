const permissions = require('../../../security/permissions')
  .values;
const QuestionnaireResponseService = require('../../../services/questionnaireResponseService');
const PermissionChecker = require('../../../services/iam/permissionChecker');

const schema = `
  questionnaireResponseDeleteAll(userId: String!): Boolean
`;

const resolver = {
  questionnaireResponseDeleteAll: async (root, args, context) => {
   /*  new PermissionChecker(context).validateHas(
      permissions.casedDestroy,
    ); */

    await new QuestionnaireResponseService(context).deleteByUserId(
      args.userId,
    );

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
