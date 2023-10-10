const database = require('../database')
const itemSchema = require('./item')
const Schema = database.Schema

/**
 * Questionnaire database schema.
 * See https://mongoosejs.com/docs/models.html to learn how to customize it.
 */
const QuestionnaireResponseSchema = new Schema(
  {
    resourceType: { type: String },
    questionnaire: { type: Schema.Types.ObjectId, ref: 'questionnaire' },
    status: { type: String },
    subject: { type: Schema.Types.ObjectId, ref: 'user' },
    authored: { type: String },
    item: [itemSchema],
    meta: {
      versionId: String,
      lastUpdated: String,
      source: String,
    },
    importHash: { type: String }
  },
  { timestamps: true }
)

QuestionnaireResponseSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

QuestionnaireResponseSchema.set('toJSON', { getters: true })

QuestionnaireResponseSchema.set('toObject', { getters: true })

const QuestionnaireResponse = database.model(
  'questionnaireResponse',
  QuestionnaireResponseSchema
)

module.exports = QuestionnaireResponse
