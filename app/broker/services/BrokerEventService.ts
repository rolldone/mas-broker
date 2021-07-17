import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";

export interface BrokerEventServiceInterface extends BaseServiceInterface {
  addBrokerEvent?: { (props: any): Promise<any> }
  deleteBrokerEvent?: { (props: any): Promise<any> }
  getBrokerEvent?: { (props: any): Promise<any> }
  getBrokerEvents?: { (props: any): Promise<any> }
}

declare var masterData : MasterDataInterface;

export default BaseService.extend<BrokerEventServiceInterface>({
  addBrokerEvent: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        id: 'required',
        broker_id: 'required',
        group_id: 'required',
        user_id: 'required',
        broker:'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', JSON.stringify(validation.errors.errors));
      }
      masterData.saveData('adapter.connection.'+props.broker.access_name.toLowerCase()+'.event.start',props);
    } catch (ex) {
      throw ex;
    }
  },
  deleteBrokerEvent: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        id: 'required',
        broker_id: 'required',
        group_id: 'required',
        user_id: 'required',
        broker:'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', JSON.stringify(validation.errors.errors));
      }
      masterData.saveData('adapter.connection.'+props.broker.access_name.toLowerCase()+'.event.delete',props);
    } catch (ex) {
      throw ex;
    }
  },
  getBrokerEvent: async function (props) {
    try {

    } catch (ex) {
      throw ex;
    }
  },
  getBrokerEvents: async function (props) {
    try {

    } catch (ex) {
      throw ex;
    }
  },
})