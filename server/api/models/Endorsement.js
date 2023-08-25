const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const tableName = "endorsement";
const Endorsement = sequelize.define(
  "Endorsement",
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
    claim: {
      type: Sequelize.UUID,
    },
    issued_on: {
      type: Sequelize.DATE,
    },
    issuer: {
      type: Sequelize.UUID,
    },
    revocation_reason: {
      type: Sequelize.STRING,
    },
    revoked: {
      type: Sequelize.BOOLEAN,
    },
    verification: {
      type: Sequelize.UUID,
    },
  },
  { tableName, timestamps: false }
);

module.exports = { Endorsement };
