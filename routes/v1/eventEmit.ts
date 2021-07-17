import BrokerEventEmitter from "@root/app/broker/routes/eventEmitter";
import RedisEventEmitter from "@root/app/redisclient/routes/eventEmitter";
import WebSocketEventEmit from "@root/app/websocket/routes/eventEmitter";
import BaseRoute from "@root/base/BaseRoute";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";

declare var masterData : MasterDataInterface

export default BaseRoute.extend<BaseRouteInterface>({
  baseRoute : '',
  onready(){
    /* Register broker event emitter route */
    WebSocketEventEmit.create(this);
    BrokerEventEmitter.create(this);
    RedisEventEmitter.create(this);
  }
});