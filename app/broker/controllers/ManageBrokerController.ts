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

    } catch (ex) {
      console.log('installBroker - ex ', ex);
    }
  },
  updateBroker: async function (props) {
    try {
      let brokerService = this.returnBrokerService();

    } catch (ex) {
      console.log('updateBroker - ex ', ex);
    }
  },
  uninstallBroker: async function (props) {
    try {
      let brokerService = this.returnBrokerService();

    } catch (ex) {
      console.log('uninstallBroker - ex ', ex);
    }
  },
  getBrokers: async function (props) {
    try {
      let brokerService = this.returnBrokerService();

    } catch (ex) {
      console.log('getBrokers - ex ', ex);
    }
  },
  getBroker: async function (props) {
    try {
      let brokerService = this.returnBrokerService();

    } catch (ex) {
      console.log('getBroker - ex ', ex);
    }
  },
  startAll: async function(){
    try{
      let brokerService = this.returnBrokerService();
      let resData = await brokerService.generateAllBrokers();
      return resData;
    }catch(ex){
      console.log('startAll - ex ',ex);
    }
  }
});