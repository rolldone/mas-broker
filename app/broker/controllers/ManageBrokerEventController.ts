import BaseController from "@root/base/BaseController";
import BrokerEventService, { BrokerEventServiceInterface } from "../services/BrokerEventService";

export interface ManageBrokerEventController extends BaseControllerInterface {
  returnBrokerEventService ?: {():BrokerEventServiceInterface}
  generate?: { (props: any): void }
  delete?: { (props: any): void }
  get?: { (props: any): void }
  gets?: { (props: any): void }
}

export default BaseController.extend<ManageBrokerEventController>({
  returnBrokerEventService : function(){
    return BrokerEventService.create();
  },
  generate: async function (props) {
    try{
      console.log('props',props);
      let brokerEventService = this.returnBrokerEventService();
      await brokerEventService.addBrokerEvent(props);
    }catch(ex){
      console.log('Broker - ManageBrokerEventController - generate - ex');
    }
  },
  delete: async function (props) {
    try{
      console.log('props',props);
      let brokerEventService = this.returnBrokerEventService();
      await brokerEventService.deleteBrokerEvent(props);
    }catch(ex){
      console.log('Broker - ManageBrokerEventController - delete - ex');
    }
  },
  get: function (props) {
    try{

    }catch(ex){
      console.log('Broker - ManageBrokerEventController - get - ex');
    }
  },
  gets: function (props) {
    try{

    }catch(ex){
      console.log('Broker - ManageBrokerEventController - gets - ex');
    }
  },
});