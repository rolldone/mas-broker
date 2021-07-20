import DataManipulate, { DataManipulateInterface as MainDataManipulateInterface} from "@root/app/main/compute/DataManipulate";

export interface DataManipulateInterface extends MainDataManipulateInterface{}
export default DataManipulate.extend<DataManipulateInterface>({});