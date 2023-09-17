const database = require('../database')
const Schema = database.Schema

// Define the schema for an item within the array
const itemSchema = new Schema({
  linkId: String,
  text: String,
  type: String,
  answer: {
    type: Schema.Types.Mixed,
  },
});

// Pre-save hook to handle JSON conversion
itemSchema.pre('save', function (next) {
  try {
    // Try to parse the answer as JSON
    const parsedAnswer = JSON.parse(this.answer);
    this.answer = parsedAnswer; // Store as JSON object
  } catch (error) {
    // Parsing failed, keep the answer as a string
  }
  next();
});

module.exports = itemSchema;
