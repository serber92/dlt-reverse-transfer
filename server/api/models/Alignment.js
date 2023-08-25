const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const tableName = "alignment";
const Alignment = sequelize.define(
  "Alignment",
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

    framework_name: {
      type: Sequelize.STRING,
    },
    target_code: {
      type: Sequelize.STRING,
    },
    target_description: {
      type: Sequelize.STRING,
    },
    target_name: {
      type: Sequelize.STRING,
    },
    target_url: {
      type: Sequelize.STRING,
    },
  },
  { tableName, timestamps: false }
);

module.exports = { Alignment };
