const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const tableName = "endorsement_claim";
const EndorsementClaim = sequelize.define(
  "EndorsementClaim",
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
    endorsement_comment: {
      type: Sequelize.TEXT,
    },
  },
  { tableName, timestamps: false }
);

module.exports = { EndorsementClaim };
