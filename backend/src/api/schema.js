/**
 * Maps all the Schema of the application.
 * More about the schema: https://www.apollographql.com/docs/graphql-tools/generate-schema/
 */

const makeExecutableSchema = require('graphql-tools').makeExecutableSchema
const resolvers = require('./resolvers')

const sharedTypes = require('./shared/types')

const settingsTypes = require('./settings/types')
const settingsQueries = require('./settings/queries')
const settingsMutations = require('./settings/mutations')

const authTypes = require('./auth/types')
const authQueries = require('./auth/queries')
const authMutations = require('./auth/mutations')

const iamTypes = require('./iam/types')
const iamQueries = require('./iam/queries')
const iamMutations = require('./iam/mutations')

const auditLogTypes = require('./auditLog/types')
const auditLogQueries = require('./auditLog/queries')
const auditLogMutations = require('./auditLog/mutations')

const patientTypes = require('./patient/types')
const patientQueries = require('./patient/queries')
const patientMutations = require('./patient/mutations')

const casedTypes = require('./cased/types')
const casedQueries = require('./cased/queries')
const casedMutations = require('./cased/mutations')

const moduleTypes = require('./module/types')
const moduleQueries = require('./module/queries')
const moduleMutations = require('./module/mutations')

const taskTypes = require('./task/types')
const taskQueries = require('./task/queries')
const taskMutations = require('./task/mutations')

const recordTypes = require('./record/types')
const recordQueries = require('./record/queries')
const recordMutations = require('./record/mutations')

const roadmapTypes = require('./roadmap/types')
const roadmapQueries = require('./roadmap/queries')
const roadmapMutations = require('./roadmap/mutations')

const epicTypes = require('./epic/types')
const epicQueries = require('./epic/queries')
const epicMutations = require('./epic/mutations')

const questionnaireTypes = require('./questionnaires/types')
const questionnaireQueries = require('./questionnaires/queries')
const questionnaireMutations = require('./questionnaires/mutations')

const assignmentTypes = require('./assignments/types')
const assignmentQueries = require('./assignments/queries')
const assignmentMutations = require('./assignments/mutations')

const taxonomyTypes = require('./taxonomy/types')
const taxonomyQueries = require('./taxonomy/queries')
const taxonomyMutations = require('./taxonomy/mutations')

const assignmentResponseTypes = require('./assignmentResponse/types')
const assignmentResponseQueries = require('./assignmentResponse/queries')
const assignmentResponseMutations = require('./assignmentResponse/mutations')

const questionnaireResponseTypes = require('./questionnaireResponse/types')
const questionnaireResponseQueries = require('./questionnaireResponse/queries')
const questionnaireResponseMutations = require('./questionnaireResponse/mutations')

const types = [
  ...sharedTypes,
  ...iamTypes,
  ...authTypes,
  ...auditLogTypes,
  ...settingsTypes,
  ...patientTypes,
  ...casedTypes,
  ...moduleTypes,
  ...taskTypes,
  ...recordTypes,
  ...roadmapTypes,
  ...epicTypes,
  ...assignmentTypes,
  ...questionnaireTypes,
  ...taxonomyTypes,
  ...assignmentResponseTypes,
  ...questionnaireResponseTypes
].map(type => type.schema)

const mutations = [
  ...iamMutations,
  ...authMutations,
  ...auditLogMutations,
  ...settingsMutations,
  ...patientMutations,
  ...casedMutations,
  ...moduleMutations,
  ...taskMutations,
  ...recordMutations,
  ...roadmapMutations,
  ...epicMutations,
  ...assignmentMutations,
  ...questionnaireMutations,
  ...taxonomyMutations,
  ...assignmentResponseMutations,
  ...questionnaireResponseMutations
].map(mutation => mutation.schema)

const queries = [
  ...assignmentQueries,
  ...questionnaireQueries,
  ...iamQueries,
  ...authQueries,
  ...auditLogQueries,
  ...settingsQueries,
  ...patientQueries,
  ...casedQueries,
  ...moduleQueries,
  ...taskQueries,
  ...recordQueries,
  ...roadmapQueries,
  ...epicQueries,
  ...taxonomyQueries,
  ...assignmentResponseQueries,
  ...questionnaireResponseQueries
].map(query => query.schema)

const query = `
  type Query {
    ${queries.join('\n')}
  }
`

const mutation = `
  type Mutation {
    ${mutations.join('\n')}
  }
`

const schemaDefinition = `
  type Schema {
    query: Query
    mutation: Mutation
  }
`

module.exports = makeExecutableSchema({
  typeDefs: [ schemaDefinition, query, mutation, ...types ],
  resolvers
})
