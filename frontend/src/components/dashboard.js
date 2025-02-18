import {HttpUtils} from "../utils/http-utils.js";
import config from "../config/config.js";

export class Dashboard {


    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        this.getOrders().then();
    }

    async getOrders() {
        const result = await HttpUtils.request('/orders');
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || result.response && (result.response.error || !result.response.orders)) {
            console.log(result.response.message)
            return alert('Возникла ошибка при запросе заказов. Просим Вас попробовать позже или обратиться в поддержку!');
        }
        this.loadOrdersInfo(result.response.orders);
        this.loadCalendarInfo(result.response.orders);
    }

    loadOrdersInfo(orders) {
        document.getElementById('count-orders').innerText = orders.length
        document.getElementById('done-orders').innerText = orders.filter(order => order.status === config.orderStatuses.success).length;
        document.getElementById('in-progress-orders').innerText = orders
            .filter(order => [config.orderStatuses.confirmed, config.orderStatuses.new].includes(order.status)).length;
        document.getElementById('canceled-orders').innerText = orders.filter(order => order.status === config.orderStatuses.canceled).length;
    }

    loadCalendarInfo(orders) {
        const preparedEvents = [];

        for (let i = 0; i < orders.length; i++) {

            let color = null;
            if(orders[i].status === config.orderStatuses.success) {
                color = 'gray';
            }

            if (orders[i].scheduledDate) {
                const scheduledDate = new Date(orders[i].scheduledDate);
                preparedEvents.push(                {
                    title: `${orders[i].freelancer.name} ${orders[i].freelancer.lastName} выполняет заказ ${orders[i].number}`,
                    start: scheduledDate,
                    backgroundColor: color ? color : '#00c0ef',
                    borderColor: color ? color : '#00c0ef',
                    allDay: true
                })
            }

            if (orders[i].deadlineDate) {
                const deadlineDate = new Date(orders[i].deadlineDate);
                preparedEvents.push(                {
                    title: `Дедлайн заказа ${orders[i].number}`,
                    start: deadlineDate,
                    backgroundColor: color ? color : '#f39c12',
                    borderColor: color ? color : '#f39c12',
                    allDay: true
                })
            }

            if (orders[i].completeDate) {
                const completeDate = new Date(orders[i].completeDate);
                preparedEvents.push(                {
                    title: `Заказ ${orders[i].number} выполнен фрилансером ${orders[i].freelancer.name}`,
                    start: completeDate,
                    backgroundColor: color ? color : '#00a65a',
                    borderColor: color ? color : '#00a65a',
                    allDay: true
                })
            }
        }

        const calendarElement = document.getElementById('calendar');
        const calendar = new FullCalendar.Calendar(calendarElement, {
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: ''
            },
            firstDay: 1,
            locale: 'ru',
            themeSystem: 'bootstrap',
            events: preparedEvents
        });
        calendar.render();
    }
}
