const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const { ENUM } = require("sequelize");
const { RESULTTYPE } = require("../enums");
const tableName = "result";
const Result = sequelize.define(
  "Result",
  {
    id: {
      primaryKey: true,
      defaultValue: Sequelize.UUIDV1,
      type: Sequelize.UUID,
    },
    last_updated: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    type: {
      type: Sequelize.STRING,
    },
    created_by: {
      type: Sequelize.STRING,
    },

    result_type: {
      type: ENUM(Object.values(RESULTTYPE)),
    },
    alignment: {
      type: Sequelize.TEXT,
    },
    value: {
      type: Sequelize.TEXT,
    },
  },
  { tableName, timestamps: false }
);

module.exports = { Result };
