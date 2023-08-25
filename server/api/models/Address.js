const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const tableName = "address";
const Address = sequelize.define(
  "Address",
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
      type: Sequelize.ARRAY(Sequelize.TEXT),
    },
    type: {
      type: Sequelize.STRING,
    },
    address_country: {
      type: Sequelize.STRING,
    },
    address_locality: {
      type: Sequelize.STRING,
    },
    address_region: {
      type: Sequelize.STRING,
    },
    postal_code: {
      type: Sequelize.STRING,
    },
    post_office_box_number: {
      type: Sequelize.STRING,
    },
    street_address: {
      type: Sequelize.STRING,
    },
  },
  { tableName, timestamps: false }
);

module.exports = { Address };
