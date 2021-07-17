const Database = require('../sequelize/Database');
import { Sequelize, Model, DataTypes } from "sequelize";

const sequelize = new Sequelize(Database.main);

class AdapterEvent extends Model {

}

AdapterEvent.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  group_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  adapter_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  event_key: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false
  },
}, {
  tableName: 'adapter_events',
  sequelize
});

export default AdapterEvent;