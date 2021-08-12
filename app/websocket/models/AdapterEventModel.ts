import AdapterEventModel, { AdapterEventModelInterface as MemberAdapterEventModelInterface} from "@root/app/member/models/AdapterEventModel";
import { AdapterEvent } from "@root/sequelize/models";
export const ADAPTER_EVENT_STATUS = {
  OFF: 0,
  ON: 1
} 
export interface AdapterEventModelInterface extends MemberAdapterEventModelInterface{}
export default AdapterEventModel.extend<AdapterEventModelInterface>({
  model : AdapterEvent
})