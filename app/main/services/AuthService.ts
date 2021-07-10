import BaseService from "@root/base/BaseService";
import AuthConfig from "@root/config/AuthConfig";
import Auth, { AuthInterface } from "../compute/Auth";
import UserModel, { UserModelInterface } from "../models/UserModel";

export interface AuthServiceInterface extends BaseServiceInterface {
  apiLogin?: { (props: any): any }
  returnAuth ?: {():AuthInterface}
  returnUserModel ?: {():UserModelInterface}
  register?: {(props:any):any}
}

const AuthService = BaseService.extend<AuthServiceInterface>({
  returnAuth : function(){
    return Auth.create();
  },
  returnUserModel : function(){
    return UserModel.create();
  },
  async apiLogin(props) {
    try{
      let validator = this.returnValidator(props,{
        email : 'required|email',
        password : 'required'
      })
      switch(await validator.check()){
        case validator.passes:
          let Auth = this.returnAuth();
          let user = this.returnUserModel();
          user.setIncludes(['password']);
          // user._includes = ['password'];
          user = await user.first({
            where : { email : props.email },
          });

          if(user == null){
            throw global.CustomError("error.authentication_exception","Email or Password is not match!");
          }

          let resData = await Auth.checkPassword(props.password,user.password);
          if(resData == false){
            throw global.CustomError("error.authentication_exception","Email or Password is not match!");
          }
          let token = Auth.generateToken(AuthConfig.guard.api,{
            id : user.id,
            email : user.email,
          });
          
          return token;
        case validator.fails:
          throw global.CustomError('error.validation',JSON.stringify(validator.errors.errors));
      }
    }catch(ex){
      throw ex;
    }
  },
  async register(props){
    try{
      let Auth = this.returnAuth();
      let validator = this.returnValidator(props,{
        first_name : 'required',
        email : 'required|email',
        password : 'required|min:8',
        password_confirm : 'required|same:password'
      });
      switch(await validator.check()){
        case validator.passes:
          let UserApp = this.returnUserModel();
          props.password = await Auth.generatePassword(props.password);
          props.status = 1;
          let resData = await UserApp.save(props);
          return resData;
        case validator.fails:
          throw global.CustomError('error.validation',JSON.stringify(validator.errors.errors));
      }
    }catch(ex){
      throw ex;
    }
  }
});

export default AuthService;