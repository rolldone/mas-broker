const Database = require('../sequelize/Database');
import { Sequelize, Model, DataTypes } from "sequelize";

const sequelize = new Sequelize(Database.main);

class Event extends Model {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public user_id : number
  public group_id : number
  public event_key : string
  public description : string
  public name : string
  public status : number
}

Event.init({
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
  event_key : {
    type: new DataTypes.TEXT,
    allowNull: false
  },
  description : {
    type: new DataTypes.TEXT,
    allowNull: true
  },
  name : {
    type: new DataTypes.STRING(255),
    allowNull: false
  },
  status : {
    type: new DataTypes.TINYINT,
    allowNull: false
  },
},{
  tableName : 'events',
  sequelize
});

export default Event;