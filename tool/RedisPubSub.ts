import BaseProto from "@root/base/BaseProto";
import { RedisClient } from "redis";
const NodeRedisPubSub = require('node-redis-pubsub');

type RedisPubSubType = {
  emitter?: RedisClient
  receiver?: RedisClient
  port?: number
  host?: string
  auth?: string
  scope?: string
}

export interface RedisPubSubInterface extends RedisPubSubListener {
  nrp?: any
  create?: (props: RedisPubSubType) => this
  construct: {
    (props: RedisPubSubType): any
  }
}

const RedisPubSub = BaseProto.extend<RedisPubSubInterface>({
  construct(props) {
    this.nrp = NodeRedisPubSub(props);
  },
  emit: function (whatKey, whatObject) {
    let nrp = this.nrp;
    if (whatObject instanceof Error) {
      whatObject = global.serializeError(whatObject);
    }
    return nrp.emit(whatKey, whatObject);
  },
  on: function (whatKey: string, callback: Function) {
    let nrp = this.nrp;
    let unsubscribe = nrp.on(whatKey, function (props: any) {
      let testError = global.deserializeError(props.toString());
      if (testError.toString().indexOf('NonError:', 0) == 0) {
        callback(null, props);
        return;
      }
      callback(testError, null);
    });
    return unsubscribe;
  },
  quit: function () {
    return this.nrp.quit();
  },
  end: function () {
    return this.nrp.end();
  }
})

export default RedisPubSub;