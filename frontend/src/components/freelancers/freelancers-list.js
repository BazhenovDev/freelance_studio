import config from "../../config/config.js";
import {CommonUtils} from "../../utils/common-utils.js";
import {FreelancerService} from "../../services/freelancer-service";

export class FreelancersList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.getFreelancers().then();
    }

    async getFreelancers() {
        const response = await FreelancerService.getFreelancers();

        if(response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showRecords(response.freelancers);
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
            trElement.insertCell().innerHTML = CommonUtils.generateGridToolsColumn('freelancers', freelancers[i].id)
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