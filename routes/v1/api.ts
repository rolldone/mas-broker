import BaseRoute from "../../base/BaseRoute";
import api from "@root/app/member/routes/api";

export default BaseRoute.extend<BaseRouteInterface>({
  baseRoute: '/api/v1',
  onready() {
    let self = this;
    self.get('/display/route','display.route',[],self.displayRoute.bind(self));

    /* Register member api route */
    api.create(self);
  }
});