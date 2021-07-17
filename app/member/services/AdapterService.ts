import AdapterModel, { ACCESS_NAME, ACCESS_CONFIG, AdapterModelInterface, BROKER_STATUS, ADAPTER_TYPE } from "@root/app/adapter/models/AdapterModel";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { User } from "@root/models";
import DataManipulate from "../compute/DataManipulate";
import BaseService from "./BaseService";

export interface AdapterServiceInterface extends BaseServiceInterface {
  returnAdapterModel?: { (): AdapterModelInterface }
  addAdapter?: { (props: any): Promise<any> }
  updateAdapter?: { (props: any): Promise<any> }
  deleteAdapter?: { (props: any): Promise<any> }
  getAdapters?: { (props: any): Promise<any> }
  getAdapter?: { (props: any): Promise<any> }
  getAccessFormats?: { (): Promise<any> }
}

declare var masterData: MasterDataInterface

export default BaseService.extend<AdapterServiceInterface>({
  returnAdapterModel: function () {
    return AdapterModel.create();
  },
  addAdapter: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        user_id: 'required',
        name: 'required',
        status: 'required',
        access_name: 'required',
        config: 'required',
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      props.adapter_key = DataManipulate.generateMd5(props.user_id + ' ' + props.name + ' ' + props.adapter_type + ' ' + new Date().getUTCMilliseconds());
      props.adapter_type = ADAPTER_TYPE[props.access_name];
      let adapterModel = this.returnAdapterModel();
      let resData = await adapterModel.save(props);
      resData = adapterModel.getJSON(resData);
      /* Go to adapter module to install new adapter */
      masterData.saveData('adapter.install', resData);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  updateAdapter: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        user_id: 'required',
        name: 'required',
        status: 'required',
        access_name: 'required',
        config: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      /* Block data strict to update */
      let adapterModel = this.returnAdapterModel();
      props.adapter_type = ADAPTER_TYPE[props.access_name];
      let resData = await adapterModel.update(props);
      resData = await this.getAdapter({
        id: resData.id,
        user_id: resData.user_id
      });
      /* Go to adapter module to install new adapter */
      if (resData.status == BROKER_STATUS.OFF) {
        masterData.saveData('adapter.uninstall', resData);
      } else {
        masterData.saveData('adapter.uninstall', resData);
        setTimeout(() => {
          masterData.saveData('adapter.install', resData);
        }, 2000);
      }
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  deleteAdapter: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        user_id: 'required',
        adapter_key: 'required',
        name: 'required',
        status: 'required',
        access_name: 'required',
        adapter_type: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }

    } catch (ex) {
      throw ex;
    }
  },
  getAdapters: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        user_id: 'required',
        group_id: 'required',
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let adapterModel = this.returnAdapterModel();
      let where = adapterModel.getJSON({
        user_id: props.user_id,
        group_id: props.group_id,
        adapter_type : props.adapter_type
      });
      let resData = await adapterModel.get({
        where: where,
        include: [{
          model: User,
          as: 'user',
          attributes: {
            exclude: ['password']
          }
        }]
      });
      resData = adapterModel.getJSON(resData);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  getAdapter: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        id: 'required',
        user_id: "required"
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let adapterModel = this.returnAdapterModel();
      adapterModel.nest = true;
      let resData = await adapterModel.first({
        where: {
          id: props.id,
          user_id: props.user_id
        }
      });
      resData = adapterModel.getJSON(resData);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  getAccessFormats: async function () {
    return {
      ACCESS_NAME,
      ACCESS_CONFIG
    }
  }
})