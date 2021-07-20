import AdapterModel, { ACCESS_NAME as ADAPTER_ACCESS_NAME, AdapterModelInterface } from "@root/app/adapter/models/AdapterModel";
import Adapter from "../sequelize/Adapter";

export const ACCESS_NAME = ADAPTER_ACCESS_NAME;

export default AdapterModel.extend<AdapterModelInterface>({
  model : Adapter
})