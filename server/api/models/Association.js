const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const tableName = "association";
const Association = sequelize.define(
  "Association",
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

    association_type: {
      type: Sequelize.STRING,
    },
    sequence_number: {
      type: Sequelize.INTEGER,
    },
    target_id: {
      type: Sequelize.UUID,
    },
  },
  { tableName, timestamps: false }
);

module.exports = { Association };
