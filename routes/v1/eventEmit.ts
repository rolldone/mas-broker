import WebSocketEventEmit from "@root/app/websocket/routes/eventEmitter";
import BaseRoute from "@root/base/BaseRoute";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";

declare var masterData : MasterDataInterface

export default BaseRoute.extend<BaseRouteInterface>({
  baseRoute : '',
  onready(){
    /* Register broker event emitter route */
    WebSocketEventEmit.create(this);
  }
});