const Database = require('../sequelize/Database');
import { Sequelize, Model, DataTypes } from "sequelize";

const sequelize = new Sequelize(Database.main);

class Broker extends Model {
  
}

Broker.init({
  id : {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  user_id : {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  group_id : {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  name : {
    type: DataTypes.STRING,
    allowNull: false
  },
  broker_key : {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description : {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status : {
    type: DataTypes.TINYINT,
    allowNull: false
  },
}, {
  tableName: 'brokers',
  sequelize
});

export default Broker;