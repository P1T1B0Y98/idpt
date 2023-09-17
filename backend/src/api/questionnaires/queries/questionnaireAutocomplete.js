const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;
const QuestionnaireService = require('../../../services/questionnaireService');

const schema = `
  questionnaireAutocomplete(query: String, limit: Int): [AutocompleteOption!]!
`;

const resolver = {
  questionnaireAutocomplete: async (
    root,
    args,
    context,
    info,
  ) => {
    new PermissionChecker(context).validateHas(
      permissions.casedAutocomplete,
    );

    return new QuestionnaireService(
      context,
    ).findAllAutocomplete(args.query, args.limit);
  },
};

exports.schema = schema;
exports.resolver = resolver;
