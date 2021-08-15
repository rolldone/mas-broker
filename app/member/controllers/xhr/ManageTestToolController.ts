import { AuthInterface } from "@root/app/main/compute/Auth";
import BaseController from "@root/base/BaseController";
import { Request, Response } from 'express';
import TestToolService, { TestToolServiceInterface } from "../../services/TestToolService";

export interface TestToolControllerInterface extends BaseControllerInterface {
  returnTestToolService: { (): TestToolServiceInterface }
  addTestTool?: { (req: Request, res: Response): Promise<any> }
  updateTestTool?: { (req: Request, res: Response): Promise<any> }
  deleteTestTool?: { (req: Request, res: Response): Promise<any> }
  getTestTools?: { (req: Request, res: Response): Promise<any> }
  getTestTool?: { (req: Request, res: Response): Promise<any> }
}

declare let Auth: AuthInterface;

const ManageTestToolController = BaseController.extend<TestToolControllerInterface>({
  returnTestToolService: function () {
    return TestToolService.create();
  },
  getTestTools: async function (req, res) {
    try {
      let props = this.getBaseQuery(req, {});
      let testToolService = this.returnTestToolService();
      let user : any = await Auth.getAuth();
      props.user_id = user.id;
      let resData = await testToolService.getTestTools(props);
      resData = {
        status: 'success',
        status_code: 200,
        return: resData
      }
      return res.status(resData.status_code).json(resData);
    } catch (ex) {
      return this.returnSimpleError(ex, res);
    }
  },
  getTestTool: async function (req, res) {
    try {
      let props = this.getBaseQuery(req, {
        id: req.params.id
      });
      let testToolService = this.returnTestToolService();
      let resData = await testToolService.getTestTool(props);
      resData = {
        status: 'success',
        status_code: 200,
        return: resData
      }
      return res.status(resData.status_code).json(resData);
    } catch (ex) {
      return this.returnSimpleError(ex, res);
    }
  },
  addTestTool: async function (req, res) {
    try {
      let props = req.body;
      let testToolService = this.returnTestToolService();
      let resData = await testToolService.addTestTool(props);
      resData = {
        status: 'success',
        status_code: 200,
        return: resData
      }
      return res.status(resData.status_code).json(resData);
    } catch (ex) {
      return this.returnSimpleError(ex, res);
    }
  },
  updateTestTool: async function (req, res) {
    try {
      let props = req.body;
      let testToolService = this.returnTestToolService();
      let resData = await testToolService.updateTestTool(props);
      resData = {
        status: 'success',
        status_code: 200,
        return: resData
      }
      return res.status(resData.status_code).json(resData);
    } catch (ex) {
      return this.returnSimpleError(ex, res);
    }
  },
  deleteTestTool: async function (req, res) {
    try {
      let props = req.body;
      let testToolService = this.returnTestToolService();
      let resData = await testToolService.deleteTestTool(props);
      resData = {
        status: 'success',
        status_code: 200,
        return: resData
      }
      return res.status(resData.status_code).json(resData);
    } catch (ex) {
      return this.returnSimpleError(ex, res);
    }
  }
});

export default ManageTestToolController;