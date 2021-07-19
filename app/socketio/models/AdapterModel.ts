import AdapterModel, { AdapterModelInterface } from "@root/app/adapter/models/AdapterModel";
import Adapter from "../sequelize/Adapter";

export default AdapterModel.extend<AdapterModelInterface>({
  model : Adapter
});