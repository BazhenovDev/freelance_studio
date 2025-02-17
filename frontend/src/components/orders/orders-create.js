import {HttpUtils} from "../../utils/http-utils";

export class OrdersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.freelancerSelectElement = document.getElementById('freelancerSelect');
        this.amountInputElement = document.getElementById('amountInput');
        this.descriptionInputElement = document.getElementById('descriptionInput');
        this.statusSelectElement = document.getElementById('statusSelect')
        document.getElementById('saveButton').addEventListener('click', this.saveOrder.bind(this));
        this.scheduledCardElement = document.getElementById('scheduled-card');
        this.completeCardElement = document.getElementById('complete-card');
        this.deadlineCardElement = document.getElementById('deadline-card');

        this.getFreelancers().then();

        this.scheduledDate = null;
        this.deadlineDate = null;
        this.completeDate =null;

        const calendarScheduled = $('#calendar-scheduled');
        calendarScheduled.datetimepicker({
            inline: true,
            locale: 'ru',
            useCurrent: false,
            icons: {
                time: 'far fa-clock',
                date: 'far fa-calendar',
            },
        });
        calendarScheduled.on("change.datetimepicker", (e) => {
            this.scheduledDate = e.date;
        });

        const calendarComplete = $('#calendar-complete');
        calendarComplete.datetimepicker({
            inline: true,
            locale: 'ru',
            useCurrent: false,
            icons: {
                time: 'far fa-clock',
                date: 'far fa-calendar',
            },
            buttons: {
                showClear: true,
            },
        });
        calendarComplete.on("change.datetimepicker", (e) => {
            this.completeDate = e.date;
        });

        const calendarDeadline = $('#calendar-deadline');
        calendarDeadline.datetimepicker({
            inline: true,
            locale: 'ru',
            useCurrent: false,
            icons: {
                time: 'far fa-clock',
                date: 'far fa-calendar',
            },
        });
        calendarDeadline.on("change.datetimepicker", (e) => {
            this.deadlineDate = e.date;
        });

    }


    async getFreelancers() {
        const result = await HttpUtils.request('/freelancers');

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response.error && !result.response.freelancers)) {
            console.log(result.response.message);
            return alert('Не можем получить список фрилансеров. Обратитесь в поддержку.')
        }

        const freelancers = result.response.freelancers;
        for (let i = 0; i < freelancers.length; i++) {
            const option = document.createElement('option');
            option.value = freelancers[i].id;
            option.innerText = `${freelancers[i].name} ${freelancers[i].lastName}`;
            this.freelancerSelectElement.appendChild(option)
        }

        $(this.freelancerSelectElement).select2({
            theme: 'bootstrap4'
        });
    }

    validateForm() {
        let isValid = true;

        let textInputArray = [this.amountInputElement, this.descriptionInputElement];

        for (let i = 0; i < textInputArray.length; i++) {
            if (textInputArray[i].value) {
                textInputArray[i].classList.remove('is-invalid');
            } else {
                textInputArray[i].classList.add('is-invalid');
                isValid = false;
            }
        }

        if(this.scheduledDate) {
            this.scheduledCardElement.classList.remove('is-invalid');
        } else {
            isValid = false;
            this.scheduledCardElement.classList.add('is-invalid');
        }

        if(this.deadlineDate) {
            this.deadlineCardElement.classList.remove('is-invalid');
        } else {
            isValid = false;
            this.deadlineCardElement.classList.add('is-invalid');
        }

        return isValid;
    }

    async saveOrder(e) {
        e.preventDefault();

        if(this.validateForm()) {

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

            const result = await HttpUtils.request('/orders', "POST", true, createData);
            if (result.redirect) {
                return this.openNewRoute(result.redirect)
            }

            if(result.error || !result.response || (result.response && result.response.error)) {
                console.log(result.response.message)
                return alert(`Возникла ошибка при добавление заказа. Обратитесь в поддержку`)
            }

            return this.openNewRoute(`/orders/view?id=${result.response.id}`);
        }
    }
}