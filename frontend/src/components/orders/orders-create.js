import {ValidationUtils} from "../../utils/validation-utils.js";
import {OrdersService} from "../../services/orders-service.js";
import {FreelancerService} from "../../services/freelancer-service.js";

export class OrdersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        document.getElementById('saveButton').addEventListener('click', this.saveOrder.bind(this));

        this.findElements();

        this.scheduledDate = null;
        this.deadlineDate = null;
        this.completeDate = null;

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
        calendarScheduled.datetimepicker(calendarOptions);
        calendarScheduled.on("change.datetimepicker", (e) => {
            this.scheduledDate = e.date;
        });

        const calendarDeadline = $('#calendar-deadline');
        calendarDeadline.datetimepicker(calendarOptions);
        calendarDeadline.on("change.datetimepicker", (e) => {
            this.deadlineDate = e.date;
        });

        const calendarComplete = $('#calendar-complete');
        calendarOptions.buttons = {showClear: true,}
        calendarComplete.datetimepicker(calendarOptions);
        calendarComplete.on("change.datetimepicker", (e) => {
            this.completeDate = e.date;
        });

        this.validations = [
            {element: this.amountInputElement},
            {element: this.descriptionInputElement},
            {element: this.scheduledCardElement, options: {checkProperty: this.scheduledDate}},
            {element: this.deadlineCardElement, options: {checkProperty: this.deadlineDate}},
        ];
        this.getFreelancers().then();
    }

    findElements() {
        this.freelancerSelectElement = document.getElementById('freelancerSelect');
        this.statusSelectElement = document.getElementById('statusSelect')
        this.descriptionInputElement = document.getElementById('descriptionInput');
        this.amountInputElement = document.getElementById('amountInput');
        this.scheduledCardElement = document.getElementById('scheduled-card');
        this.deadlineCardElement = document.getElementById('deadline-card');
    }

    async getFreelancers() {
        const response = await FreelancerService.getFreelancers();

        if(response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        for (let i = 0; i < response.freelancers.length; i++) {
            const option = document.createElement('option');
            option.value = response.freelancers[i].id;
            option.innerText = `${response.freelancers[i].name} ${response.freelancers[i].lastName}`;
            this.freelancerSelectElement.appendChild(option);
        }

        $(this.freelancerSelectElement).select2({
            theme: 'bootstrap4'
        });
    }

    async saveOrder(e) {
        e.preventDefault();

        const scheduledCardValid = this.validations.find(item => item.element === this.scheduledCardElement)
        scheduledCardValid.options.checkProperty = this.scheduledDate;
        const deadlineCardValid = this.validations.find(item => item.element === this.deadlineCardElement)
        deadlineCardValid.options.checkProperty = this.deadlineDate;

        if (ValidationUtils.validateForm(this.validations)) {
            const createData = {
                description: this.descriptionInputElement.value,
                deadlineDate: this.deadlineDate.toISOString(),
                scheduledDate: this.scheduledDate.toISOString(),
                freelancer: this.freelancerSelectElement.value,
                status: this.statusSelectElement.value,
                amount: parseInt(this.amountInputElement.value)
            }

            if (this.completeDate) {
                createData.completeDate = this.completeDate.toISOString();
            }


            const response = await OrdersService.createOrder(createData)

            if(response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute(`/orders/view?id=${response.id}`);
        }
    }
}