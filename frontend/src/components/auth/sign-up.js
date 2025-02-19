import {AuthUtils} from "../../utils/auth-utils.js";
import {ValidationUtils} from "../../utils/validation-utils.js";
import {AuthService} from "../../services/auth-service.js";

export class SignUp {
    emailElement = null;
    passwordElement = null;
    agreeElement = null;
    commonErrorElement = null;

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('last-name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        this.agreeElement = document.getElementById('agree');
        this.commonErrorElement = document.getElementById('common-error');

        this.validations = [
            {element: this.nameElement},
            {element: this.lastNameElement},
            {element: this.emailElement, options: {pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/}},
            {element: this.passwordElement, options: {pattern: /^(?=.*[a-zа-я])(?=.*[A-ZА-Я])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Zа-яА-Я0-9!@#$%^&*]{6,}$/}},
            {element: this.passwordRepeatElement, options: {compareTo: this.passwordElement.value}},
            {element: this.agreeElement, options: {checked: true}},
        ]

        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    }


    //Нажатие кнопки Зарегистрироваться
    async signUp() {
        //Убираем поле с ошибками, если оно есть
        this.commonErrorElement.style.display = 'none';

        for (let i = 0; i < this.validations.length; i++) {
            if (this.validations[i].element === this.passwordRepeatElement) {
                this.validations[i].options.compareTo = this.passwordElement.value;
            }
        }

        //Проверяем, если флаг в функции validateForm true, то отправляем форму на сервер, если false, то ничего не делаем
        if (ValidationUtils.validateForm(this.validations)) {

            const signupResult = await AuthService.signUp({
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value
            });

            if (signupResult) {
                AuthUtils.setAuthInfo(signupResult.accessToken, signupResult.refreshToken, {
                    id: signupResult.id,
                    name: signupResult.name
                });
                return this.openNewRoute('/');
            }

            if (signupResult.message) {
                this.commonErrorElement.innerText = signupResult.message;
            }
            this.commonErrorElement.style.display = 'block';
        }
    }
}