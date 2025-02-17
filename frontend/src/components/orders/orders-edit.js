import {HttpUtils} from "../../utils/http-utils.js";


export class OrdersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(document.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.scheduledDate = null;
        this.deadlineDate = null;
        this.completeDate = null;

        document.getElementById('updateButton').addEventListener('click', this.updateOrder.bind(this));

        this.freelancerSelectElement = document.getElementById('freelancerSelect');
        this.amountInputElement = document.getElementById('amountInput');
        this.descriptionInputElement = document.getElementById('descriptionInput');
        this.statusSelectElement = document.getElementById('statusSelect')
        this.scheduledCardElement = document.getElementById('scheduled-card');
        this.completeCardElement = document.getElementById('complete-card');
        this.deadlineCardElement = document.getElementById('deadline-card');

        this.init(id).then();
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
        const result = await HttpUtils.request(`/orders/${id}`);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            return alert('Не получилось осуществить запрос. Обратитесь в службу поддержки или попробуйте позже.');
        }

        this.orderOriginalData = result.response;

        return result.response;
    }

    async getFreelancers(currentFreelancerId) {
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

            if (currentFreelancerId === freelancers[i].id) {
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


        const calendarScheduled = $('#calendar-scheduled');
        calendarScheduled.datetimepicker({
            inline: true,
            locale: 'ru',
            useCurrent: false,
            date: order.scheduledDate,
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
            date: order.completeDate,
            icons: {
                time: 'far fa-clock',
                date: 'far fa-calendar',
            },
            buttons: {
                showClear: true,
            },
        });
        calendarComplete.on("change.datetimepicker", (e) => {

            if (e.date) {
                this.completeDate = e.date
            } else if (this.orderOriginalData.completeDate) {
                this.completeDate = false;
            } else {
                this.completeDate = null;
            }
        });

        const calendarDeadline = $('#calendar-deadline');
        calendarDeadline.datetimepicker({
            inline: true,
            locale: 'ru',
            useCurrent: false,
            date: order.deadlineDate,
            icons: {
                time: 'far fa-clock',
                date: 'far fa-calendar',
            },
        });
        calendarDeadline.on("change.datetimepicker", (e) => {
            this.deadlineDate = e.date;
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
        return isValid;
    }


    async updateOrder(e) {
        e.preventDefault();


        if (this.validateForm()) {
            const changedData ={};
            if(parseInt(this.amountInputElement.value) !== parseInt(this.orderOriginalData.amount)) {
                changedData.amount = parseInt(this.amountInputElement.value);
            }

            if(this.descriptionInputElement.value !== this.orderOriginalData.description) {
                changedData.description = this.descriptionInputElement.value;
            }

            if(this.statusSelectElement.value !== this.orderOriginalData.status) {
                changedData.status = this.statusSelectElement.value;
            }

            if(this.freelancerSelectElement.value !== this.orderOriginalData.freelancer.id) {
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
                const result = await HttpUtils.request(`/orders/${this.orderOriginalData.id}`, "PUT", true, changedData);
                if (result.redirect) {
                    this.openNewRoute(result.redirect);
                }

                if(result.error || !result.response || (result.response && result.response.error)) {
                    console.log(result.response.message)
                    return alert('Ошибка запроса при редактирование. Просьба обратиться в поддержку или попробовать сделать повторный запрос позже.')
                }

                return this.openNewRoute(`/orders/view?id=${this.orderOriginalData.id}`);
            }
        }
    }
}