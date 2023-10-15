const database = require('../database');
const Schema = database.Schema;

const valueSchema = new Schema(
    {
      data: { type: Schema.Types.Mixed },
      origin: { type: String },
    },
    { _id: false } // Set _id to false to prevent Mongoose from automatically adding an _id field to the sub-document
  );

const codeSchema = new Schema(
    {
        coding: [
            {
                system: { type: String },
                display: { type: String },
            },
        ],
        text: { type: String },
    },
    { _id: false } // Set _id to false to prevent Mongoose from automatically adding an _id field to the sub-document
);
  
const ObservationSchema = new Schema(
  {
    // Define fields for FHIR Observation data
    resourceType: { type: String },
    status: { type: String }, // You can adjust the data types as needed
    code: codeSchema,
    subject: { type: String },
    effectiveDateTime: { type: String },
    value: valueSchema, // Adjust data type based on your data

/*     // Reference to the source, e.g., questionnaire response
    source: {
      type: Schema.Types.ObjectId,
      ref: 'QuestionnaireResponse', // Reference to the original questionnaire response
    }, */

    // Other fields specific to your Observation schema
    // ...

    // Timestamps for creation and update
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ObservationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ObservationSchema.set('toJSON', { getters: true });

ObservationSchema.set('toObject', { getters: true });

const Observation = database.model('observation', ObservationSchema);

module.exports = Observation;
