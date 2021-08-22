interface ValidatorInterface {
  validator: any,
  setAttributeNames: { (props: object): any }
  check: { (): Promise<unknown> }
  passes: boolean
  fails: boolean,
  errors: any,
}

type typeCallbackOn = { (err: any, props: any): void }

interface RedisPubSubListener {
  emit: { (whatKey: string, whatObject: object): void }
  on: { (whatKey: string, callback: typeCallbackOn): void }
  end?: { (): void }
  quit?: { (): void }
}