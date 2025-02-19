import config from "../../config/config.js";
import {CommonUtils} from "../../utils/common-utils.js";
import {UrlUtils} from "../../utils/url-utils.js";
import {FreelancerService} from "../../services/freelancer-service";

export class FreelancersView {

    pageTitle = null;
    constructor(openNewRoute) {
        this.findElements();
        this.openNewRoute = openNewRoute

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('edit-link').href = `/freelancers/edit?id=${id}`;
        document.getElementById('delete-link').href = `/freelancers/delete?id=${id}`;

        this.getFreelancer(id).then();
    }

    findElements() {
        this.pageTitle = document.getElementById('title');
        this.createDateElement = document.getElementById('created');
        this.updateDateElement = document.getElementById('update');
    }

    async getFreelancer(id) {
        const response = await FreelancerService.getFreelancer(id);

        if(response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        this.showFreelancer(response.freelancer);
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
           let dateCreate = new Date(freelancer.createdAt);
            this.createDateElement.innerText = dateCreate.toLocaleString('ru-RU');
        }

        if (!freelancer.updatedAt || (freelancer.createdAt === freelancer.updatedAt)) {
            this.updateDateElement.previousElementSibling.style.display ='none';
        } else {
            let dateCreate = new Date(freelancer.updatedAt);
            this.updateDateElement.innerText = dateCreate.toLocaleString('ru-RU');
        }

        const titlePage = this.pageTitle.innerText.split(' ');
        titlePage.splice(1, 0, freelancer.name, freelancer.lastName);
        this.pageTitle.innerText = titlePage.join(' ');
    }

}