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

  static async find (id) {
    const response = await graphqlClient.query({
      query: gql`
        query QUESTIONNAIRES_FIND($id: String!) {
          questionnairesFind(id: $id) {
            id
            title
            sub_title
            questionnaire_type
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
            createdAt
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
          $limit: Int
          $offset: Int
        ) {
          questionnaireResponseList(
            limit: $limit
            offset: $offset
          ) {
            count
            rows {
              id
              item
              questionnaireId {
                id
                title
              }
              subject {
                id
                fullName
              }
              createdAt
              meta
            }
          }
        }
      `,
      variables: { limit, offset }
    })
    return response.data.questionnaireResponseList
  }
}
