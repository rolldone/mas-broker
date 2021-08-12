import AdapterModel, { AdapterModelInterface as AdapterAdapterModelInterface, ADAPTER_STATUS } from "@root/app/adapter/models/AdapterModel";
import { Adapter } from "@root/sequelize/models";

export interface AdapterModelInterface extends AdapterAdapterModelInterface{};

export {
  ADAPTER_STATUS
}
export default AdapterModel.extend<AdapterModelInterface>({
  model : Adapter
});