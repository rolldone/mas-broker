import DatabaseConfig from "@root/config/DatabaseConfig";
import { Sequelize, Model, DataTypes } from "sequelize";

const sequelize = new Sequelize(DatabaseConfig);

class Group extends Model {
  // public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  // public user_id : number;
  // public group_key : string;
  // public name : string;
  // public description : string;
  // public status : number;
}

Group.init({
  id : {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  user_id : {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  group_key : {
    type: new DataTypes.TEXT,
    allowNull: false
  },
  name : {
    type: new DataTypes.STRING(255),
    allowNull: false
  },
  description : {
    type: new DataTypes.STRING(255),
    allowNull: true
  },
  status : {
    type: new DataTypes.TINYINT,
    allowNull: false
  },
},{
  tableName : 'groups',
  sequelize
});

export default Group;