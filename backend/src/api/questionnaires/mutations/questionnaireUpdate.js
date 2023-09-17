const QuestionnaireService = require('../../../services/questionnaireService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  questionnaireUpdate(id: String!, data: QuestionnaireInput!): Questionnaire!
`;

const resolver = {
  questionnaireUpdate: async (root, args, context) => {
    new PermissionChecker(context).validateHas(
      permissions.casedEdit,
    );

    return new QuestionnaireService(context).update(
      args.id,
      args.data,
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
