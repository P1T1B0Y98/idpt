const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;
const AssessmentService = require('../../../services/assessmentService');

const schema = `
  assessmentsAutocomplete(query: String, limit: Int): [AutocompleteOption!]!
`;

const resolver = {
  assessmentsAutocomplete: async (
    root,
    args,
    context,
    info,
  ) => {
    new PermissionChecker(context).validateHas(
      permissions.casedAutocomplete,
    );

    return new AssessmentService(
      context,
    ).findAllAutocomplete(args.query, args.limit);
  },
};

exports.schema = schema;
exports.resolver = resolver;
