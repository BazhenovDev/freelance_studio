import {AuthUtils} from "../../utils/auth-utils.js";
import {ValidationUtils} from "../../utils/validation-utils.js";
import {AuthService} from "../../services/auth-service.js";

export class Login {

    emailElement = null;
    passwordElement = null;
    rememberMeElement = null;
    commonErrorElement = null;

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberMeElement = document.getElementById('remember-me');
        this.commonErrorElement = document.getElementById('common-error');

        this.validations = [
            {element: this.passwordElement},
            {element: this.emailElement, options: {pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/}},
        ];

        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    }

    async login() {
        this.commonErrorElement.style.display = 'none';

        if (ValidationUtils.validateForm(this.validations)) {

            const loginResult = await AuthService.logIn({
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked
            });

            if (loginResult) {
                AuthUtils.setAuthInfo(loginResult.accessToken, loginResult.refreshToken, {
                    id: loginResult.id,
                    name: loginResult.name
                });
                return this.openNewRoute('/');
            }

            if (loginResult.message) {
                this.commonErrorElement.innerText = loginResult.message;
            }
            this.commonErrorElement.style.display = 'block';

        }
    }
}