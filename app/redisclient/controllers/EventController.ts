import BaseController from "@root/base/BaseController";

export interface EventControllerInterface extends BaseControllerInterface{
  add ?: {(props:any):Promise<any>}
  delete ?: {(props:any):Promise<any>}
  get ?: {(props:any):Promise<any>}
}

export default BaseController.extend<EventControllerInterface>({
  add : async function(props){

  },
  delete : async function(props){

  },
  get : async function(props){

  },
});