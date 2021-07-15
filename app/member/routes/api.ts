import BaseProto from "@root/base/BaseProto";
import AuthController from "../controllers/xhr/AuthController";
import HomeController from "../controllers/xhr/HomeController";
import ManageBrokerController from "../controllers/xhr/ManageBrokerController";
import ManageGroupController from "../controllers/xhr/ManageGroupController";
import ManageEventController from "../controllers/xhr/ManagEventController";
import UserController from "../controllers/xhr/UserController";
import AuthMiddleware from "../middleware/AuthMiddleware";
import SetAuthDriverMiddleware from "../middleware/SetAuthDriverMiddleware";

export interface ApiRouteInterface extends BaseProtoInterface<any> { }

export default BaseProto.extend<ApiRouteInterface>({
  construct(routes: BaseRouteInterface) {
    let self = routes;
    /* Member route */
    self.use('', [], function (route) {
      route.get('', 'home.index', [], HomeController.binding().index);
    });

    /* Manage member public auth */
    self.use('/auth', [], function (route) {
      route.post('/login', 'auth.login', [], AuthController.binding().apiLogin);
      route.post('/register', 'auth.register', [], AuthController.binding().register);
      route.post('/logout', 'auth.logout', [], AuthController.binding().logout);
    });

    /* Manage member auth */
    self.use('/auth', [
      SetAuthDriverMiddleware.binding('api').check,
      AuthMiddleware.binding().check
    ], function (route) {
      route.get('/profile', 'auth.profile', [], AuthController.binding().profile);
    });

    /* Manage member user */
    self.use('/user', [
      SetAuthDriverMiddleware.binding('api').check,
      AuthMiddleware.binding().check
    ], function (route) {
      route.get('/self', 'user.self', [], UserController.binding().getCurrentUser);
      route.post('/self/update', 'user.self.update', [], UserController.binding().updateCurrentUser);
    });

    /* Manage member group */
    self.use('/group', [
      SetAuthDriverMiddleware.binding('api').check,
      AuthMiddleware.binding().check
    ], function (route) {
      route.get('/groups', 'group.groups', [], ManageGroupController.binding().getGroups);
      route.get('/:id/view', 'group.group', [], ManageGroupController.binding().getGroup);
      route.post('/add', 'group.add', [], ManageGroupController.binding().addGroup);
      route.post('/update', 'group.update', [], ManageGroupController.binding().updateGroup);
      route.post('/delete', 'group.delete', [], ManageGroupController.binding().deleteGroup);
    })

    /* Manage member event */
    self.use('/event', [
      SetAuthDriverMiddleware.binding('api').check,
      AuthMiddleware.binding().check
    ], function (route) {
      route.get('/events', 'event.events', [], ManageEventController.binding().getEvents);
      route.get('/:id/view', 'event.event', [], ManageEventController.binding().getEvent);
      route.post('/add', 'event.add', [], ManageEventController.binding().addEvent);
      route.post('/update', 'event.update', [], ManageEventController.binding().updateEvent);
      route.post('/delete', 'event.delete', [], ManageEventController.binding().deleteEvent);
    });

    /* Manage member broker */
    self.use('/broker', [
      SetAuthDriverMiddleware.binding('api').check,
      AuthMiddleware.binding().check
    ], function (route) {
      route.post('/add','broker.add',[],ManageBrokerController.binding().addBroker);
      route.post('/update','broker.update',[],ManageBrokerController.binding().updateBroker);
      route.get('/brokers','broker.brokers',[],ManageBrokerController.binding().getBrokers);
      route.get('/access-formats','broker.access_format',[],ManageBrokerController.binding().getAccessFormats);
      route.get('/:id/view','broker.broker',[],ManageBrokerController.binding().getBroker);
    })
  }
});