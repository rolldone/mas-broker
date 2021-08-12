import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { Adapter, AdapterEvent } from "@root/sequelize/models";
import AdapterModel, { AdapterModelInterface, ADAPTER_STATUS } from "../models/AdapterModel";

export interface AdapterServiceInterface extends BaseServiceInterface {
  returnAdapterModel?: { (): AdapterModelInterface }
  generateAdapter?: { (props: any): Promise<any> }
  generateAllAdapters?: { (): Promise<any> }
  removeAdapter?: { (props: any): Promise<any> }
  getAdapters?: { (props: any): Promise<any> }
  getAdapter?: { (props: any): Promise<any> }
}

declare var masterData: MasterDataInterface

export default BaseService.extend<AdapterServiceInterface>({
  returnAdapterModel: function () {
    return AdapterModel.create();
  },
  generateAdapter: function (props) {
    return new Promise(async (resolve: Function, reject: Function) => {
      try {
        let validation = this.returnValidator(props, {
          user_id: 'required',
          group_id: "required",
          id: 'required',
          adapter_key: 'required',
          config: 'required',
          access_name: 'required'
        });
        switch (await validation.check()) {
          case validation.fails:
            throw global.CustomError('error.validation', JSON.stringify(validation.errors.errors));
        }
        masterData.saveData('adapter.connection.' + props.access_name.toLowerCase() + '.connect', props);
        masterData.setOnListener('adapter.connection.' + props.access_name.toLowerCase() + '.connect.response', function (err: any) {
          if (err != null) {
            return reject(err);
          }
          resolve(props);
        })
      } catch (ex) {
        reject(ex);
      }
    })
  },
  removeAdapter: function (props) {
    return new Promise(async (resolve: Function, reject: Function) => {
      try {
        let validation = this.returnValidator(props, {
          user_id: 'required',
          group_id: "required",
          id: 'required',
          adapter_key: 'required',
          config: 'required',
          access_name: 'required'
        });
        switch (await validation.check()) {
          case validation.fails:
            throw global.CustomError('error.validation', validation.errors.errors);
        }
        masterData.saveData('adapter.connection.' + props.access_name.toLowerCase() + '.disconect', props);
        masterData.setOnListener('adapter.connection.' + props.access_name.toLowerCase() + '.disconect.response', function (err: any) {
          if (err != null) {
            return reject(err);
          }
          resolve(props);
        })
      } catch (ex) {
        reject(ex);
      }
    });
  },
  generateAllAdapters: async function () {
    try {
      let adapterModel = this.returnAdapterModel();
      let resData = await adapterModel.get({
        where: {
          status: ADAPTER_STATUS.ON
        },
        include: [{
          model: AdapterEvent,
          as: 'adapter_events',
          include: [{
            model: Adapter,
            as: 'adapter'
          }]
        }]
      });
      resData = adapterModel.getJSON(resData);
      for (var a = 0; a < resData.length; a++) {
        masterData.saveData('adapter.connection.' + resData[a].access_name.toLowerCase() + '.connect', resData[a]);
      }
    } catch (ex) {
      throw ex;
    }
  }
});