import {UrlUtils} from "../../utils/url-utils.js";
import {FreelancerService} from "../../services/freelancer-service";

export class FreelancersDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/');
        }

        this.deleteFreelancer(id).then();
    }

    async deleteFreelancer(id) {
        const response = await FreelancerService.deleteFreelancer(id);

        if(response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/freelancers');
    }
}