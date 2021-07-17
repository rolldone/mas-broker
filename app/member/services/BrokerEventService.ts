import BaseService from "@root/base/BaseService";
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
      let resData = await BrokerEventModel.save(props);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  updateEvent: async function (props) {
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
      let resData = await brokerEventModel.update(props);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  deleteEvent: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        ids: 'required'
      })
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let ids = JSON.parse(props.ids);
      let brokerEventModel = this.returnBrokerEventModel();
      let resData = await BrokerEventModel.delete({
        where: {
          id: ids
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

      let resData = await brokerEventModel.first({
        where: {
          id: props.id,
          user_id: props.user_id,
          broker_id: props.broker_id,
          group_id: props.group_id
        },
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
        where : where,
        include : [{
          model : Broker,
          as : 'broker'
        },{
          model : Group,
          as : 'group'
        },{
          model : User,
          as : 'user'
        }]
      });
      resData = brokerEventModel.getJSON(resData);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
});