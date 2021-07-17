import BaseController from "@root/base/BaseController";
import BrokerService, { BrokerServiceInterface } from "../services/BrokerService";
export interface ManageBrokerControllerInterface extends BaseControllerInterface {
  returnBrokerService?: { (): BrokerServiceInterface }
  installBroker?: { (props: any): Promise<any> }
  updateBroker?: { (props: any): Promise<any> }
  uninstallBroker?: { (props: any): Promise<any> }
  getBrokers?: { (props: any): Promise<any> }
  getBroker?: { (props: any): Promise<any> }
  startAll?: { (): void }
}

export default BaseController.extend<ManageBrokerControllerInterface>({
  returnBrokerService: function () {
    return BrokerService.create();
  },
  installBroker: async function (props) {
    try {
      let brokerService = this.returnBrokerService();
      let resData = await brokerService.generateBroker(props);
      /* Create response via master data here */
    } catch (ex) {
      console.log('Broker - ManageBrokerController - installBroker - ex :');
      console.log(' ', ex);
    }
  },
  updateBroker: async function (props) {
    try {
      let brokerService = this.returnBrokerService();
      let resData = await brokerService.removeBroker(props);
      setTimeout(async ()=>{
        await brokerService.generateBroker(props);
      },2000);
      /* Create response via master data here */
    } catch (ex) {
      console.log('Broker - ManageBrokerController - updateBroker - ex :');
      console.log(' ', ex);
    }
  },
  uninstallBroker: async function (props) {
    try {
      let brokerService = this.returnBrokerService();
      let resData = await brokerService.removeBroker(props);
    } catch (ex) {
      console.log('Broker - ManageBrokerController - uninstallBroker - ex :');
      console.log(' ', ex);
    }
  },
  getBrokers: async function (props) {
    try {
      let brokerService = this.returnBrokerService();

    } catch (ex) {
      console.log('Broker - ManageBrokerController - getBrokers - ex :');
      console.log(' ', ex);
    }
  },
  getBroker: async function (props) {
    try {
      let brokerService = this.returnBrokerService();

    } catch (ex) {
      console.log('Broker - ManageBrokerController - getBroker - ex :');
      console.log(' ', ex);
    }
  },
  startAll: async function () {
    try {
      let brokerService = this.returnBrokerService();
      let resData = await brokerService.generateAllBrokers();
      return resData;
    } catch (ex) {
      console.log('Broker - ManageBrokerController - startAll - ex :');
      console.log(' ', ex);
    }
  }
});