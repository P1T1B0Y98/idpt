import gql from 'graphql-tag'
import graphqlClient from 'modules/shared/graphql/graphqlClient'

export default class QuestionnairesService {
  static async update (id, data) {
    const response = await graphqlClient.mutate({
      mutation: gql`
        mutation QUESTIONNAIRES_UPDATE(
          $id: String!
          $data: QuestionnaireInput!
        ) {
          questionnaireUpdate(id: $id, data: $data) {
            id
          }
        }
      `,
      variables: { id, data }
    })

    return response.data.questionnaireUpdate
  }

  static async destroyAll (ids) {
    const response = await graphqlClient.mutate({
      mutation: gql`
        mutation QUESTIONNAIRES_DESTROY($ids: [String!]!) {
          questionnairesDestroy(ids: $ids)
        }
      `,
      variables: { ids }
    })

    return response.data.questionnairesDestroy
  }

  static async create (data) {
    const response = await graphqlClient.mutate({
      mutation: gql`
        mutation QUESTIONNAIRES_CREATE(
          $data: QuestionnaireInput!
        ) {
          questionnaireCreate(data: $data) {
            title
          }
        }
      `,
      variables: { data }
    })

    return response.data.questionnairesCreate
  }

  static async submitQuestionnaire (data) {
    const response = await graphqlClient.mutate({
      mutation: gql`
      mutation QUESTIONNAIRES_SUBMIT(
        $data: questionnaireResponseInput!
      ) {
        questionnaireResponseCreate(data: $data) {
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
        mutation QUESTIONNAIRES_IMPORT(
          $data: QuestionnaireInput!
          $importHash: String!
        ) {
          questionnairesImport(
            data: $data
            importHash: $importHash
          )
        }
      `,
      variables: { data: values, importHash }
    })

    return response.data.questionnairesImport
  }

  static async find(id) {
    const response = await graphqlClient.query({
      query: gql`
        query QUESTIONNAIRES_FIND($id: String!) {
          questionnairesFind(id: $id) {
            id
            resourceType
            title
            type
            status
            repeats
            item {
              linkId
              type
              text
              answerOption {
                value
                label
              }
            }
            createdAt
            updatedAt
          }
        }
      `,
      variables: { id },
    });

    return response.data.questionnairesFind;
  }

  static async list (filter, orderBy, limit, offset) {
    const response = await graphqlClient.query({
      query: gql`
        query QUESTIONNAIRES_LIST(
          $filter: QuestionnairesFilterInput
          $orderBy: QuestionnairesOrderByEnum
          $limit: Int
          $offset: Int
        ) {
          questionnairesList(
            filter: $filter
            orderBy: $orderBy
            limit: $limit
            offset: $offset
          ) {
            count
            rows {
              id
              title
              item {
                type
                text
              }
              publisher {
                id
                fullName
              }
              date
            }
          }
        }
      `,
      variables: { filter, orderBy, limit, offset }
    })

    return response.data.questionnairesList
  }

  static async listAutocomplete (query, limit) {
    const response = await graphqlClient.query({
      query: gql`
        query QUESTIONNAIRES_AUTOCOMPLETE(
          $query: String
          $limit: Int
        ) {
          questionnairesAutocomplete(
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

    return response.data.questionnairesAutocomplete
  }
}
