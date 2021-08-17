import BaseController from "@root/base/BaseController"
import TestToolService, { TestToolServiceInterface } from "../services/TestToolService";

export interface ManageTestToolControllerInterface extends BaseControllerInterface {
  returnTestToolService: { (): TestToolServiceInterface }
  startTestTool: { (props: any): void }
}

export default BaseController.extend<ManageTestToolControllerInterface>({
  returnTestToolService: function () {
    return TestToolService.create();
  },
  startTestTool : function(props){
    try{
      let testToolService = this.returnTestToolService();
      let resData = testToolService.startTestTool(props);
    }catch(ex){
      console.error('startTestTool - ex ',ex);
    }
  }
});