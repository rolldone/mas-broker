import BaseCompute from "@root/base/BaseCompute";
import Crypto from 'crypto';

export interface DataManipulateInterface extends BaseComputeInterface {
  generateMd5?: { (text: string): string }
  getExistData?: { (props: object): object };
  recursiveFunction?: { (index: number, done: Function, middlewares: any, props: any): void }
}

export default BaseCompute.extend<DataManipulateInterface>({
  generateMd5: function (text) {
    let hmac = Crypto.createHmac('md5', text)
    //passing the data to be hashed
    let resData = hmac.update('nodejsera');
    //Creating the hmac in the required format
    resData = (resData.digest('hex') as any);
    return resData + "";
  },
  getExistData: function (props) {
    return props;
  },
  recursiveFunction: function (index, done, middlewares, props = null) {
    try{
      if (index == middlewares.length) {
        return done(props);
      }
      var next = index + 1;
      return middlewares[index](props, done, this.recursiveFunction.bind(this, next, done, middlewares))
    }catch(ex){
      throw ex;
    }
  }
});

