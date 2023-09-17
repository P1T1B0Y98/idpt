const QuestionnaireService = require('../../../services/questionnaireService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  questionnairesFind(id: String!): Questionnaire!
`;

const resolver = {
  questionnairesFind: async (root, args, context) => {
    new PermissionChecker(context).validateHas(
      permissions.casedRead,
    );

    return new QuestionnaireService(context).findById(args.id);
  },
};

exports.schema = schema;
exports.resolver = resolver;
