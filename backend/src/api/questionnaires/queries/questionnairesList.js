const QuestionnairesService = require('../../../services/questionnaireService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;
const graphqlSelectRequestedAttributes = require('../../shared/utils/graphqlSelectRequestedAttributes');

const schema = `
questionnairesList(filter: QuestionnairesFilterInput, limit: Int, offset: Int, orderBy: QuestionnairesOrderByEnum): QuestionnairesPage!
`;

const resolver = {
  questionnairesList: async (root, args, context, info) => {
  

    return new QuestionnairesService(context).findAndCountAll({
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
