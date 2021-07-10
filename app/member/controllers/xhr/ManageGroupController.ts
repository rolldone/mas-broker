import { AuthInterface } from "@root/app/main/compute/Auth";
import BaseController from "@root/base/BaseController";
import { Response, Request } from "express";
import GroupService, { GroupServiceInterface } from "../../services/GroupService";

declare var Auth : AuthInterface;

export interface ManageGroupControllerInterface extends BaseControllerInterface {
  returnGroupService?: { (): GroupServiceInterface }
  getGroups: { (req: Request, res: Response): void }
  getGroup: { (req: Request, res: Response): void }
  addGroup: { (req: Request, res: Response): void }
  updateGroup: { (req: Request, res: Response): void }
  deleteGroup: { (req: Request, res: Response): void }
}

const ManageGroupController = BaseController.extend<ManageGroupControllerInterface>({
  returnGroupService: function () {
    return GroupService.create();
  },
  getGroups: async function (req, res) {
    try{
      let props = req.query;
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let groupService = this.returnGroupService();
      let resData = await groupService.getGroups(props);
      resData = {
        status : 'success',
        status_code : 200,
        return : resData
      }
      return res.status(resData.status_code).json(resData);
    }catch(ex){
      return this.returnSimpleError(ex,res);
    }
  },
  getGroup: async function (req, res) {
    try{
      let props = req.query;
      props.id = req.params.id;
      let groupService = this.returnGroupService();
      let resData = await groupService.getGroup(props);
      resData = {
        status : 'success',
        status_code : 200,
        return : resData
      }
      return res.status(resData.status_code).json(resData);
    }catch(ex){
      return this.returnSimpleError(ex,res);
    }
  },
  addGroup: async function (req, res) {
    try{
      let props = req.body;
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let groupService = this.returnGroupService();
      let resData = await groupService.addGroup(props);
      resData = {
        status : 'success',
        status_code : 200,
        return : resData
      }
      return res.status(resData.status_code).json(resData);
    }catch(ex){
      return this.returnSimpleError(ex,res);
    }
  },
  updateGroup: async function (req, res) {
    try{
      let props = req.body;
      let user = await Auth.getAuth() as any;
      props.user_id = user.id;
      let groupService = this.returnGroupService();
      let resData = await groupService.updateGroup(props);
      resData = {
        status : 'success',
        status_code : 200,
        return : resData
      }
      return res.status(resData.status_code).json(resData);
    }catch(ex){
      return this.returnSimpleError(ex,res);
    }
  },
  deleteGroup: async function (req, res) {
    try{
      let props = req.query;
      let groupService = this.returnGroupService();
      let resData = await groupService.deleteGroup(props);
      resData = {
        status : 'success',
        status_code : 200,
        return : resData
      }
      return res.status(resData.status_code).json(resData);
    }catch(ex){
      return this.returnSimpleError(ex,res);
    }
  }
});

export default ManageGroupController;