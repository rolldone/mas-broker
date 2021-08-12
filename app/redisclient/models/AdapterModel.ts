import AdapterModel, { AdapterModelInterface } from "@root/app/adapter/models/AdapterModel";
import { Adapter } from "@root/sequelize/models";

export default AdapterModel.extend<AdapterModelInterface>({
  model : Adapter
});