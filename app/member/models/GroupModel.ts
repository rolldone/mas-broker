import BaseModel, { BaseModelInterface } from "@root/base/BaseModel";
import { Event, Group } from "@root/models";


export interface GroupModelInterface extends BaseModelInterface{

}

Group.hasMany(Event,{
  foreignKey : 'group_id',
  as : 'events'
});

const GroupModel = BaseModel.extend<GroupModelInterface>({
  model : Group,
  _nest : true
});

export default GroupModel;