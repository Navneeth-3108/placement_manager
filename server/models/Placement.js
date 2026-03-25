const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Placement = sequelize.define(
  'Placement',
  {
    PlaceID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    AppID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: {
        name: 'uq_placement_appid',
        msg: 'Each application can only have one placement record',
      },
      references: {
        model: 'Application',
        key: 'AppID',
      },
    },
    OfferDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: { msg: 'OfferDate must be a valid date' },
      },
    },
    JoiningDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: { msg: 'JoiningDate must be a valid date' },
      },
    },
  },
  {
    tableName: 'Placement',
  }
);

module.exports = Placement;
