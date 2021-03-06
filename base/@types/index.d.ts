
/**
 * What is <T> : https://rossbulat.medium.com/typescript-generics-explained-15c6493b510f
 */
interface BaseProtoInterface<T extends BaseProtoInterface<T>> {
  /**
   * Arrow Function
   * Direct to be this
   */
  binding?: (...props?: any) => this
  create?: (...props?: any) => this
  _super?: Function
  /**
   * Use this method
   * Your object automatic to be defined interface 
   * const example = Test.extend<exampInterface>({}) -> good
   * instead of
   * const example : exampInterface = Test.extend(<exampInterface>) -> bad
   */
  extend?: { <I>(i: I): I }
  mixin?: { <I>(i: I): I }
  __init?: string
  construct?: any
  _replaceAt?: { (input: string, search: string, replace: string, start: number, end: number): string }
  _getStatInfo?: { (permission: number, passTypeData?: string): boolean | string }
  _waitingTimeout?: { (timeoutNumber): Promise }
}


interface BaseControllerInterface extends BaseProtoInterface<BaseControllerInterface> {
  getBaseQuery?: Function
  returnValidator?: { (props: object, filter: object): ValidatorInterface }
  returnSimpleError?: { (ex: any, res: import('express').Response): void },
  isMatchNodeIdentity?: { (identity: string): Boolean }
}

interface BaseQueueInterface extends BaseProtoInterface<BaseQueueInterface> {
  construct?: { (props: object, callback: Function): void }
  returnValidator?: { (props: object, filter: object): ValidatorInterface }
  create?: { (props: any, callback: Function): BaseQueueInterface }
  props?: any
  callback?: Function
  queue_name?: string
  job_id?: string
  timeout?: number
  run?: { (): void }
  process: { (job: any, done: Function): void }
  dispatch?: {
    (props: any, callback: {
      (props: {
        err: boolean | null
        return: any
      }): void
    }): BaseQueueInterface
  }
  connector?: { (): Object }
  returnQueue?: { (): Bull.Queue }
  setJobId?: { (jobId: string): BaseQueueInterface }
  getJob?: { (jobId: string): void }
  getQueueName?: { (): string }
  setTimeout?: { (timeout: number): BaseQueueInterface }
  getDispatchNullException?: { (): void }
  getNameNUllException?: { (): void }
  getTimeoutNullException?: { (): void }
}

interface BaseServiceInterface extends BaseProtoInterface<BaseServiceInterface> {
  returnValidator?: { (props: object, filter: object): ValidatorInterface }
  returnMoment?: { (): Function }
  _removeDuplicate?: { (x: string, theChar: string): string }
}

interface BaseComputeInterface extends BaseServiceInterface {

}

interface BaseRouteInterface extends BaseProtoInterface<BaseRouteInterface> {
  displayRoute?: { (req: any, res: any): any }
  childRouter?: express.Router
  router?: typeof NameRouter
  app?: any
  _path?: string
  _middleware?: Array<any>
  set?: Function
  use?: { (path: string, middleware: Array<any>, callbackRouter: { (route: BaseRouteInterface): void }): void }
  get?: Function
  post?: Function
  baseRoute?: string
  onready: { (): void },
  // Redis pubsub
  setNrp?: Function,
  useNrp?: { (path: string, callbackRouter: Function): void },
  nrp?: any,
  nrpOn?: Function
  removeDuplicate?: { (x: string, theChar: string): void }
}

interface BaseRouteRedisPubSubInteface extends BaseRouteInterface {

}