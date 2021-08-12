import { BROKER_EVENT_STATUS } from "@root/app/adapter/models/AdapterEventModel";
import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { Adapter, Group, User } from "@root/sequelize/models";
import AdapterEventModel, { AdapterEventModelInterface } from "../models/AdapterEventModel";

export interface AdapterEventServiceInterface extends BaseServiceInterface {
  returnAdapterEventModel?: { (): AdapterEventModelInterface }
  addEvent?: { (props: any): Promise<any> }
  updateEvent?: { (props: any): Promise<any> }
  deleteEvent?: { (props: any): Promise<any> }
  getEvent?: { (props: any): Promise<any> }
  getEvents?: { (props: any): Promise<any> }
}

declare var masterData: MasterDataInterface

export default BaseService.extend<AdapterEventServiceInterface>({
  returnAdapterEventModel: function () {
    return AdapterEventModel.create();
  },
  addEvent: async function (props) {
    try {
      let validation = this.returnValidator(props, {})
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let adapterEventModel = this.returnAdapterEventModel();
      let resData = await adapterEventModel.save(props);
      resData = adapterEventModel.getJSON(resData);
      resData = await this.getEvent(resData) as any;
      masterData.saveData('adapter.event.generate', resData);
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
        let adapterEventModel = this.returnAdapterEventModel();
        let adapterEvent = await this.getEvent(props);
        if (adapterEvent == null) {
          throw global.CustomError('error.not_found', 'Adapter event is not found!');
        }
        masterData.saveData('adapter.event.delete', adapterEvent);
        setTimeout(async () => {
          let resData = await adapterEventModel.update(props);
          resData = adapterEventModel.getJSON(resData);
          resData = await this.getEvent(resData) as any;
          if (resData.status == BROKER_EVENT_STATUS.OFF) {
            return resolve(resData);
          }
          masterData.saveData('adapter.event.generate', resData);
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
        let adapterEventItem = await this.getEvent({
          id: ids[a],
          user_id: props.user_id
        }) as any;
        if (adapterEventItem != null) {
          masterData.saveData('adapter.event.delete', adapterEventItem);
        }
      }
      let adapterEventModel = this.returnAdapterEventModel();
      let resData = await adapterEventModel.delete({
        where: {
          id: ids,
          user_id: props.user_id
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
      let adapterEventModel = this.returnAdapterEventModel();

      let where = adapterEventModel.getJSON({
        id: props.id,
        user_id: props.user_id,
        group_id: props.group_id
      });
      let resData = await adapterEventModel.first({
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
            model: Adapter,
            as: 'adapter'
          },
          {
            model: Group,
            as: 'group'
          }
        ]
      })
      resData = adapterEventModel.getJSON(resData);
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
      let adapterEventModel = this.returnAdapterEventModel();
      let where = adapterEventModel.getJSON({
        user_id: props.user_id,
        group_id: props.group_id,
        adapter_id: props.adapter_id
      });
      let order = adapterEventModel.getJSON([
        ['updatedAt', 'DESC']
      ]);
      let resData = await adapterEventModel.get({
        where: where,
        include: [{
          model: Adapter,
          as: 'adapter'
        }, {
          model: Group,
          as: 'group'
        }, {
          model: User,
          as: 'user'
        }],
        order: order,
      });
      resData = adapterEventModel.getJSON(resData);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
});