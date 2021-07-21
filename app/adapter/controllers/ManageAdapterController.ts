import BaseController from "@root/base/BaseController";
import AdapterService, { AdapterServiceInterface } from "../services/AdapterService";
export interface ManageAdapterControllerInterface extends BaseControllerInterface {
  returnAdapterService?: { (): AdapterServiceInterface }
  installAdapter?: { (props: any): Promise<any> }
  updateAdapter?: { (props: any): Promise<any> }
  uninstallAdapter?: { (props: any): Promise<any> }
  getAdapters?: { (props: any): Promise<any> }
  getAdapter?: { (props: any): Promise<any> }
  startAll?: { (): void }
}

export default BaseController.extend<ManageAdapterControllerInterface>({
  returnAdapterService: function () {
    return AdapterService.create();
  },
  installAdapter: async function (props) {
    try {
      let adapterService = this.returnAdapterService();
      let resData = await adapterService.generateAdapter(props);
      /* Create response via master data here */
    } catch (ex) {
      console.log('Adapter - ManageAdapterController - installAdapter - ex :');
      console.log(' ', ex);
    }
  },
  updateAdapter: async function (props) {
    try {
      let adapterService = this.returnAdapterService();
      let resData = await adapterService.removeAdapter(props);
      setTimeout(async () => {
        await adapterService.generateAdapter(props);
      }, 2000);
      /* Create response via master data here */
    } catch (ex) {
      console.log('Adapter - ManageAdapterController - updateAdapter - ex :');
      console.log(' ', ex);
    }
  },
  uninstallAdapter: async function (props) {
    try {
      let adapterService = this.returnAdapterService();
      let resData = await adapterService.removeAdapter(props);
    } catch (ex) {
      console.log('Adapter - ManageAdapterController - uninstallAdapter - ex :');
      console.log(' ', ex);
    }
  },
  startAll: async function () {
    try {
      let adapterService = this.returnAdapterService();
      let resData = await adapterService.generateAllAdapters();
      return resData;
    } catch (ex) {
      console.log('Adapter - ManageAdapterController - startAll - ex :');
      console.log(' ', ex);
    }
  }
});