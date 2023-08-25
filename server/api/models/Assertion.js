const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const { Verification } = require("./Verification");
const { Achievement } = require("./Achievement");

const tableName = "assertion";
const Assertion = sequelize.define(
  "Assertion",
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
    credits_earned: {
      type: Sequelize.STRING,
    },
    end_date: {
      type: Sequelize.DATE,
    },
    endorsements: {
      type: Sequelize.ARRAY(Sequelize.UUID),
    },
    evidence: {
      type: Sequelize.ARRAY(Sequelize.UUID),
    },
    image: {
      type: Sequelize.STRING,
    },
    issued_on: {
      type: Sequelize.DATE,
    },
    license_number: {
      type: Sequelize.STRING,
    },
    narrative: {
      type: Sequelize.STRING,
    },
    recipient: {
      type: Sequelize.STRING,
    },
    results: {
      type: Sequelize.ARRAY(Sequelize.UUID),
    },
    revocation_reason: {
      type: Sequelize.STRING,
    },
    revoked: {
      type: Sequelize.BOOLEAN,
    },
    role: {
      type: Sequelize.STRING,
    },
    signed_endorsements: {
      type: Sequelize.ARRAY(Sequelize.TEXT),
    },
    source: {
      type: Sequelize.UUID,
    },
    start_date: {
      type: Sequelize.DATE,
    },
    term: {
      type: Sequelize.STRING,
    },
  },
  { tableName, timestamps: false }
);

Verification.hasOne(Assertion, { foreignKey: "verification" });
Assertion.belongsTo(Verification, { foreignKey: "verification" });

Achievement.hasOne(Assertion, { foreignKey: "achievement" });
Assertion.belongsTo(Achievement, { foreignKey: "achievement" });

module.exports = { Assertion };
