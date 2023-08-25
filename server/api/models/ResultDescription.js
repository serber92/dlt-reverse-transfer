const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const tableName = "result_description";
const ResultDescription = sequelize.define(
  "ResultDescription",
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
    alignment: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.TEXT,
    },
    result_min: {
      type: Sequelize.TEXT,
    },
    result_max: {
      type: Sequelize.TEXT,
    },
  },
  { tableName, timestamps: false }
);

module.exports = { ResultDescription };
