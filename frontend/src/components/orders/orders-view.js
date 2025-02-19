import config from "../../config/config.js";
import {CommonUtils} from "../../utils/common-utils.js";
import {UrlUtils} from "../../utils/url-utils.js";
import {OrdersService} from "../../services/orders-service";

export class OrdersView {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('edit-link').href = `/orders/edit?id=${id}`;
        document.getElementById('delete-link').href = `/orders/delete?id=${id}`;

        this.getOrder(id).then();
    }

    async getOrder(id) {
        const response = await OrdersService.getOrder(id);

        if(response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showOrder(response.order)
    }

    showOrder(order) {

        const statusInfo = CommonUtils.getStatusInfo(order.status);
        document.getElementById('order-status').classList.add(`bg-${statusInfo.color}`);
        document.getElementById('order-status-icon').classList.add(`fa-${statusInfo.icon}`);
        document.getElementById('order-status-value').innerText = statusInfo.name;

        if (order.scheduledDate) {
            let dateScheduled = new Date(order.scheduledDate);
            document.getElementById('scheduled').innerText = dateScheduled.toLocaleDateString('ru-RU');
        }


        document.getElementById('complete').innerText = (order.completeDate)
            ? new Date(order.completeDate).toLocaleDateString('ru-RU')
            : 'Заказ не выполнен';

        if (order.deadlineDate) {
            let dateDeadline = new Date(order.deadlineDate);
            document.getElementById('deadline').innerText = dateDeadline.toLocaleDateString('ru-RU');
        }

        if (order.freelancer.avatar) {
            document.getElementById('freelancer-avatar').src = `${config.host}${order.freelancer.avatar}`;
        }

        document.getElementById('freelancer-name').innerHTML =
            `<a href="/freelancers/view?id=${order.freelancer.id}">${order.freelancer.name} ${order.freelancer.lastName}</a>`;

        document.getElementById('number').innerText = order.number;
        document.getElementById('description').innerText = order.description;
        document.getElementById('owner').innerText = `${order.owner.name} ${order.owner.lastName}`;
        document.getElementById('amount').innerText = order.amount;

        document.getElementById('created').innerText = order.createdAt ? new Date(order.createdAt).toLocaleString('ru-RU') : '';
        const updateDateElement = document.getElementById('update')
        if (!order.updatedAt || (order.createdAt === order.updatedAt)) {
            updateDateElement.previousElementSibling.style.display ='none';
        } else {
            let dateCreate = new Date(order.updatedAt);
            updateDateElement.innerText = dateCreate.toLocaleString('ru-RU');
        }
    }
}