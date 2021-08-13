import BaseModel, { BaseModelInterface } from "@root/base/BaseModel";
import { TestTool } from "@root/sequelize/models";

export interface TestToolModelInterface extends BaseModelInterface { }

const TestToolModel = BaseModel.extend<TestToolModelInterface>({
  model: TestTool,
  _nest: true
});

export default TestToolModel;