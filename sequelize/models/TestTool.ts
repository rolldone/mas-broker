import DatabaseConfig from "@root/config/DatabaseConfig";
import { Sequelize, Model, DataTypes } from "sequelize";

const sequelize = new Sequelize(DatabaseConfig);

class TestTool extends Model { }

TestTool.init({
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
  name: {
    type: new DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: new DataTypes.STRING(255),
    allowNull: true
  },
  from_ad_event_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  to_ad_event_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  }
}, {
  tableName: 'test_tools',
  sequelize
});

export default TestTool;