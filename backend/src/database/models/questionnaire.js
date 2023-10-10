const database = require('../database');
const Schema = database.Schema;

/**
 * Questionnaire database schema.
 * See https://mongoosejs.com/docs/models.html to learn how to customize it.
 */
const QuestionnaireSchema = new Schema(
  {
    resourceType: { 
      type: String,
      default: 'questionnaire' },
    status: { 
      type: String,
      default: 'active'},
    title: { type: String },
    type: {
      type: String,
      required: true,
      enum: ['anxiety', 'depression', 'physical_health', 'general_health'],
      default: 'anxiety',
    },
    subjectType: {
      type: String,
      default: 'Patients'
    },
    publisher: { type: Schema.Types.ObjectId, ref: 'user' },
  
    item: [
      {
        linkId: { type: String },
        type: {
          type: String,
          required: true,
          enum: [
            'input',
            'textarea',
            'radio',
            'checkbox',
            'select',
            'date',
            'time',
            'confirm',
            'smartwatch_data',
          ],
          default: 'input',
        },
        text: { type: String, required: true },
        required: { type: Boolean },
        answerOption: [
          {
            value: { type: String, required: true },
            label: { type: String, required: true },
          },
        ],
      },
    ],
    repeats: {
      type: String,
      required: true,
      enum: [
        'null',
        'daily',
        'weekly',
        'monthly'],
      default: 'null',
    },
    importHash: { type: String },
  },
  { timestamps: { updatedAt: 'date' },
},
);

QuestionnaireSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

QuestionnaireSchema.set('toJSON', { getters: true });

QuestionnaireSchema.set('toObject', { getters: true });

const Questionnaire = database.model(
  'questionnaire',
  QuestionnaireSchema,
);

module.exports = Questionnaire;
