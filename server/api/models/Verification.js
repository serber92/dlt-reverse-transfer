const Sequelize = require('sequelize');

const sequelize = require('../../config/database');
const { ENUM } = require('sequelize');
const { VERIFICATIONTYPE } = require('../enums');
const tableName = 'verification';
const Verification = sequelize.define('Verification', {
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
    type: ENUM(Object.values(VERIFICATIONTYPE)),
  },
  allowed_origins: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
  },

  creator: {
    type: Sequelize.STRING,
  },

  starts_with: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
  },

  verification_property: {
    type: Sequelize.STRING,
  },
}, { tableName, timestamps: false });

module.exports = { Verification };
