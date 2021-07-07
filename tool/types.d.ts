interface ValidatorInterface {
  validator : any,
  setAttributeNames : {(props : object) : any}
  check : {():Promise<unknown>}
  passes : boolean
  fails : boolean,
  errors : any
}

interface RedisPubSubListener {
  emit : {(whatKey : String, whatObject : object) : void }
  on : {(whatKey : string, callback : Function) : void }
}