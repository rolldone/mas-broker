import Database from "@root/config/Database";
import { Sequelize, Model, DataTypes } from "sequelize";

const sequelize = new Sequelize(Database.main);

class User extends Model {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public first_name!: string;
  public last_name!: string | null; // for nullable fields
}

User.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  first_name: {
    type: new DataTypes.STRING(255),
    allowNull: false
  },
  last_name: {
    type: new DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: "users",
  sequelize, // passing the `sequelize` instance is required
});

/** Example  */
/* async function doStuffWithUserModel() {
  const newUser = await User.create({
    name: "Johnny",
    preferredName: "John",
  });
  console.log(newUser.id, newUser.first_name, newUser.last_name);

  const foundUser = await User.findOne({ where: { name: "Johnny" } });
  if (foundUser === null) return;
  console.log(foundUser.name);
} */