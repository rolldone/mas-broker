import BaseModel, { BaseModelInterface } from "@root/base/BaseModel";

export interface DeviceModelInterface extends BaseModelInterface{

}

const DeviceModel = BaseModel.extend<DeviceModelInterface>({
  model : ''
});

export default DeviceModel