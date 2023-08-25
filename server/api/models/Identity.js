const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const tableName = "identity";
const Identity = sequelize.define(
  "Identity",
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
    identity: {
      type: Sequelize.STRING,
    },
    hashed: {
      type: Sequelize.BOOLEAN,
    },
    salt: {
      type: Sequelize.TEXT,
    },
  },
  { tableName, timestamps: false }
);

module.exports = { Identity };
