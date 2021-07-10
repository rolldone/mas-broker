import BaseModel, { BaseModelInterface } from "@root/base/BaseModel";
import Event from "@root/models/Event";

export interface EventModelInterface extends BaseModelInterface{

}

const EventModel = BaseModel.extend<EventModelInterface>({
  model : Event
});

export default EventModel;