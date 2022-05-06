import gql from 'graphql-tag';
import graphqlClient from 'modules/shared/graphql/graphqlClient';

export default class WearableDataService {
  static async update(id, data) {
    const response = await graphqlClient.mutate({
      mutation: gql`
        mutation WEARABLEDATA_UPDATE(
          $id: String!
          $data: WearableDataInput!
        ) {
          wearableDataUpdate(id: $id, data: $data) {
            id
          }
        }
      `,

      variables: {
        id,
        data,
      },
    });

    return response.data.wearableDataUpdate;
  }

  static async destroyAll(ids) {
    const response = await graphqlClient.mutate({
      mutation: gql`
        mutation WEARABLEDATA_DESTROY($ids: [String!]!) {
          wearableDataDestroy(ids: $ids)
        }
      `,

      variables: {
        ids,
      },
    });

    return response.data.wearableDataDestroy;
  }

  // Takes a list of WearableDatas
  static async create(data) {

    console.log("/// wearableDataService   create()");
    console.log(data);

    const response = await graphqlClient.mutate({
      mutation: gql`
        mutation WEARABLEDATA_CREATE($data: MultipleWearableDataInput!) {
          wearableDataCreate(data: $data) {
            id
          }
        }
      `,

      variables: {
        data,
      },
    }).catch((error) => { console.log(JSON.stringify(error, null, 2)); });

    return response.data.wearableDataCreate;
  }

  static async import(values, importHash) {
    const response = await graphqlClient.mutate({
      mutation: gql`
        mutation WEARABLEDATA_IMPORT(
          $data: WearableDataInput!
          $importHash: String!
        ) {
          wearableDataImport(data: $data, importHash: $importHash)
        }
      `,

      variables: {
        data: values,
        importHash,
      },
    });

    return response.data.wearableDataImport;
  }

  static async find(id) {
    const response = await graphqlClient.query({
      query: gql`
        query WEARABLEDATA_FIND($id: String!) {
          wearableDataFind(id: $id) {
            id
            dataType
            frequency
            timestamp
            data
            patientName
            patientId
            createdAt
            updatedAt
          }
        }
      `,

      variables: {
        id,
      },
    });

    return response.data.wearableDataFind;
  }

  static async list(filter, orderBy, limit, offset) {
    const response = await graphqlClient.query({
      query: gql`
        query WEARABLEDATA_LIST(
          $filter: WearableDataFilterInput
          $orderBy: WearableDataOrderByEnum
          $limit: Int
          $offset: Int
        ) {
          wearableDataList(
            filter: $filter
            orderBy: $orderBy
            limit: $limit
            offset: $offset
          ) {
            count
            rows {
              id
              dataType
              timestamp
              patientName
              patientId
              frequency
              updatedAt
              createdAt
            }
          }
        }
      `,

      variables: {
        filter,
        orderBy,
        limit,
        offset,
      },
    });

    return response.data.wearableDataList;
  }

  static async listAutocomplete(query, limit) {
    const response = await graphqlClient.query({
      query: gql`
        query WEARABLEDATA_AUTOCOMPLETE(
          $query: String
          $limit: Int
        ) {
          wearableDataAutocomplete(query: $query, limit: $limit) {
            id
            label
          }
        }
      `,

      variables: {
        query,
        limit,
      },
    });

    return response.data.wearableDataAutocomplete;
  }
}
