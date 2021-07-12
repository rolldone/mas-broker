import EventModel, { EventModelInterface } from "@root/app/member/models/EventModel";
import Event from "@root/models/Event";
export const EVENT_STATUS = {
  OFF: 0,
  ON: 1
} 
export default EventModel.extend<EventModelInterface>({
  model : Event
});