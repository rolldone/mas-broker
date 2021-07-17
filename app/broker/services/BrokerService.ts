import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { Broker, BrokerEvent } from "@root/models";
import BrokerModel, { BrokerModelInterface, BROKER_STATUS } from "../models/BrokerModel";

export interface BrokerServiceInterface extends BaseServiceInterface {
  returnBrokerModel?: { (): BrokerModelInterface }
  generateBroker?: { (props: any): Promise<any> }
  generateAllBrokers?: { (): Promise<any> }
  removeBroker?: { (props: any): Promise<any> }
  getBrokers?: { (props: any): Promise<any> }
  getBroker?: { (props: any): Promise<any> }
}

declare var masterData: MasterDataInterface

export default BaseService.extend<BrokerServiceInterface>({
  returnBrokerModel: function () {
    return BrokerModel.create();
  },
  generateBroker: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        user_id: 'required',
        group_id: "required",
        id: 'required',
        broker_key: 'required',
        config: 'required',
        access_name: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      masterData.saveData('adapter.connection.' + props.access_name.toLowerCase() + '.connect', props);
    } catch (ex) {
      throw ex;
    }
  },
  generateAllBrokers: async function () {
    try {
      let brokerModel = this.returnBrokerModel();
      let resData = await brokerModel.get({
        where: {
          status: BROKER_STATUS.ON
        },
        include : [{
          model : BrokerEvent,
          as : 'broker_events',
          include : [{
            model : Broker,
            as : 'broker'
          }]
        }]
      });
      resData = brokerModel.getJSON(resData);
      for (var a = 0; a < resData.length; a++) {
        masterData.saveData('adapter.connection.'+resData[a].access_name.toLowerCase()+'.connect',resData[a]);
      }
    } catch (ex) {
      throw ex;
    }
  }
});