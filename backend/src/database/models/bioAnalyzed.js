const database = require('../database');
const Schema = database.Schema;

/**
 * BioAnalyzed database schema.
 * See https://mongoosejs.com/docs/models.html to learn how to customize it.
 */
const BioAnalyzedSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    timeStart: {
      type: String,
      required: true,
    },
    timeEnd: {
      type: String,
      required: true,
    },
    patient: {
      type: String,
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    dataId: {
      type: String,
      required: true,
    }
  }
);

BioAnalyzedSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const BioAnalyzed = database.model(
  'bioAnalyzed',
  BioAnalyzedSchema,
);

module.exports = BioAnalyzed;