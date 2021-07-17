import BaseController from "@root/base/BaseController";
import ConnectionService, { ConnectionServiceInterface } from "../services/ConnectionService";

export interface ConnectionControllerInterface extends BaseControllerInterface {
  returnConnectionService?: { (): ConnectionServiceInterface }
  connect?: { (props: any): Promise<any> }
  disconect?: { (props: any): Promise<any> }
  check?: { (props: any): Promise<any> }
}

export default BaseController.extend<ConnectionControllerInterface>({
  returnConnectionService: function () {
    return ConnectionService.create();
  },
  connect: async function (props) {
    try {
      let connectionService = this.returnConnectionService();
      let resData = await connectionService.connect({
        broker_key: props.broker_key,
        port: props.config.port,
        host: props.config.host,
        password: props.config.password,
        no_ready_check: props.config.no_ready_check,
        db: props.config.db,
        broker_events : props.broker_events
      });
    } catch (ex) {
      console.log('redisclient - connectionController - connect - ex : ');
      console.log(' ', ex);
    }
  },
  disconect: async function (props) {
    try {
      console.log('redis ->');
      console.log(' ', props);
      let connectionService = this.returnConnectionService();
      let resData = await connectionService.connect(props);
    } catch (ex) {
      console.log('redisclient - connectionController - disconect - ex : ');
      console.log(' ', ex);
    }
  },
  check: async function (props) {
    try {
      console.log('redis ->');
      console.log(' ', props);
      let connectionService = this.returnConnectionService();
      let resData = await connectionService.connect(props);
    } catch (ex) {
      console.log('redisclient - connectionController - check - ex : ');
      console.log(' ', ex);
    }
  }
});