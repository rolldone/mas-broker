
declare module NodeJS {
  interface Global {
    CustomError : {(name : string, message : string): void}
    staticType : {(inVariable : any, typeDatas : Array<any>) : void}
    app : any,
    Auth: any,
    Server : any,
    queues : any,
    pubsub : any,
    masterData : MasterDataInterface,
    nrp : RedisPubSubListener,
    minio : any,
    nohm : any,
    redis : any,
    serializeError : any,
    deserializeError : any,
    io : any,
    scServer  : any,
    WebSocket : any,
    node_identity : string
  }
  interface Process {
    /* Jika kerja di backend define ini manual */
    browser: boolean
  }
}