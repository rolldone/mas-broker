import EventModel, { EventModelInterface } from "@root/app/member/models/EventModel";
import Event from "@root/models/Event";

export default EventModel.extend<EventModelInterface>({
  model : Event
});