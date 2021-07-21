import AdapterEventModel, { AdapterEventModelInterface as MemberAdapterEventModelInterface, ADAPTER_EVENT_STATUS} from "@root/app/member/models/AdapterEventModel";
import AdapterEvent from "../sequelize/AdapterEvent";

export {
  ADAPTER_EVENT_STATUS
}

export interface AdapterEventModelInterface extends MemberAdapterEventModelInterface{}
export default AdapterEventModel.extend<AdapterEventModelInterface>({
  model : AdapterEvent
})