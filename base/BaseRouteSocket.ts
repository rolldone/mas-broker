import BaseRoute from './BaseRoute';

export interface BaseRouteSocketInterface extends BaseRouteInterface{}

const BaseRouteSocket = BaseRoute.extend<BaseRouteSocketInterface>({
  onready : function(){
    console.log('Override this function');
  }
});







/* STILL ON DEVELOPMENT */
// const BaseRouteSocket : BaseRouteSocketInterface = BaseRoute.extend(<BaseRouteSocketInterface>{
//   construct(app : any){
//     this.router.extendExpress(app);
//     this.router.registerAppHelpers(app);
//     this.app = app;
//     this.nrp = global.nrp;
//     /* Child route inside .use */
//     this.childRouter = express.Router();
//     this.router.extendExpress(this.childRouter);
//     this.onready();
//   },
//   onready : '',
//   on(...props:Array<any>){
//     this.setOn('on',...props);
//   },
//   use(path : string,callbackRouter : Function){
//     this._path = path;
//     callbackRouter(<BaseRouteInterface>this);
//   },
//   setOn(action : string, ...props : Array<any>){
//     this.baseRoute = null;
//     let basRoute = global.node_identity == ""?"":global.node_identity+".";
//     props[0]=(this._path||'')+"."+props[0];
//     props[0]=this.removeDuplicate(props[0],'.');
//     props[0]=basRoute+props[0];
//     console.log('npm -> action',action);
//     console.log('npm -> props',props);
//     console.log('npm -> _path',this._path);
//     console.log('npm -> action ->',props[0]);

//     this.socket[action](...props);
//   },
//   socket : null
// });

// export default BaseRouteSocket;

export default BaseRouteSocket;