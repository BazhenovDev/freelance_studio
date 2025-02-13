import {HttpUtils} from "../../utils/http-utils";

export class FreelancersDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        const urlParam = new URLSearchParams(window.location.search);
        const id = urlParam.get('id');
        if (!id) {
            this.openNewRoute('/');
        }

        this.deleteFreelancer(id).then();
    }

    async deleteFreelancer(id) {
        const result = await HttpUtils.request(`/freelancers/${id}`, "DELETE", true);
        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            return alert(`Не удалось удалить фрилансера. Обратитесь в службу поддержки или попробуйте удалить ещё раз позже.`);
        }
        return this.openNewRoute('/freelancers');
    }
}