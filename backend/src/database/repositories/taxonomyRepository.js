const MongooseRepository = require('./mongooseRepository');
const MongooseQueryUtils = require('../utils/mongooseQueryUtils');
const AuditLogRepository = require('./auditLogRepository');
const Taxonomy = require('../models/taxonomy');

/**
 * Handles database operations for the Taxonomy.
 * See https://mongoosejs.com/docs/index.html to learn how to customize it.
 */
class TaxonomyRepository {
  /**
   * Creates the Taxonomy.
   *
   * @param {Object} data
   * @param {Object} [options]
   */
  async create(data, options) {
    if (MongooseRepository.getSession(options)) {
      await Taxonomy.createCollection();
    }

    const currentUser = MongooseRepository.getCurrentUser(
      options,
    );


    const [record] = await Taxonomy.create(
      [
        {
          ...data,
          createdBy: currentUser.id,
          updatedBy: currentUser.id,
        },
      ],
      MongooseRepository.getSessionOptionsIfExists(options),
    );

    const parents = data.parent;
    const subtaxonomies = data.subtaxonomies;

    // If parents are specified,
    // update the parent objects
    // to have this taxonomy as a child
    if (parents) {
      parents.forEach(async id => {
        let parentData = await Taxonomy.findById(id);
        parentData.subtaxonomies.push(record.id);
        await parentData.save();
      });
    }

    // If subtaxonomies are specified,
    // update the child objects
    // to have this taxonomy as a parent
    if (subtaxonomies) {
      subtaxonomies.forEach(async id => {
        let childData = await Taxonomy.findById(id);
        childData.parent.push(record.id);
        await childData.save();
      });
    }

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record.id,
      data,
      options,
    );

    /*
    // TODO connect to case/module/task
    await MongooseRepository.refreshTwoWayRelationManyToMany(
      record,
      'owner',
      Module,
      'tasks',
      options,
    );
    */

    return this.findById(record.id, options);
  }

  /**
   * Updates the Taxonomy.
   *
   * @param {Object} data
   * @param {Object} [options]
   */
  async update(id, data, options) {
    // If any parents or subtaxonomies are added or removed in the update,
    // update the associated taxonomies as well.
    const oldData = await Taxonomy.findById(id);

    // Update old/new parents
    if (oldData.parent) {
      const oldParents = oldData.parent.map(x => x.toString())
      const newParents = data.parent ? data.parent : [];

      if (oldParents !== newParents) {
        let removedParents = oldParents.filter(x => !newParents.includes(x));
        let addedParents = newParents.filter(x => !oldParents.includes(x));

        // Remove this taxonomy from the child list of all removed parents
        removedParents.forEach(async x => {
          let oldParentData = await Taxonomy.findById(x); 

          oldParentData.subtaxonomies = oldParentData.subtaxonomies.filter(y => y.toString() !== id);
          await oldParentData.save();
        });

        // Add this taxonomy to the child list of all added parents
        addedParents.forEach(async x => {
          let newParentData = await Taxonomy.findById(x); 
          newParentData.subtaxonomies.push(id);
          await newParentData.save();
        });
      }
    }

    // Update old/new subtaxonomies
    if (oldData.subtaxonomies) {
      const oldChildren = oldData.subtaxonomies.map(x => x.toString())
      const newChildren = data.subtaxonomies ? data.subtaxonomies : [];

      if (oldChildren !== newChildren) {
        let removedChildren = oldChildren.filter(x => !newChildren.includes(x));
        let addedChildren = newChildren.filter(x => !oldChildren.includes(x));
        
        // Remove this taxonomy from the parent list of all removed subtaxonomies
        removedChildren.forEach(async x => {
          let oldChildData = await Taxonomy.findById(x); 
          oldChildData.parent = oldChildData.parent.filter(y => y.toString() !== id);
          await oldChildData.save();
        });

        // Add this taxonomy to the parent list of all added subtaxonomies
        addedChildren.forEach(async x => {
          let newChildData = await Taxonomy.findById(x); 
          newChildData.parent.push(id);
          await newChildData.save();
        });
      }
    }

    await MongooseRepository.wrapWithSessionIfExists(
      Taxonomy.updateOne(
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

    /*
    await MongooseRepository.refreshTwoWayRelationManyToMany(
      record,
      'owner',
      Module,
      'tasks',
      options,
    );
    */

    return record;
  }

  /**
   * Deletes the Taxonomy.
   *
   * @param {string} id
   * @param {Object} [options]
   */
   async destroy(id, options) {
    const data = await Taxonomy.findById(id);
    const parents = data.parent;
    const subtaxonomies = data.subtaxonomies;

    // If parents are specified,
    // update the parent objects
    // to remove this taxonomy as a child
    if (parents) {
        parents.forEach(async parentId => {
          let parentData = await Taxonomy.findById(parentId);

        // Avoid undefined-related errors
          if (parentData) {
            parentData.subtaxonomies = parentData.subtaxonomies.filter(x => x.toString() !== id);
            await parentData.save();

            // Log change
            await this._createAuditLog(
              AuditLogRepository.UPDATE,
              id,
              parentData,
              options,
            );
          }
      });
    }

    // If subtaxonomies are specified,
    // update the child objects
    // to remove this taxonomy as a parent
    if (subtaxonomies) {
      subtaxonomies.forEach(async childId => {
        let childData = await Taxonomy.findById(childId);
        
        // Avoid undefined-related errors
        if (childData) {
          childData.parent = childData.parent.filter(x => x.toString() !== id);
          childData.save();

          // Log change
          await this._createAuditLog(
            AuditLogRepository.UPDATE,
            id,
            childData,
            options,
          );
        }
      });
    }

    await MongooseRepository.wrapWithSessionIfExists(
      Taxonomy.deleteOne({ _id: id }),
      options,
    );

    await this._createAuditLog(
      AuditLogRepository.DELETE,
      id,
      null,
      options,
    );

    /*
    await MongooseRepository.destroyRelationToMany(
      id,
      Module,
      'tasks',
      options,
    );
    */
  }

  /**
   * Counts the number of Taxonomies based on the filter.
   *
   * @param {Object} filter
   * @param {Object} [options]
   */
  async count(filter, options) {
    return MongooseRepository.wrapWithSessionIfExists(
      Taxonomy.countDocuments(filter),
      options,
    );
  }

  /**
   * Finds the Taxonomy and its relations.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  async findById(id, options) {
    return MongooseRepository.wrapWithSessionIfExists(
      Taxonomy.findById(id)
        .populate('parent')
        .populate('subtaxonomies'),
      options,
    );
  }

  /**
   * Finds the Taxonomy and its relations.
   *
   * @param {string} ids
   * @param {Object} [options]
   */
  async findByIds(ids, options) {
    return MongooseRepository.wrapWithSessionIfExists(
      Taxonomy.find({ _id: { $in: ids } }).populate('parent'),
      Taxonomy.find({ _id: { $in: ids } }).populate('subtaxonomies'),
      options,
    );
  }

  /**
   * Finds the Taxonomies based on the query.
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

      if (filter.name) {
        criteria = {
          ...criteria,
          name: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.name,
            ),
            $options: 'i',
          },
        };
      }

      if (filter.status) {
        criteria = {
          ...criteria,
          status: filter.status,
        };
      }

      // TODO fix filtering on parent
      if (filter.parent) {
        criteria = {
          ...criteria,
          parent: filter.parent,
        };
      }

      // TODO fix filtering on subtaxonomies
      if (filter.subtaxonomies) {
        criteria = {
          ...criteria,
          subtaxonomies: filter.subtaxonomies,
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

    const rows = await Taxonomy.find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate('parent')
      .populate('subtaxonomies');

    const count = await Taxonomy.countDocuments(criteria);

    return { rows, count };
  }

  /**
   * Lists the Taxonomies to populate the autocomplete.
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


    const records = await Taxonomy.find(criteria)
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
        entityName: Taxonomy.modelName,
        entityId: id,
        action,
        values: data,
      },
      options,
    );
  }
}

module.exports = TaxonomyRepository;
