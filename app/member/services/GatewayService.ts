import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { AdapterEvent, Group, User } from "@root/models";
import GatewayModel, { GatewayModelInterface } from "../models/GatewayModel";

export interface GatewayServiceInterface extends BaseServiceInterface {
  returnGatewayModel?: { (): GatewayModelInterface }
  addGateway?: { (props: any): Promise<any> }
  updateGateway?: { (props: any): Promise<any> }
  deleteGateway?: { (props: any): Promise<any> }
  getGateways?: { (props: any): Promise<any> }
  getTypeGateway?: { (): void }
  getTypeListGateway?: { (props: any): void }
  getGateway?: { (props: any): Promise<any> }
  getMiddlewareCollections?: { (props: any): Promise<any> }
}

declare var masterData: MasterDataInterface;

export default BaseService.extend<GatewayServiceInterface>({
  returnGatewayModel: function () {
    return GatewayModel.create();
  },
  getMiddlewareCollections: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        type: 'required',
        access_name: 'required'
      })
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let middleware: { [key: string]: any } = {};
      let middlewareName = [];
      switch (props.type) {
        case 'sender':
          middleware = masterData.getData('gateway.middleware.senders', {}) as any;
          for (var key in middleware) {
            if (key == props.access_name) {
              for (var key2 in middleware[key]) {
                middlewareName.push(key2);
              }
            }
          }
          return middlewareName;
        case 'receiver':
          middleware = masterData.getData('gateway.middleware.receivers', {}) as any;
          for (var key in middleware) {
            if (key == props.access_name) {
              for (var key2 in middleware[key]) {
                middlewareName.push(key2);
              }
            }
          }
          return middlewareName;
      }
    } catch (ex) {
      throw ex;
    }
  },
  addGateway: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        user_id: 'required',
        group_id: 'required',
        sender_id: 'required',
        receiver_id: 'required',
        sender_name: 'required',
        receiver_name: 'required',
        status: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let gatewayModel = this.returnGatewayModel();
      let resData = await gatewayModel.save(props);
      resData = gatewayModel.getJSON(resData);

      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  updateGateway: async function (props) {
    try {
      let validation = this.returnValidator(props, {});
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let gatewayModel = this.returnGatewayModel();
      let resData = await gatewayModel.update(props);
      resData = gatewayModel.getJSON(resData);

      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  deleteGateway: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        ids: 'required',
        user_id: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let ids = JSON.parse(props.ids);
      let gatewayModel = this.returnGatewayModel();
      let resData = await gatewayModel.delete({
        where: {
          id: ids,
          user_id: props.user_id
        }
      })
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  getTypeGateway: async function () {
    return [AdapterEvent.name, Event.name];
  },
  getTypeListGateway: async function (props) {

  },
  getGateways: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        user_id: 'required',
        group_id: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let gatewayModel = this.returnGatewayModel();
      let where = gatewayModel.getJSON(props);
      let resData = await gatewayModel.get({
        where: where,
        include: [{
          model: User,
          as: 'user'
        }, {
          model: Group,
          as: 'group'
        }]
      });
      resData = gatewayModel.getJSON(resData);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  getGateway: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        id: 'required',
        user_id: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let gatewayModel = this.returnGatewayModel();
      let where = gatewayModel.getJSON({
        user_id: props.user_id,
        id: props.id
      });
      let resData = await gatewayModel.first({
        where: where,
        include: [{
          model: User,
          as: 'user'
        }, {
          model: Group,
          as: 'group'
        }]
      })
      resData = gatewayModel.getJSON(resData);
      return resData;
    } catch (ex) {
      throw ex;
    }
  }
});