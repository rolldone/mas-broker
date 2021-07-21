import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";

export interface AdapterEventServiceInterface extends BaseServiceInterface {
  addAdapterEvent?: { (props: any): Promise<any> }
  deleteAdapterEvent?: { (props: any): Promise<any> }
  getAdapterEvent?: { (props: any): Promise<any> }
  getAdapterEvents?: { (props: any): Promise<any> }
}

declare var masterData : MasterDataInterface;

export default BaseService.extend<AdapterEventServiceInterface>({
  addAdapterEvent: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        id: 'required',
        adapter_id: 'required',
        group_id: 'required',
        user_id: 'required',
        adapter:'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', JSON.stringify(validation.errors.errors));
      }
      masterData.saveData('adapter.connection.'+props.adapter.access_name.toLowerCase()+'.event.start',props);
    } catch (ex) {
      throw ex;
    }
  },
  deleteAdapterEvent: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        id: 'required',
        adapter_id: 'required',
        group_id: 'required',
        user_id: 'required',
        adapter:'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', JSON.stringify(validation.errors.errors));
      }
      masterData.saveData('adapter.connection.'+props.adapter.access_name.toLowerCase()+'.event.delete',props);
    } catch (ex) {
      throw ex;
    }
  },
  getAdapterEvent: async function (props) {
    try {
      
    } catch (ex) {
      throw ex;
    }
  },
  getAdapterEvents: async function (props) {
    try {

    } catch (ex) {
      throw ex;
    }
  },
})