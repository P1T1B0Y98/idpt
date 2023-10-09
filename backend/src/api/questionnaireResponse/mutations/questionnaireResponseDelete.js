const permissions = require('../../../security/permissions')
  .values;
const QuestionnaireResponseService = require('../../../services/questionnaireResponseService');
const PermissionChecker = require('../../../services/iam/permissionChecker');

const schema = `
  questionnaireResponseDelete(id: String!): Boolean
`;

const resolver = {
  questionnaireResponseDelete: async (root, args, context) => {
   /*  new PermissionChecker(context).validateHas(
      permissions.casedDestroy,
    ); */

    await new QuestionnaireResponseService(context).delete(
      args.id,
    );

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
