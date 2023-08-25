const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const tableName = "endorsement_profile";
const EndorsementProfile = sequelize.define(
  "EndorsementProfile",
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
    address: {
      type: Sequelize.UUID,
    },
    birthdate: {
      type: Sequelize.TEXT,
    },
    description: {
      type: Sequelize.TEXT,
    },
    email: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    public_key: {
      type: Sequelize.UUID,
    },
    revocation_list: {
      type: Sequelize.STRING,
    },
    source_id: {
      type: Sequelize.STRING,
    },
    student_id: {
      type: Sequelize.STRING,
    },
    telephone: {
      type: Sequelize.STRING,
    },
    url: {
      type: Sequelize.STRING,
    },
    verification: {
      type: Sequelize.UUID,
    },
  },
  { tableName, timestamps: false }
);

module.exports = { EndorsementProfile };
