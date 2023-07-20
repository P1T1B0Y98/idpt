const AssessmentsService = require('../../../services/assessmentService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;
const graphqlSelectRequestedAttributes = require('../../shared/utils/graphqlSelectRequestedAttributes');

const schema = `
  assessmentsList(filter: AssessmentsFilterInput, limit: Int, offset: Int, orderBy: AssessmentsOrderByEnum): AssessmentsPage!
`;

const resolver = {
  assessmentsList: async (root, args, context, info) => {
    new PermissionChecker(context).validateHas(
      permissions.casedRead,
    );

    return new AssessmentsService(context).findAndCountAll({
      ...args,
      requestedAttributes: graphqlSelectRequestedAttributes(
        info,
        'rows',
      ),
    });
  },
};

exports.schema = schema;
exports.resolver = resolver;
