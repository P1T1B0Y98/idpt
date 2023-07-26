import gql from 'graphql-tag'
import graphqlClient from 'modules/shared/graphql/graphqlClient'

export default class AssessmentsService {
  static async update (id, data) {
    const response = await graphqlClient.mutate({
      mutation: gql`
        mutation ASSESSMENTS_UPDATE(
          $id: String!
          $data: AssessmentInput!
        ) {
          assessmentUpdate(id: $id, data: $data) {
            id
          }
        }
      `,
      variables: { id, data }
    })

    return response.data.assessmentUpdate
  }

  static async destroyAll (ids) {
    const response = await graphqlClient.mutate({
      mutation: gql`
        mutation ASSESSMENTS_DESTROY($ids: [String!]!) {
          assessmentsDestroy(ids: $ids)
        }
      `,
      variables: { ids }
    })

    return response.data.assessmentsDestroy
  }

  static async create (data) {
    const response = await graphqlClient.mutate({
      mutation: gql`
        mutation ASSESSMENTS_CREATE(
          $data: AssessmentInput!
        ) {
          assessmentCreate(data: $data) {
            title
          }
        }
      `,
      variables: { data }
    })

    return response.data.assessmentsCreate
  }

  static async submitAssessment (data) {
    const response = await graphqlClient.mutate({
      mutation: gql`
      mutation ASSESSMENTS_SUBMIT(
        $data: assessmentResponseInput!
      ) {
        assessmentResponseCreate(data: $data) {
          id
        }
      }
      `,
      variables: { data }
    })

    return response
  }

  static async import (values, importHash) {
    const response = await graphqlClient.mutate({
      mutation: gql`
        mutation ASSESSMENTS_IMPORT(
          $data: AssessmentInput!
          $importHash: String!
        ) {
          assessmentsImport(
            data: $data
            importHash: $importHash
          )
        }
      `,
      variables: { data: values, importHash }
    })

    return response.data.assessmentsImport
  }

  static async find(id) {
    const response = await graphqlClient.query({
      query: gql`
        query ASSESSMENTS_FIND($id: String!) {
          assessmentsFind(id: $id) {
            id
            title
            assessment_type
            frequency
            assessmentSchema {
              type
              field
              question
              options {
                field
                value
                label
              }
              placeholder
              rules {
                required
                message
              }
              assessmentSchema {
                required
                message
              }
            }
            createdAt
            updatedAt
          }
        }
      `,
      variables: { id },
    });

    return response.data.assessmentsFind;
  }

  static async list (filter, orderBy, limit, offset) {
    const response = await graphqlClient.query({
      query: gql`
        query ASSESSMENTS_LIST(
          $filter: AssessmentsFilterInput
          $orderBy: AssessmentsOrderByEnum
          $limit: Int
          $offset: Int
        ) {
          assessmentsList(
            filter: $filter
            orderBy: $orderBy
            limit: $limit
            offset: $offset
          ) {
            count
            rows {
              id
              title
              assessmentSchema {
                type
                field
                question
              }
              createdBy {
                id
                fullName
              }
              createdAt
              updatedAt
            }
          }
        }
      `,
      variables: { filter, orderBy, limit, offset }
    })

    return response.data.assessmentsList
  }

  static async listAutocomplete (query, limit) {
    const response = await graphqlClient.query({
      query: gql`
        query ASSESSMENTS_AUTOCOMPLETE(
          $query: String
          $limit: Int
        ) {
          assessmentsAutocomplete(
            query: $query
            limit: $limit
          ) {
            id
            label
          }
        }
      `,
      variables: { query, limit }
    })

    return response.data.assessmentsAutocomplete
  }
}
