import BaseController from "@root/base/BaseController";

export interface ManageBrokerEventController extends BaseControllerInterface {
  generate?: { (props: any): void }
  delete?: { (props: any): void }
  get?: { (props: any): void }
  gets?: { (props: any): void }
}

export default BaseController.extend<ManageBrokerEventController>({
  generate: function (props) {
    try{
      console.log('props',props);
    }catch(ex){
      console.log('Broker - ManageBrokerEventController - generate - ex');
    }
  },
  delete: function (props) {
    try{

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