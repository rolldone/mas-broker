import AdapterModel, { AdapterModelInterface, ADAPTER_STATUS } from "@root/app/adapter/models/AdapterModel";
import { Adapter } from "@root/sequelize/models";

export {
  ADAPTER_STATUS
}
export default AdapterModel.extend<AdapterModelInterface>({
  model: Adapter
});