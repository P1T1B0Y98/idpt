const schema = `
  enum QuestionTypeEnum {
    input
    textarea
    radio
    checkbox
    select
    date
    time
    confirm
    smartwatch_data
  }

  enum AssessmentTypeEnum {
    stress
    mental_health
    physical_health
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
