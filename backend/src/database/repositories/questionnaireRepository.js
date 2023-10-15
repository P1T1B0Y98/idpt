const MongooseRepository = require('./mongooseRepository')
const MongooseQueryUtils = require('../utils/mongooseQueryUtils')
const AuditLogRepository = require('./auditLogRepository')
const Questionnaire = require('../models/questionnaire')

/**
 * Handles database operations for the Questionnaire.
 * See https://mongoosejs.com/docs/index.html to learn how to customize it.
 */
class QuestionnaireRepository {
  /**
   * Creates the Questionnaire.
   *
   * @param {Object} data
   * @param {Object} [options]
   */
  async create (data, options) {
    if (MongooseRepository.getSession(options)) {
      await Questionnaire.createCollection()
    }

    const currentUser = MongooseRepository.getCurrentUser(options)
    const [ record ] = await Questionnaire.create(
      [ { ...data, publisher: currentUser.id } ],
      MongooseRepository.getSessionOptionsIfExists(options)
    )

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record.id,
      data,
      options
    )

    return this.findById(record.id, options)
  }

  /**
   * Updates the Questionnaire.
   *
   * @param {Object} data
   * @param {Object} [options]
   */
  async update (id, data, options) {
    await MongooseRepository.wrapWithSessionIfExists(
      Questionnaire.updateOne({ _id: id }, {
        ...data,
        date: MongooseRepository.getCurrentUser(options).id
      }),
      options
    )

    await this._createAuditLog(AuditLogRepository.UPDATE, id, data, options)

    const record = await this.findById(id, options)

    return record
  }

  /**
   * Deletes the Questionnaire.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  async destroy (id, options) {
    await MongooseRepository.wrapWithSessionIfExists(
      Questionnaire.deleteOne({ _id: id }),
      options
    )

    await this._createAuditLog(AuditLogRepository.DELETE, id, null, options)
  }

  /**
   * Counts the number of Questionnaires based on the filter.
   *
   * @param {Object} filter
   * @param {Object} [options]
   */
  async count (filter, options) {
    return MongooseRepository.wrapWithSessionIfExists(
      Questionnaire.countDocuments(filter),
      options
    )
  }

  /**
   * Finds the Questionnaire and its relations.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  async findById (id, options) {
    return MongooseRepository.wrapWithSessionIfExists(
      Questionnaire.findById(id).populate('owner'),
      options
    )
  }

  /**
   * Finds the Questionnaires based on the query.
   * See https://mongoosejs.com/docs/queries.html to learn how
   * to customize the queries.
   *
   * @param {Object} query
   * @param {Object} query.filter
   * @param {number} query.limit
   * @param  {number} query.offset
   * @param  {string} query.orderBy
   *
   * @returns {Promise<Object>} response - Object containing the rows and the count.
   */
  async findAndCountAll (
    { filter, limit, offset, orderBy } = {
      filter: null,
      limit: 0,
      offset: 0,
      orderBy: null
    },
    options
  ) {
    let criteria = {}
    if (filter) {
      if (filter.id) {
        criteria = { ...criteria, _id: MongooseQueryUtils.uuid(filter.id) }
      }

      if (filter.url) {
        criteria = {
          ...criteria,
          url: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.url),
            $options: 'i'
          }
        }
      }

      if (filter.createdAtRange) {
        const [ start, end ] = filter.createdAtRange

        if (start !== undefined && start !== null && start !== '') {
          criteria = {
            ...criteria,
            createdAt: { ...criteria.createdAt, $gte: start }
          }
        }

        if (end !== undefined && end !== null && end !== '') {
          criteria = {
            ...criteria,
            createdAt: { ...criteria.createdAt, $lte: end }
          }
        }
      }

      if (filter.title) {
        criteria = {
          ...criteria,
          title: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.title),
            $options: 'i', // Case-insensitive search
          },
        };
      }
    }

    const sort = MongooseQueryUtils.sort(orderBy || 'createdAt_DESC')

    const skip = Number(offset || 0) || undefined
    const limitEscaped = Number(limit || 0) || undefined

    const rows = await Questionnaire
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate('publisher')

    const count = await Questionnaire.countDocuments(criteria)

    return { rows, count }
  }

  /**
   * Lists the Questionnaires to populate the autocomplete.
   * See https://mongoosejs.com/docs/queries.html to learn how to
   * customize the query.
   *
   * @param {Object} search
   * @param {number} limit
   */
  async findAllAutocomplete (search, limit) {
    let criteria = {}

    if (search) {
      criteria = {
        $or: [
          { _id: MongooseQueryUtils.uuid(search) },
          {
            url: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: 'i'
            }
          }
        ]
      }
    }

    const sort = MongooseQueryUtils.sort('url_ASC')
    const limitEscaped = Number(limit || 0) || undefined

    const records = await Questionnaire
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort)

    return records.map(record => ({ id: record.id, label: record['title'] }))
  }

  /**
   * Creates an audit log of the operation.
   *
   * @param {string} action - The action [create, update or delete].
   * @param {object} id - The record id
   * @param {object} data - The new data passed on the request
   * @param {object} options
   */
  async _createAuditLog (action, id, data, options) {
    await AuditLogRepository.log(
      { entityName: Questionnaire.modelName, entityId: id, action, values: data },
      options
    )
  }
}

module.exports = QuestionnaireRepository
