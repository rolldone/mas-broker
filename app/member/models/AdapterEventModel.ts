import AdapterEventModel, { AdapterEventModelInterface as AdapterAdapterEventModelInterface} from "@root/app/adapter/models/AdapterEventModel";
import { AdapterEvent } from "@root/models";

export interface AdapterEventModelInterface extends AdapterAdapterEventModelInterface{}

export default AdapterEventModel.extend<AdapterEventModelInterface>({
  model : AdapterEvent
});