
import DatabaseConfig from "@root/config/DatabaseConfig";
import { Sequelize, Model, DataTypes } from "sequelize";

const sequelize = new Sequelize(DatabaseConfig);

class Gateway extends Model {

}

Gateway.init({
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
  sender_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  receiver_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  sender_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  receiver_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  middleware_sender: {
    type: DataTypes.JSON,
    allowNull: true
  },
  middleware_receiver: {
    type: DataTypes.JSON,
    allowNull: true
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false
  },
}, {
  tableName: 'gateways',
  sequelize
});

export default Gateway;