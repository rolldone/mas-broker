import { BROKER_EVENT_STATUS } from "@root/app/broker/models/BrokerEventModel";
import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { Broker, Group, User } from "@root/models";
import BrokerEventModel, { BrokerEventModelInterface } from "../models/BrokerEventModel";

export interface BrokerEventServiceInterface extends BaseServiceInterface {
  returnBrokerEventModel?: { (): BrokerEventModelInterface }
  addEvent?: { (props: any): Promise<any> }
  updateEvent?: { (props: any): Promise<any> }
  deleteEvent?: { (props: any): Promise<any> }
  getEvent?: { (props: any): Promise<any> }
  getEvents?: { (props: any): Promise<any> }
}

declare var masterData: MasterDataInterface

export default BaseService.extend<BrokerEventServiceInterface>({
  returnBrokerEventModel: function () {
    return BrokerEventModel.create();
  },
  addEvent: async function (props) {
    try {
      let validation = this.returnValidator(props, {})
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let brokerEventModel = this.returnBrokerEventModel();
      let resData = await brokerEventModel.save(props);
      resData = brokerEventModel.getJSON(resData);
      resData = await this.getEvent(resData) as any;
      masterData.saveData('broker.event.generate', resData);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  updateEvent: function (props) {
    return new Promise(async (resolve: Function, reject: Function) => {
      try {
        let validation = this.returnValidator(props, {})
        switch (await validation.check()) {
          case validation.fails:
            throw global.CustomError('error.validation', validation.errors.errors);
        }
        let brokerEventModel = this.returnBrokerEventModel();
        let brokerEvent = await this.getEvent(props);
        if (brokerEvent == null) {
          throw global.CustomError('error.not_found', 'Broker event is not found!');
        }
        masterData.saveData('broker.event.delete', brokerEvent);
        setTimeout(async () => {
          let resData = await brokerEventModel.update(props);
          resData = brokerEventModel.getJSON(resData);
          resData = await this.getEvent(resData) as any;
          if (resData.status == BROKER_EVENT_STATUS.OFF) {
            return resolve(resData);
          }
          masterData.saveData('broker.event.generate', resData);
          resolve(resData);
        }, 2000);
      } catch (ex) {
        reject(ex);
      }
    })
  },
  deleteEvent: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        ids: 'required',
        user_id: 'required'
      })
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let ids = JSON.parse(props.ids);
      for (var a = 0; a < ids.length; a++) {
        let brokerEventItem = await this.getEvent({
          id: ids[a],
          user_id: props.user_id
        }) as any;
        if(brokerEventItem != null){
          masterData.saveData('broker.event.delete', brokerEventItem);
        }
      }
      let brokerEventModel = this.returnBrokerEventModel();
      let resData = await brokerEventModel.delete({
        where: {
          id: ids,
          user_id : props.user_id
        }
      });
      
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  getEvent: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        id: 'required',
        user_id: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let brokerEventModel = this.returnBrokerEventModel();

      let where = brokerEventModel.getJSON({
        id: props.id,
        user_id: props.user_id,
        broker_id: props.broker_id,
        group_id: props.group_id
      });
      let resData = await brokerEventModel.first({
        where: where,
        include: [
          {
            model: User,
            as: 'user',
            attributes: {
              exclude: ['password']
            }
          },
          {
            model: Broker,
            as: 'broker'
          },
          {
            model: Group,
            as: 'group'
          }
        ]
      })
      resData = brokerEventModel.getJSON(resData);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  getEvents: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        user_id: 'required'
      })
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let brokerEventModel = this.returnBrokerEventModel();
      let where = brokerEventModel.getJSON({
        user_id: props.user_id,
        group_id: props.group_id,
        broker_id: props.broker_id
      });

      let resData = await brokerEventModel.get({
        where: where,
        include: [{
          model: Broker,
          as: 'broker'
        }, {
          model: Group,
          as: 'group'
        }, {
          model: User,
          as: 'user'
        }]
      });
      resData = brokerEventModel.getJSON(resData);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
});