import AdapterEventModel, { AdapterEventModelInterface as AdapterAdapterEventModelInterface } from "@root/app/adapter/models/AdapterEventModel";
import { AdapterEvent } from "@root/sequelize/models";


export interface AdapterEventModelInterface extends AdapterAdapterEventModelInterface { }
export const ADAPTER_EVENT_STATUS = {
  OFF: 0,
  ON: 1
}
export default AdapterEventModel.extend<AdapterEventModelInterface>({
  model: AdapterEvent
});