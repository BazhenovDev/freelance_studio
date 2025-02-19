import {HttpUtils} from "../utils/http-utils";

export class FreelancerService {
    static async getFreelancers() {
        const returnObject = {
            error: false,
            redirect: null,
            freelancers: null,
        };

        const result = await HttpUtils.request('/freelancers');

        if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.freelancers))) {
            returnObject.error = 'Возникла ошибка при запросе фрилансеров. Просим Вас попробовать позже или обратиться в поддержку!';
            if (result.redirect) {
                returnObject.redirect = result.redirect
            }
            return returnObject;
        }

        returnObject.freelancers = result.response.freelancers;
        return returnObject;
    }
    static async getFreelancer(id) {
        const returnObject = {
            error: false,
            redirect: null,
            freelancer: null,
        };

        const result = await HttpUtils.request(`/freelancers/${id}`);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе фрилансера. Просим Вас попробовать позже или обратиться в поддержку!';
            if (result.redirect) {
                returnObject.redirect = result.redirect
            }
            return returnObject;
        }

        returnObject.freelancer = result.response;
        return returnObject;
    }

    static async createFreelancer(data){
        const returnObject = {
            error: false,
            redirect: null,
            id: null,
        };

        const result = await HttpUtils.request('/freelancers', "POST", true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при добавление фрилансеров. Просим Вас попробовать позже или обратиться в поддержку!';
            if (result.redirect) {
                returnObject.redirect = result.redirect
            }
            return returnObject;
        }

        returnObject.id = result.response.id;
        return returnObject;
    }
    static async deleteFreelancer(id){
        const returnObject = {
            error: false,
            redirect: null,
        };

        const result = await HttpUtils.request(`/freelancers/${id}`, "DELETE", true);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при удаление фрилансеров. Просим Вас попробовать позже или обратиться в поддержку!';
            if (result.redirect) {
                returnObject.redirect = result.redirect
            }
            return returnObject;
        }

        return returnObject;
    }
    static async updateFreelancer(id, data){
        const returnObject = {
            error: false,
            redirect: null,
        };

        const result = await HttpUtils.request(`/freelancers/${id}`, "PUT", true, data);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при редактировании фрилансеров. Просим Вас попробовать позже или обратиться в поддержку!';
            if (result.redirect) {
                returnObject.redirect = result.redirect
            }
            return returnObject;
        }

        return returnObject;
    }
}