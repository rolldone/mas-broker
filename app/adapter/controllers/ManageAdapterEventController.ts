import BaseController from "@root/base/BaseController";
import AdapterEventService, { AdapterEventServiceInterface } from "../services/AdapterEventService";

export interface ManageAdapterEventController extends BaseControllerInterface {
  returnAdapterEventService ?: {():AdapterEventServiceInterface}
  generate?: { (props: any): void }
  delete?: { (props: any): void }
  get?: { (props: any): void }
  gets?: { (props: any): void }
}

export default BaseController.extend<ManageAdapterEventController>({
  returnAdapterEventService : function(){
    return AdapterEventService.create();
  },
  generate: async function (props) {
    try{
      console.log('props',props);
      let adapterEventService = this.returnAdapterEventService();
      await adapterEventService.addAdapterEvent(props);
    }catch(ex){
      console.log('Adapter - ManageAdapterEventController - generate - ex');
    }
  },
  delete: async function (props) {
    try{
      console.log('props',props);
      let adapterEventService = this.returnAdapterEventService();
      await adapterEventService.deleteAdapterEvent(props);
    }catch(ex){
      console.log('Adapter - ManageAdapterEventController - delete - ex');
    }
  }
});