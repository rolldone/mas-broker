import { MasterDataInterface } from "@root/bootstrap/StartMasterData";

declare var masterData:MasterDataInterface;
export default function (props:any,done:Function,next: Function) {
  next(props);
}