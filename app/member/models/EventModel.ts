import BaseModel, { BaseModelInterface } from "@root/base/BaseModel";
import { Event, Group } from "@root/models";


export interface EventModelInterface extends BaseModelInterface{

}

Event.belongsTo(Group,{
  foreignKey : 'group_id',
  as : 'group'
});

const EventModel = BaseModel.extend<EventModelInterface>({
  model : Event,
  _nest : true
});

export default EventModel;