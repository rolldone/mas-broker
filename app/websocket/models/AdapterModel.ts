import AdapterModel, { AdapterModelInterface } from "@root/app/adapter/models/AdapterModel";
import { Adapter } from "@root/models";

export default AdapterModel.extend<AdapterModelInterface>({
  model : Adapter
});