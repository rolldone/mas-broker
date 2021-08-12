import AdapterModel, { AdapterModelInterface as AdapterAdapterModelInterface } from "@root/app/adapter/models/AdapterModel";
import { Adapter } from "@root/sequelize/models";

export interface AdapterModelInterface extends AdapterAdapterModelInterface { }

export default AdapterModel.extend<AdapterModelInterface>({
  model: Adapter
});