import {HttpUtils} from "../../utils/http-utils.js";
import config from "../../config/config.js";
import {CommonUtils} from "../../utils/common-utils.js";

export class FreelancersList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.getFreelancers().then();
    }

    async getFreelancers() {
        const result = await HttpUtils.request('/freelancers');
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || result.response && (result.response.error || !result.response.freelancers)) {
            // console.log(result.response.message)
            return alert('Возникла ошибка при запросе фрилансеров. Просим Вас попробовать позже или обратиться в поддержку!');
        }
        this.showRecords(result.response.freelancers);
    }

    showRecords(freelancers) {
        const recordsElement = document.getElementById('records');
        for (let i = 0; i < freelancers.length; i++) {
            const trElement = document.createElement('tr');
            // insertCell сразу вставляет внутрь элемента tr элемент td
            trElement.insertCell().innerText = (i + 1).toString();
            trElement.insertCell().innerHTML = freelancers[i].avatar ? '<img class="freelancers-avatar" src="' + config.host + freelancers[i].avatar + '" alt="user image">'
                : '';
            trElement.insertCell().innerText = `${freelancers[i].name} ${freelancers[i].lastName}`;
            trElement.insertCell().innerText = `${freelancers[i].email}`;

            trElement.insertCell().innerHTML = CommonUtils.getLevelHtml(freelancers[i].level);
            trElement.insertCell().innerText = freelancers[i].education;
            trElement.insertCell().innerText = freelancers[i].location;
            trElement.insertCell().innerText = freelancers[i].skills;
            trElement.insertCell().innerHTML = '<div class="freelancers-tools">' +
                    '<a href="/freelancers/view?id=' + freelancers[i].id + '" class="fas fa-eye"></a>' +
                    '<a href="/freelancers/edit?id=' + freelancers[i].id + '" class="fas fa-edit"></a>' +
                    '<a href="/freelancers/delete?id=' +freelancers[i].id + '" class="fas fa-trash"></a>' +
                '</div>';
            recordsElement.appendChild(trElement);
        }

        new DataTable('#data-table', {
            language: {
                "lengthMenu": "Показывать _MENU_ записей на странице",
                "search": "Фильтр:",
                "info": "Страница _PAGE_ из _PAGES_",
                "paginate": {
                    "next":       "Вперёд",
                    "previous":   "Назад"
                },
            }
        });
    }
}