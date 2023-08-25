const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const tableName = "artifact";
const Artifact = sequelize.define(
  "Artifact",
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

    description: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    url: {
      type: Sequelize.STRING,
    },
  },
  { tableName, timestamps: false }
);

module.exports = { Artifact };
