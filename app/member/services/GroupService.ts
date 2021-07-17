import BaseService from "@root/base/BaseService";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import DataManipulate from "../compute/DataManipulate";
import GroupModel, { GroupModelInterface } from "../models/GroupModel";

declare var masterData : MasterDataInterface

export interface GroupServiceInterface extends BaseServiceInterface {
  returnGroupModel ?: {():GroupModelInterface}
  getGroups?: { (props: any): Promise<any> }
  getGroup?: { (props: any): Promise<any> }
  addGroup?: { (props: any): Promise<any> }
  updateGroup?: { (props: any): Promise<any> }
  deleteGroup?: { (props: any): Promise<any> }
}

const GroupService = BaseService.extend<GroupServiceInterface>({
  returnGroupModel : function(){
    return GroupModel.create();
  },
  getGroups: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        user_id : 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let groupModel = this.returnGroupModel();
      let resData = await groupModel.get({
        where : {
          user_id : props.user_id
        }
      });
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  getGroup: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        id : 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let groupModel = this.returnGroupModel();
      let resData = await groupModel.first(props);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  addGroup: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        user_id: 'required',
        name: 'required',
        status: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }

      let groupModel = this.returnGroupModel();
      props.group_key = DataManipulate.binding().generateMd5(props.id+'-'+props.name+"-"+new Date().getTime());
      let resData = await groupModel.save(props);
      masterData.saveData('adapter.group.generate',resData);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  updateGroup: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        id: 'required',
        user_id: 'required',
        name: 'required',
        description: 'required',
        status: 'required',
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }

      let groupModel = this.returnGroupModel();
      let resData = await groupModel.update(props);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  deleteGroup: async function (props) {

  }
});

export default GroupService;