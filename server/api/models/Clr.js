const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const tableName = "clr";
const Clr = sequelize.define(
  "Clr",
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
  },
  { tableName, timestamps: false }
);

module.exports = { Clr };
