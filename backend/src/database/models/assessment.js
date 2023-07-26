const database = require('../database');
const Schema = database.Schema;

/**
 * Assessment database schema.
 * See https://mongoosejs.com/docs/models.html to learn how to customize it.
 */
const AssessmentSchema = new Schema(
  {
    title: { type: String },
    assessment_type: {
      type: String,
      required: true,
      enum: ['stress', 'mental_health', 'physical_health'],
      default: 'stress',
    },
    owner: [
      {
        type: Schema.Types.ObjectId,
        ref: 'task',
      },
    ],
    assessmentSchema: [
      {
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
        placeholder: { type: String },
        field: { type: String, required: true },
        question: { type: String, required: true },
        rules: [
          {
            required: { type: Boolean },
            message: { type: String, required: true },
          },
        ],
        assessmentSchema: [
          {
            required: { type: Boolean },
            message: { type: String, required: true },
          },
        ],
        options: [
          {
            field: { type: String, required: true },
            value: { type: String, required: true },
            label: { type: String, required: false },
          },
        ],
      },
    ],
    frequency: {
      type: String,
      required: true,
      enum: [
        'null',
        'daily',
        'weekly',
        'monthly'],
      default: 'null',
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'user' },
    importHash: { type: String },
  },
  { timestamps: true },
);

AssessmentSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

AssessmentSchema.set('toJSON', { getters: true });

AssessmentSchema.set('toObject', { getters: true });

const Assessment = database.model(
  'assessment',
  AssessmentSchema,
);

module.exports = Assessment;
