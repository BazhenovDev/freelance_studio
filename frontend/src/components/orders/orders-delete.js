import {UrlUtils} from "../../utils/url-utils.js";
import {OrdersService} from "../../services/orders-service.js";

export class OrdersDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/');
        }

        this.deleteOrder(id).then();
    }

    async deleteOrder(id) {
        const response = await OrdersService.deleteOrder(id);
        if(response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        return this.openNewRoute('/orders');
    }
}