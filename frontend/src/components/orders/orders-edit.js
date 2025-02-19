import {ValidationUtils} from "../../utils/validation-utils.js";
import {UrlUtils} from "../../utils/url-utils.js";
import {FreelancerService} from "../../services/freelancer-service";
import {OrdersService} from "../../services/orders-service";


export class OrdersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.scheduledDate = null;
        this.deadlineDate = null;
        this.completeDate = null;

        document.getElementById('updateButton').addEventListener('click', this.updateOrder.bind(this));

        this.findElements();

        this.validations = [
            {element: this.amountInputElement},
            {element: this.descriptionInputElement},
        ];

        this.init(id).then();
    }

    findElements() {
        this.freelancerSelectElement = document.getElementById('freelancerSelect');
        this.amountInputElement = document.getElementById('amountInput');
        this.descriptionInputElement = document.getElementById('descriptionInput');
        this.statusSelectElement = document.getElementById('statusSelect')
    }

    async init(id) {
        const orderData = await this.getOrder(id);
        if (orderData) {
            this.showOrder(orderData);
            if (orderData.freelancer) {
                await this.getFreelancers(orderData.freelancer.id);
            }
        }
    }

    async getOrder(id) {
        const response = await OrdersService.getOrder(id);
        if(response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.orderOriginalData = response.order;

        return response.order;
    }

    async getFreelancers(currentFreelancerId) {
        const response = await FreelancerService.getFreelancers();

        if(response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        for (let i = 0; i < response.freelancers.length; i++) {
            const option = document.createElement('option');
            option.value = response.freelancers[i].id;
            option.innerText = `${response.freelancers[i].name} ${response.freelancers[i].lastName}`;

            if (currentFreelancerId === response.freelancers[i].id) {
                option.selected = true;
            }

            this.freelancerSelectElement.appendChild(option)
        }

        $(this.freelancerSelectElement).select2({
            theme: 'bootstrap4'
        });
    }

    showOrder(order) {
        const breadCrumbsElement = document.getElementById('breadcrumbs-order');
        breadCrumbsElement.href = `/orders/view?id=${order.id}`;
        breadCrumbsElement.innerText = order.number;
        for (let i = 0; i < this.statusSelectElement.options.length; i++) {
            if (this.statusSelectElement.options[i].value === order.status) {
                this.statusSelectElement.selectedIndex = i;
            }
        }

        this.amountInputElement.value = order.amount;
        this.descriptionInputElement.value = order.description;

        const calendarOptions = {
            inline: true,
            locale: 'ru',
            useCurrent: false,
            icons: {
                time: 'far fa-clock',
                date: 'far fa-calendar',
            },
        }

        const calendarScheduled = $('#calendar-scheduled');
        calendarScheduled.datetimepicker(Object.assign({}, calendarOptions, {date: order.scheduledDate}));
        calendarScheduled.on("change.datetimepicker", (e) => {
            this.scheduledDate = e.date;
        });

        const calendarDeadline = $('#calendar-deadline');
        calendarDeadline.datetimepicker(Object.assign({}, calendarOptions, {date: order.deadlineDate}));
        calendarDeadline.on("change.datetimepicker", (e) => {
            this.deadlineDate = e.date;
        });

        const calendarComplete = $('#calendar-complete');
        calendarComplete.datetimepicker(Object.assign({}, calendarOptions, {
            date: order.completeDate,
            buttons: {showClear: true}
        }));
        calendarComplete.on("change.datetimepicker", (e) => {

            if (e.date) {
                this.completeDate = e.date
            } else if (this.orderOriginalData.completeDate) {
                this.completeDate = false;
            } else {
                this.completeDate = null;
            }
        });

    }

    async updateOrder(e) {
        e.preventDefault();
        if (ValidationUtils.validateForm(this.validations)) {
            const changedData = {};
            if (parseInt(this.amountInputElement.value) !== parseInt(this.orderOriginalData.amount)) {
                changedData.amount = parseInt(this.amountInputElement.value);
            }

            if (this.descriptionInputElement.value !== this.orderOriginalData.description) {
                changedData.description = this.descriptionInputElement.value;
            }

            if (this.statusSelectElement.value !== this.orderOriginalData.status) {
                changedData.status = this.statusSelectElement.value;
            }

            if (this.freelancerSelectElement.value !== this.orderOriginalData.freelancer.id) {
                changedData.freelancer = this.freelancerSelectElement.value;
            }

            if (this.completeDate || this.completeDate === false) {
                changedData.completeDate = this.completeDate ? this.completeDate.toISOString() : null;
            }


            if (this.scheduledDate) {
                changedData.scheduledDate = this.scheduledDate.toISOString();
            }

            if (this.deadlineDate) {
                changedData.deadlineDate = this.deadlineDate.toISOString();
            }

            if (Object.keys(changedData).length > 0) {

                const response = await OrdersService.updateOrder(this.orderOriginalData.id, changedData);
                if(response.error) {
                    alert(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                return this.openNewRoute(`/orders/view?id=${this.orderOriginalData.id}`);
            }
        }
    }
}