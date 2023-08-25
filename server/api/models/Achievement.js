const Sequelize = require("sequelize");
const sequelize = require("../../config/database");

const { ENUM } = require("sequelize");
const { ACHIEVEMENTTYPE } = require("../enums");

const tableName = "achievement";
const Achievement = sequelize.define(
  "Achievement",
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
    achievement_type: {
      type: ENUM(Object.values(ACHIEVEMENTTYPE)),
    },
    alignments: {
      type: Sequelize.ARRAY(Sequelize.UUID),
    },
    associations: {
      type: Sequelize.ARRAY(Sequelize.UUID),
    },
    credits_available: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    endorsements: {
      type: Sequelize.ARRAY(Sequelize.UUID),
    },
    human_code: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    field_of_study: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
    issuer: {
      type: Sequelize.UUID,
    },
    level: {
      type: Sequelize.STRING,
    },
    requirement: {
      type: Sequelize.UUID,
    },
    result_descriptions: {
      type: Sequelize.ARRAY(Sequelize.TEXT),
    },
    signed_endorsements: {
      type: Sequelize.ARRAY(Sequelize.TEXT),
    },
    source_key: {
      type: Sequelize.STRING,
    },
    specialization: {
      type: Sequelize.STRING,
    },
    tags: {
      type: Sequelize.STRING,
    },
    properties: {
      type: Sequelize.STRING,
    },
  },
  { tableName, timestamps: false }
);

module.exports = { Achievement };
