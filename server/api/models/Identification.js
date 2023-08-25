const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const tableName = "identification";
const Identification = sequelize.define(
  "Identification",
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
    identity_type: {
      type: Sequelize.STRING,
    },
    owner: {
      type: Sequelize.UUID,
    },
    identity: {
      type: Sequelize.UUID,
    },
    profile: {
      type: Sequelize.UUID,
    },
  },
  { tableName, timestamps: false }
);

module.exports = { Identification };
