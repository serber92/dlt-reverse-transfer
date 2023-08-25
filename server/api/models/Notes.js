const Sequelize = require("sequelize");

const sequelize = require("../../config/database");

const tableName = "notes";

const Notes = sequelize.define(
  "Notes",
  {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    note: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
  },
  { tableName, timestamps: false  }
);

module.exports = { Notes, sequelize };
