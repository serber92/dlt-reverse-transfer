const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const { Verification } = require("./Verification");
const { Address } = require("./Address");
const tableName = "profile";
const Profile = sequelize.define(
  "Profile",
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
    birthdate: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
    email: {
      type: Sequelize.STRING,
    },
    endorsements: {
      type: Sequelize.ARRAY(Sequelize.UUID),
    },
    image: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    revocation_list: {
      type: Sequelize.STRING,
    },
    signed_endorsements: {
      type: Sequelize.ARRAY(Sequelize.TEXT),
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
  },
  { tableName, timestamps: false }
);

Verification.hasOne(Profile, { foreignKey: "verification" });
Address.hasOne(Profile, { foreignKey: "address" });

Profile.belongsTo(Verification, { foreignKey: "verification" });
Profile.belongsTo(Address, { foreignKey: "address" });

module.exports = { Profile };
