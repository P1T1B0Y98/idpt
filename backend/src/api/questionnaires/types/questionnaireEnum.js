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
    wearable
  }

  enum QuestionnaireTypeEnum {
    anxiety
    depression
    physical_health
    general_health
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
