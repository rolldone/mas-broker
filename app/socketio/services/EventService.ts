import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import GatewayModel, { GatewayModelInterface } from "../models/GatewayModel";
import ConnectionService, { ConnectionServiceInterface } from "./ConnectionService";
const WebSocketWrapper = require('ws-wrapper');

declare var masterData: MasterDataInterface

export interface EventServiceInterface extends Omit<ConnectionServiceInterface, 'create'> {
  create?: (...props: any) => this
  returnGatewayModel?: { (): GatewayModelInterface }
  getGateways?: { (sender_id: number, props: any): Promise<any> }
  deleteSocketEvent?: { (props: any): void }
  startSocketEvents?: { (ws: any, events?: Array<any>): void }
  stopSocketEvent?: { (props: any): void }
  startSocketEvent?: { (props: any): void }
  logSocketEvent?: { (props: any): void }
  logSocketEvents?: { (props: any): void }
  emit: { (props: any): void }
}

export default ConnectionService.extend<EventServiceInterface>({
  returnGatewayModel: function () {
    return GatewayModel.create();
  },
  getGateways: async function (receiver_id, props) {
    
  },
  deleteSocketEvent: async function (props) {
    
  },
  stopSocketEvent: function (props) {
    return this.deleteSocketEvent(props);
  },
  /** Add new socket event */
  startSocketEvent: async function (props) {
    
  },
  startSocketEvents: async function (ws, events = []) {
    
  },
  logSocketEvent: function (props) {

  },
  logSocketEvents: function (props) {

  },
  emit: async function (props) {
    
  }
});