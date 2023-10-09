const schema = `
  input questionnaireResponseInput {
    resourceType: String
    questionnaire: String
    status: String
    subject: String
    authored: String
    item: JSON
    meta: FHIRMetaInput
    }

  input FHIRMetaInput {
    versionId: String
    lastUpdated: String
    source: String
    }
  
`


const resolver = {}

exports.schema = schema
exports.resolver = resolver
