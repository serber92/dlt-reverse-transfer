const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const tableName = "participant";
const Participant = sequelize.define(
  "Participant",
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
    created_by: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
    },
    active: {
      type: Sequelize.BOOLEAN,
    },
    email: {
      type: Sequelize.STRING,
    },
    ip_address: {
      type: Sequelize.INET,
    },
    name: {
      type: Sequelize.STRING,
    },
    owner: {
      type: Sequelize.UUID,
    },
    participant_type: {
      type: Sequelize.STRING,
    },
    public_key: {
      type: Sequelize.STRING,
    },
  },
  { tableName, timestamps: false }
);

module.exports = { Participant, sequelize };
