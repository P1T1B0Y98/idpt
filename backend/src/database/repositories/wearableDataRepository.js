const MongooseRepository = require('./mongooseRepository');
const MongooseQueryUtils = require('../utils/mongooseQueryUtils');
const AuditLogRepository = require('./auditLogRepository');
const WearableData = require('../models/wearableData');

/**
 * Handles database operations for the WearableData.
 * See https://mongoosejs.com/docs/index.html to learn how to customize it.
 */
class WearableDataRepository {
  /**
   * Creates the WearableData.
   *
   * @param {Object} data
   * @param {Object} [options]
   */
  async create(data, options) {
    if (MongooseRepository.getSession(options)) {
      await WearableData.createCollection();
    }

    const currentUser = MongooseRepository.getCurrentUser(
      options,
    );

    // console.log("YAAAAS wearableDataRepository YAAAAS");
    // console.log(JSON.stringify(data));

    var dataWithPatient = data;
    dataWithPatient.fhir.subject.reference = currentUser._id;
    dataWithPatient.fhir.subject.display = currentUser.fullName;
    // console.log("NEWNEWNEW wearableDataRepository NEWNEWNEW");
    // var d = dataWithPatient;
    // d.fhir.valueSampledData.data = undefined;
    // console.log(JSON.stringify(d));

    const [record] = await WearableData.create(
      [
        {
          ...dataWithPatient,
          createdBy: currentUser.id,
          updatedBy: currentUser.id,
          //patientName: currentUser.fullName,
          //patientId: currentUser._id,
        },
      ],
      MongooseRepository.getSessionOptionsIfExists(options),
    );

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record.id,
      data,
      options,
    );

    

    return this.findById(record.id, options);
  }

  /**
   * Updates the WearableData.
   *
   * @param {Object} data
   * @param {Object} [options]
   */
  async update(id, data, options) {
    await MongooseRepository.wrapWithSessionIfExists(
      WearableData.updateOne(
        { _id: id },
        {
          ...data,
          updatedBy: MongooseRepository.getCurrentUser(
            options,
          ).id,
        },
      ),
      options,
    );

    await this._createAuditLog(
      AuditLogRepository.UPDATE,
      id,
      data,
      options,
    );

    const record = await this.findById(id, options);

    return record;
  }

  /**
   * Deletes the WearableData.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  async destroy(id, options) {
    await MongooseRepository.wrapWithSessionIfExists(
      WearableData.deleteOne({ _id: id }),
      options,
    );

    await this._createAuditLog(
      AuditLogRepository.DELETE,
      id,
      null,
      options,
    );

  }

  /**
   * Counts the number of WearableDatas based on the filter.
   *
   * @param {Object} filter
   * @param {Object} [options]
   */
  async count(filter, options) {
    return MongooseRepository.wrapWithSessionIfExists(
      WearableData.countDocuments(filter),
      options,
    );
  }

  /**
   * Finds the WearableData and its relations.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  async findById(id, options) {
    return MongooseRepository.wrapWithSessionIfExists(
      WearableData.findById(id),
      options,
    );
  }

  /**
   * Finds the WearableData and its relations.
   *
   * @param {string} ids
   * @param {Object} [options]
   */
  async findByIds(ids, options) {
    return MongooseRepository.wrapWithSessionIfExists(
      WearableData.find({ _id: { $in: ids } }),
      options,
    );
  }

  /**
   * Finds the WearableDatas based on the query.
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
  async findAndCountAll(
    { filter, limit, offset, orderBy } = {
      filter: null,
      limit: 0,
      offset: 0,
      orderBy: null,
    },
    options,
  ) {
    let criteria = {};

    if (filter) {
      if (filter.id) {
        criteria = {
          ...criteria,
          ['_id']: MongooseQueryUtils.uuid(filter.id),
        };
      }

      if (filter.dataType) {
        criteria = {
          ...criteria,
          dataType: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.dataType,
            ),
            $options: 'i',
          },
        };
      }

      if (filter.patientName) {
        criteria = {
          ...criteria,
          patientName: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.patientName,
            ),
            $options: 'i',
          },
        };
      }

      if (filter.patientId) {
        criteria = {
          ...criteria,
          patientId: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.patientId,
            ),
            $options: 'i',
          },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          criteria = {
            ...criteria,
            ['createdAt']: {
              ...criteria.createdAt,
              $gte: start,
            },
          };
        }

        if (
          end !== undefined &&
          end !== null &&
          end !== ''
        ) {
          criteria = {
            ...criteria,
            ['createdAt']: {
              ...criteria.createdAt,
              $lte: end,
            },
          };
        }
      }
    }

    const sort = MongooseQueryUtils.sort(
      orderBy || 'createdAt_DESC',
    );

    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;

    const rows = await WearableData.find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort);

    const count = await WearableData.countDocuments(criteria);

    return { rows, count };
  }

  /**
   * Lists the WearableDatas to populate the autocomplete.
   * See https://mongoosejs.com/docs/queries.html to learn how to
   * customize the query.
   *
   * @param {Object} search
   * @param {number} limit
   */
  async findAllAutocomplete(search, limit) {
    let criteria = {};

    if (search) {
      criteria = {
        $or: [
          { _id: MongooseQueryUtils.uuid(search) },
          {
            name: {
              $regex: MongooseQueryUtils.escapeRegExp(
                search,
              ),
              $options: 'i',
            },
          },
        ],
      };
    }

    const sort = MongooseQueryUtils.sort('name_ASC');
    const limitEscaped = Number(limit || 0) || undefined;

    const records = await WearableData.find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record) => ({
      id: record.id,
      label: record['name'],
    }));
  }

  /**
   * Creates an audit log of the operation.
   *
   * @param {string} action - The action [create, update or delete].
   * @param {object} id - The record id
   * @param {object} data - The new data passed on the request
   * @param {object} options
   */
  async _createAuditLog(action, id, data, options) {
    await AuditLogRepository.log(
      {
        entityName: WearableData.modelName,
        entityId: id,
        action,
        values: data,
      },
      options,
    );
  }
}

module.exports = WearableDataRepository;
