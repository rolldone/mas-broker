import BaseService from "@root/base/BaseService";
import TestToolModel, { TestToolModelInterface } from "../models/TestToolModel";

export interface TestToolServiceInterface extends BaseServiceInterface {
  returnTestToolModel?: { (): TestToolModelInterface }
  getTestTools?: { (props: any): Promise<any> }
  getTestTool?: { (props: any): Promise<any> }
  addTestTool?: { (props: any): Promise<any> }
  updateTestTool?: { (props: any): Promise<any> }
  deleteTestTool?: { (props: any): Promise<any> }
}

const TestToolService = BaseService.extend<TestToolServiceInterface>({
  returnTestToolModel: function () {
    return TestToolModel.create();
  },
  getTestTools: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        group_id: 'required',
        user_id: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let testToolModel = this.returnTestToolModel();
      let where = testToolModel.getJSON({
        group_id: props.group_id,
        user_id: props.user_id
      });
      let resData = await testToolModel.get({
        where
      });
      return testToolModel.getJSON(resData);
    } catch (ex) {
      throw ex;
    }
  },
  getTestTool: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        id: 'required'
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let testToolModel = this.returnTestToolModel();
      let where = testToolModel.getJSON({
        id: props.id
      })
      let resData = await testToolModel.first({
        where
      });
      resData = testToolModel.getJSON(resData);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  addTestTool: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        user_id: 'required',
        group_key: 'required',
        name: 'required',
        description: 'required',
        from_ad_event_id: 'required',
        to_ad_event_id: 'required',
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let testToolModel = this.returnTestToolModel();
      let resData = await testToolModel.save({
        user_id: props.user_id,
        group_key: props.group_key,
        name: props.name,
        description: props.description,
        from_ad_event_id: props.from_ad_event_id,
        to_ad_event_id: props.to_ad_event_id,
      });
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  updateTestTool: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        id: 'required',
        user_id: 'required',
        group_key: 'required',
        name: 'required',
        description: 'required',
        from_ad_event_id: 'required',
        to_ad_event_id: 'required',
      });
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let testToolModel = this.returnTestToolModel();
      let resData = await testToolModel.first({
        where: {
          id: props.id
        }
      })
      if (resData == null) {
        throw global.CustomError('error.data_not_found', 'Test tool is not found!');
      }
      resData = await testToolModel.update({
        id: props.id,
        user_id: props.user_id,
        group_key: props.group_key,
        name: props.name,
        description: props.description,
        from_ad_event_id: props.from_ad_event_id,
        to_ad_event_id: props.to_ad_event_id,
      })
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  deleteTestTool: async function (props) {
    try {
      let validation = this.returnValidator(props, {
        ids: "required"
      })
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      let ids = JSON.parse(props.ids);
      let testToolModel = this.returnTestToolModel();
      let resData = await testToolModel.delete({
        where: {
          id: ids
        }
      });
      return resData;
    } catch (ex) {
      throw ex;
    }
  }
})

export default TestToolService;