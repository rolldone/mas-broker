import BaseProto from "@root/base/BaseProto";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import ConnectinController from "../controllers/ConnectinController";
import EventController from "../controllers/EventController";

declare var masterData : MasterDataInterface

export interface EventEmitterInterface extends BaseProtoInterface<any>{}

export default BaseProto.extend<EventEmitterInterface>({
  construct(route : BaseRouteInterface){
    /* Manage Connection */
    masterData.setOnListener('adapter.connection.redis.connect',ConnectinController.binding().connect);
    masterData.setOnListener('adapter.connection.redis.disconect',ConnectinController.binding().disconect);
    masterData.setOnListener('adapter.connection.redis.check',ConnectinController.binding().check);

    /* Manage Event */
    masterData.setOnListener('adapter.redis_client.start',EventController.binding().add);
    masterData.setOnListener('adapter.redis_client.delete',EventController.binding().delete);
    masterData.setOnListener('adapter.redis_client.get',EventController.binding().get);
  }
})