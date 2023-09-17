const QuestionnaireResponseService = require('../../../services/questionnaireResponseService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions').values;
const { decrypt } = require('../../../security/cryptoHelper');
const zlib = require('zlib');

const schema = `
  questionnaireResponseCreate(data: questionnaireResponseInput!): QuestionnaireResponse!
`;

const resolver = {
  questionnaireResponseCreate: async (root, args, context) => {
    //new PermissionChecker(context).validateHas(permissions.patientRead);
    try {
      // Check if formData is present in the args
      if (args.data.item) {
        // Decrypt the formData
        let decryptedFormData = decrypt(args.data.item);
                // Decompress the formData
        let bufferFromBase64 = Buffer.from(decryptedFormData, 'base64');
        let decompressedFormData = await decompressGZIP(bufferFromBase64);
        // Parse the formData    
        args.data.item = JSON.parse(decompressedFormData);  
      }
      
      // Call questionnaireResponseService to create the questionnaire response
      return new QuestionnaireResponseService(context).create(args.data);
    } catch (error) {
      // Handle decryption error, maybe log it and return an error to the client
      throw new Error("Unable to process the provided data.");
    }
  },
};

exports.schema = schema;
exports.resolver = resolver;

function decompressGZIP(data) {
  return new Promise((resolve, reject) => {
    zlib.gunzip(data, (err, result) => {
      if (err) reject(err);
      resolve(result.toString());
    });
  });
}
