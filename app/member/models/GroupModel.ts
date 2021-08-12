import BaseModel, { BaseModelInterface } from "@root/base/BaseModel";
import { Group } from "@root/sequelize/models";

export interface GroupModelInterface extends BaseModelInterface{}

const GroupModel = BaseModel.extend<GroupModelInterface>({
  model : Group,
  _nest : true
});

export default GroupModel;