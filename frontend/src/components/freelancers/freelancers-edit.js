import {HttpUtils} from "../../utils/http-utils.js";
import config from "../../config/config.js";
import {CommonUtils} from "../../utils/common-utils.js";
import {FileUtils} from "../../utils/file-utils";

export class FreelancersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.nameInputElement = document.getElementById('nameInput');
        this.lastNameInputElement = document.getElementById('lastNameInput');
        this.emailInputElement = document.getElementById('emailInput');
        this.educationInputElement = document.getElementById('educationInput');
        this.locationInputElement = document.getElementById('locationInput');
        this.skillsInputElement = document.getElementById('skillsInput');
        this.infoInputElement = document.getElementById('infoInput');
        this.levelSelectElement = document.getElementById('levelSelect');
        this.avatarInputElement = document.getElementById('avatarInput');

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/');
        }
        document.getElementById('updateButton').addEventListener('click', this.updateFreelancer.bind(this));
        bsCustomFileInput.init();
        this.getFreelancer(id).then();
    }

    async getFreelancer(id) {
        const result = await HttpUtils.request(`/freelancers/${id}`);
        if (result.redirect) {
            this.openNewRoute(result.redirect);
        }

        if(result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            return alert('Не получилось осуществить запрос. Обратитесь в службу поддержки или попробуйте позже.');
        }

        this.freelancerOriginalData = result.response;
        this.showFreelancer(result.response)
    }

    showFreelancer(freelancer) {
        const breadCrumbsElement = document.getElementById('breadcrumbs-freelancer');
        breadCrumbsElement.innerText = `${freelancer.name} ${freelancer.lastName}`
        breadCrumbsElement.href = `/freelancers/view?id=${freelancer.id}`


        if (freelancer.avatar) {
            document.getElementById('avatar').src = `${config.host}${freelancer.avatar}`;
        }
        document.getElementById('level').innerHTML = CommonUtils.getLevelHtml(freelancer.level);

        this.nameInputElement.value = freelancer.name;
        this.lastNameInputElement.value = freelancer.lastName;
        this.emailInputElement.value = freelancer.email;
        this.educationInputElement.value = freelancer.education;
        this.locationInputElement.value = freelancer.location;
        this.skillsInputElement.value = freelancer.skills;
        this.infoInputElement.value = freelancer.info;

        for (let i = 0; i < this.levelSelectElement.options.length; i++) {
            if (this.levelSelectElement.options[i].value === freelancer.level) {
                this.levelSelectElement.selectedIndex = i;
            }
        }
    }

    validateForm() {
        let isValid = true;

        let textInputArray = [
            this.nameInputElement, this.lastNameInputElement, this.educationInputElement, this.locationInputElement,
            this.skillsInputElement, this.infoInputElement
        ];

        for (let i = 0; i < textInputArray.length; i++) {
            if (textInputArray[i].value.length >= 2) {
                textInputArray[i].classList.remove('is-invalid');
            } else {
                textInputArray[i].classList.add('is-invalid');
                isValid = false;
            }
        }

        if (this.emailInputElement.value && this.emailInputElement.value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            this.emailInputElement.classList.remove('is-invalid');
        } else {
            this.emailInputElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    async updateFreelancer(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const changedData ={}
            if(this.nameInputElement.value !== this.freelancerOriginalData.name) {
                changedData.name = this.nameInputElement.value
            }
            if(this.lastNameInputElement.value !== this.freelancerOriginalData.lastName) {
                changedData.lastName = this.lastNameInputElement.value
            }
            if(this.emailInputElement.value !== this.freelancerOriginalData.email) {
                changedData.email = this.emailInputElement.value
            }
            if(this.educationInputElement.value !== this.freelancerOriginalData.education) {
                changedData.education = this.educationInputElement.value
            }
            if(this.locationInputElement.value !== this.freelancerOriginalData.location) {
                changedData.location = this.locationInputElement.value
            }
            if(this.skillsInputElement.value !== this.freelancerOriginalData.skills) {
                changedData.skills = this.skillsInputElement.value
            }
            if(this.infoInputElement.value !== this.freelancerOriginalData.info) {
                changedData.info = this.infoInputElement.value
            }
            if(this.levelSelectElement.value !== this.freelancerOriginalData.level) {
                changedData.level = this.levelSelectElement.value
            }
            if(this.avatarInputElement.files && this.avatarInputElement.files.length > 0) {
                changedData.avatarBase64 = await FileUtils.convertFileToBase64(this.avatarInputElement.files[0]);
            }

            if (Object.keys(changedData).length > 0) {
                const result = await HttpUtils.request(`/freelancers/${this.freelancerOriginalData.id}`, "PUT", true, changedData);
                if (result.redirect) {
                    this.openNewRoute(result.redirect);
                }

                if(result.error || !result.response || (result.response && result.response.error)) {
                    console.log(result.response.message)
                    return alert('Ошибка запроса при редактирование. Просьба обратиться в поддержку или попробовать сделать повторный запрос позже.')
                }

                return this.openNewRoute(`/freelancers/view?id=${this.freelancerOriginalData.id}`)
            }
        }
    }
}