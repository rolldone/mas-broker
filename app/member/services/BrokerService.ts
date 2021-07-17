import BrokerModel, { ACCESS_NAME, ACCESS_CONFIG, BrokerModelInterface, BROKER_STATUS } from "@root/app/broker/models/BrokerModel";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import { User } from "@root/models";
import DataManipulate from "../compute/DataManipulate";
import BaseService from "./BaseService";

export interface BrokerServiceInterface extends BaseServiceInterface {
  returnBrokerModel?: { (): BrokerModelInterface }
  addBroker?: { (props: any): Promise<any> }
  updateBroker?: { (props: any): Promise<any> }
  deleteBroker?: { (props: any): Promise<any> }
  getBrokers?: { (props: any): Promise<any> }
  getBroker?: { (props: any): Promise<any> }
  getAccessFormats?: { (): Promise<any> }
}

declare var masterData: MasterDataInterface

export default BaseService.extend<BrokerServiceInterface>({
  returnBrokerModel: function () {
    return BrokerModel.create();
  },
  addBroker: async function (props) {
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
      props.broker_key = DataManipulate.generateMd5(props.user_id + ' ' + props.name + ' ' + new Date().getUTCMilliseconds());
      let brokerModel = this.returnBrokerModel();
      let resData = await brokerModel.save(props);
      resData = brokerModel.getJSON(resData);
      /* Go to broker module to install new broker */
      masterData.saveData('broker.install', resData);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  updateBroker: async function (props) {
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
      let brokerModel = this.returnBrokerModel();
      let resData = await brokerModel.update(props);
      resData = await this.getBroker({
        id : resData.id,
        user_id : resData.user_id
      });
      /* Go to broker module to install new broker */
      if (resData.status == BROKER_STATUS.OFF) {
        masterData.saveData('broker.uninstall', resData);
      } else {
        masterData.saveData('broker.uninstall', resData);
        setTimeout(() => {
          masterData.saveData('broker.install', resData);
        }, 2000);
      }
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  deleteBroker: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        user_id: 'required',
        broker_key: 'required',
        name: 'required',
        status: 'required',
        access_name: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }

    } catch (ex) {
      throw ex;
    }
  },
  getBrokers: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        user_id: 'required',
        group_id: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let brokerModel = this.returnBrokerModel();
      let resData = await brokerModel.get({
        where: {
          user_id: props.user_id,
          group_id: props.group_id
        },
        include: [{
          model: User,
          as: 'user',
          attributes: {
            exclude: ['password']
          }
        }]
      });
      resData = brokerModel.getJSON(resData);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  getBroker: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        id: 'required',
        user_id: "required"
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let brokerModel = this.returnBrokerModel();
      brokerModel.nest = true;
      let resData = await brokerModel.first({
        where: {
          id: props.id,
          user_id: props.user_id
        }
      });
      resData = brokerModel.getJSON(resData);
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