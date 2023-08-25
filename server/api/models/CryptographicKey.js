const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const tableName = "cryptographic_key";
const CryptographicKey = sequelize.define(
  "CryptographicKey",
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
    owner: {
      type: Sequelize.UUID,
    },
    public_key_pem: {
      type: Sequelize.STRING,
    },
  },
  { tableName, timestamps: false }
);

module.exports = { CryptographicKey };
