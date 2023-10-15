import gql from 'graphql-tag'
import graphqlClient from 'modules/shared/graphql/graphqlClient'

export default class QuestionnaireReponseService {
  static async create (data) {
    const response = await graphqlClient.mutate({
      mutation: gql`
        mutation QUESTIONNAIRES_CREATE(
          $data: QuestionnaireInput!
        ) {
          questionnaireCreate(data: $data) {
            title
            sub_title
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

  static async deleteQuestionnaireResponse (id) {
    const response = await graphqlClient.mutate({
      mutation: gql`
      mutation QUESTIONNAIRE_RESPONSE_DELETE(
        $id: String!
      ) {
        questionnaireResponseDelete(id: $id) {
        }
      }
      `,
      variables: { id }
    })

    return response.data.questionnaireReponseDelete
  }

  static async deleteALLQuestionnaireResponseUser (userId) {
    const response = await graphqlClient.mutate({
      mutation: gql`
      mutation QUESTIONNAIRE_RESPONSE_DELETE_ALL(
        $userId: String!
      ) {
        questionnaireResponseDeleteAll(userId: $userId) {
        }
      }
      `,
      variables: { userId }
    })

    return response.data.questionnaireReponseDeleteAll
  }

  static async find (id) {
    const response = await graphqlClient.query({
      query: gql`
        query QUESTIONNAIRES_FIND($id: String!) {
          questionnairesFind(id: $id) {
            id
            title
            description
            type
            formSchema {
              type
              label
              field
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
              formSchema {
                required
                message
              }
            }
            authored
            updatedAt
          }
        }
      `,
      variables: { id }
    })

    return response.data.questionnairesFind
  }

  static async list (filter, orderBy, limit, offset) {
    const response = await graphqlClient.query({
      query: gql`
        query QUESTIONNAIRES_RESPONSE_LIST(
          $filter: QuestionnaireResponseFilterInput
          $limit: Int
          $offset: Int
        ) {
          questionnaireResponseList(
            filter: $filter
            limit: $limit
            offset: $offset
          ) {
            count
            rows {
              id
              item
              questionnaire {
                id
                title
              }
              subject {
                id
                fullName
              }
              authored
              meta
            }
          }
        }
      `,
      variables: { filter, limit, offset }
    })
    return response.data.questionnaireResponseList
  }
}