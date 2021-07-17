import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import EventModel, { EventModelInterface } from "../models/EventModel";

declare var masterData: MasterDataInterface

export interface EventServiceInterface extends BaseServiceInterface {
  returnEventModel?: { (): EventModelInterface }
  getEvents?: { (props: any): Promise<any> }
  getEvent?: { (props: any): Promise<any> }
  addEvent?: { (props: any): Promise<any> }
  updateEvent?: { (props: any): Promise<any> }
  deleteEvent?: { (props: any): Promise<any> }
}

const EventService = BaseService.extend<EventServiceInterface>({
  returnEventModel: function () {
    return EventModel.create();
  },
  getEvents: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        user_id: 'required',
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let eventModel = this.returnEventModel();
      let resData = await eventModel.get({
        user_id: props.user_id
      });
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  getEvent: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        user_id: 'required',
        id: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let eventModel = this.returnEventModel();
      let resData = await eventModel.first({
        where: {
          user_id: props.user_id,
          id: props.id
        }
      });
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  addEvent: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        user_id: 'required',
        group_id: 'required',
        event_key: 'required',
        description: 'required',
        name: 'required',
        status: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let eventModel = this.returnEventModel();
      let resData = await eventModel.save(props);
      masterData.saveData('adapter.event.generate', resData);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  updateEvent: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        id: 'required',
        user_id: 'required',
        group_id: 'required',
        event_key: 'required',
        description: 'required',
        name: 'required',
        status: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let eventModel = this.returnEventModel();
      let resData = await eventModel.update(props);
      if (props.status == 0) {
        masterData.saveData('adapter.event.stop', resData);
      } else {
        masterData.saveData('adapter.event.start', resData);
      }
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  deleteEvent: async function (props) {
    try {
      let validation = this.returnValidator(props, {});
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      masterData.saveData('adapter.event.delete', props);
      return props;
    } catch (ex) {
      throw ex;
    }
  }
});

export default EventService;