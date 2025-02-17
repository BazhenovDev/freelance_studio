import {HttpUtils} from "../../utils/http-utils.js";

export class OrdersDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        const urlParam = new URLSearchParams(window.location.search);
        const id = urlParam.get('id');
        if (!id) {
            this.openNewRoute('/');
        }

        this.deleteOrder(id).then();
    }

    async deleteOrder(id) {
        const result = await HttpUtils.request(`/orders/${id}`, "DELETE", true);
        if(result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            return alert(`Не удалось удалить заказ. Обратитесь в службу поддержки или попробуйте удалить ещё раз позже.`);
        }
        return this.openNewRoute('/orders');
    }
}