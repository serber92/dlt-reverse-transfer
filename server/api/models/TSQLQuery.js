const Sequelize = require("sequelize");

const sequelize = require("../../config/database");

const tableName = "TSQLQuery";

const TSQLQuery = sequelize.define(
  "TSQLQuery",
  {
    id: {
      primaryKey: true,
      defaultValue: Sequelize.UUIDV1,
      type: Sequelize.UUID,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    TSQL: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
  },
  { tableName, timestamps: false  }
);

module.exports = { TSQLQuery };
