import BaseModel, { BaseModelInterface } from "@root/base/BaseModel";
import { Adapter, AdapterEvent, Group, User } from "@root/sequelize/models";

export const BROKER_EVENT_STATUS = {
  ON : 1,
  OFF : 0
}

export interface AdapterEventModelInterface extends BaseModelInterface{}

export default BaseModel.extend<AdapterEventModelInterface>({
  model : AdapterEvent
});