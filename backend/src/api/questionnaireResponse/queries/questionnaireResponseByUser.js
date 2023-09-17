const questionnaireResponseService = require(
    '../../../services/questionnaireResponseService'
  )
  const PermissionChecker = require('../../../services/iam/permissionChecker')
  const permissions = require('../../../security/permissions').values
  const graphqlSelectRequestedAttributes = require(
    '../../shared/utils/graphqlSelectRequestedAttributes'
  )
  
  const schema = `
  questionnaireResponseListByUserID(userID: ID!, limit: Int, offset: Int): questionnaireResponsePage!
  `
  
  const resolver = {
    questionnaireResponseListByUserID: async (root, args, context, info) => {
     new PermissionChecker(context).validateHas(permissions.casedRead)
      
      return new questionnaireResponseService(context).findByUserId(args.userID, {
        requestedAttributes: graphqlSelectRequestedAttributes(info, 'rows'),
      });
    },
  }
  
  exports.schema = schema
  exports.resolver = resolver
  