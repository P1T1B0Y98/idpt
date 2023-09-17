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

  enum QuestionnaireTypeEnum {
    stress
    sleep
    physical_health
  }

  enum FrequencyEnum {
    none
    daily
    weekly
    monthly
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
