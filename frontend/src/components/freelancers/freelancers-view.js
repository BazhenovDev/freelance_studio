import {HttpUtils} from "../../utils/http-utils.js";
import config from "../../config/config.js";
import {CommonUtils} from "../../utils/common-utils.js";

export class FreelancersView {

    pageTitle = null;
    constructor(openNewRoute) {
        this.pageTitle = document.getElementById('title')
        this.openNewRoute = openNewRoute
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('edit-link').href = `/freelancers/edit?id=${id}`;
        document.getElementById('delete-link').href = `/freelancers/delete?id=${id}`;

        this.getFreelancer(id).then();
    }

    async getFreelancer(id) {
        const result = await HttpUtils.request('/freelancers/' + id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message)
            return alert(`Возникла ошибка при запросе фрилансера. Просим Вас попробовать позже или обратиться в поддержку!`);
        }
        this.showFreelancer(result.response);
    }

    showFreelancer(freelancer) {
        if (freelancer.avatar) {
            document.getElementById('avatar').src = `${config.host}${freelancer.avatar}`;
        }
        document.getElementById('name').innerText = `${freelancer.name} ${freelancer.lastName}`;
        document.getElementById('level').innerHTML = CommonUtils.getLevelHtml(freelancer.level);

        document.getElementById('email').innerText = freelancer.email;
        document.getElementById('education').innerText = freelancer.education;
        document.getElementById('location').innerText = freelancer.location;
        document.getElementById('skills').innerText = freelancer.skills;
        document.getElementById('info').innerText = freelancer.info;
        if (freelancer.createdAt) {
           let date = new Date(freelancer.createdAt);
            document.getElementById('created').innerText = date.toLocaleString('ru-RU');
        }

        const titlePage = this.pageTitle.innerText.split(' ');
        titlePage.splice(1, 0, freelancer.name, freelancer.lastName);
        this.pageTitle.innerText = titlePage.join(' ');
    }

}