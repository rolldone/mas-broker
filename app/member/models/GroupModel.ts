import BaseModel, { BaseModelInterface } from "@root/base/BaseModel";
import Group from "@root/models/Group";

export interface GroupModelInterface extends BaseModelInterface{

}

const GroupModel = BaseModel.extend<GroupModelInterface>({
  model : Group
});

export default GroupModel;