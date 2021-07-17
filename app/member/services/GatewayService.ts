import BaseService from "@root/base/BaseService";

export interface GatewayServiceInterface extends BaseServiceInterface {
  addGateway?: { (props: any): Promise<any> }
  updateGateway?: { (props: any): Promise<any> }
  deleteGateway?: { (props: any): Promise<any> }
  getGateways?: { (props: any): Promise<any> }
  getGateway?: { (props: any): Promise<any> }
}

export default BaseService.extend<GatewayServiceInterface>({
  addGateway: async function (props) {
    try {
      let validation = this.returnValidator(props, {});
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      
    } catch (ex) {
      throw ex;
    }
  },
  updateGateway: async function (props) {
    try {
      let validation = this.returnValidator(props, {});
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      
    } catch (ex) {
      throw ex;
    }
  },
  deleteGateway: async function (props) {
    try {
      let validation = this.returnValidator(props, {});
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      
    } catch (ex) {
      throw ex;
    }
  },
  getGateways: async function (props) {
    try {
      let validation = this.returnValidator(props, {});
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      
    } catch (ex) {
      throw ex;
    }
  },
  getGateway: async function (props) {
    try {
      let validation = this.returnValidator(props, {});
      switch (await validation.check()) {
        case validation.fails:
          throw global.CustomError('error.validation', validation.errors.errors);
      }
      
    } catch (ex) {
      throw ex;
    }
  },
});