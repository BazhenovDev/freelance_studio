import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";

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

        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    }

    //Функция валидации формы
    validateForm() {
        let isValid = true;

        //Проверка имени на содержание не менее 2 символов
        if (this.nameElement.value && this.nameElement.value.length >= 2) {
            this.nameElement.classList.remove('is-invalid');
        } else {
            this.nameElement.classList.add('is-invalid');
            isValid = false;
        }
        //Проверка фамилии на содержание не менее 2 символов
        if (this.lastNameElement.value && this.lastNameElement.value.length >= 2) {
            this.lastNameElement.classList.remove('is-invalid');
        } else {
            this.lastNameElement.classList.add('is-invalid');
            isValid = false;
        }

        //Проверка валидности е-мейла
        if (this.emailElement.value && this.emailElement.value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }
        //Проверка пароля, минимум 6 символов включающие в себя букву в верхнем и нижнем регистре, цифру и спецсимвол
        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*[a-zа-я])(?=.*[A-ZА-Я])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Zа-яА-Я0-9!@#$%^&*]{6,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }

        //Проверка повторяющегося пароля, чтобы совпадал с паролем
        if (this.passwordRepeatElement.value && this.passwordRepeatElement.value === this.passwordElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
        } else {
            this.passwordRepeatElement.classList.add('is-invalid');
            isValid = false;
        }

        //Проверка на нажатый чекбокс
        if (this.agreeElement.checked) {
            this.agreeElement.classList.remove('is-invalid')
        } else {
            this.agreeElement.classList.add('is-invalid');
            isValid = false;
        }

        //Возвращаем флаг, false - если минимум одно поле не прошло проверку, иначе true
        return isValid;
    }


    //Нажатие кнопки Зарегистрироваться
    async signUp() {
        //Убираем поле с ошибками, если оно есть
        this.commonErrorElement.style.display = 'none';

        //Проверяем, если флаг в функции validateForm true, то отправляем форму на сервер, если false, то ничего не делаем
        if (this.validateForm()) {
            const result = await HttpUtils.request('/signup', 'POST', false, {
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value
            });

            if (result.error || !result.response || (result.response && (!result.response.accessToken || !result.response.refreshToken || !result.response.id || !result.response.name))) {
                if (result.response.message) {
                    this.commonErrorElement.innerText = result.response.message;
                }
                this.commonErrorElement.style.display = 'block';
                return;
            }

            AuthUtils.setAuthInfo(result.response.accessToken, result.response.refreshToken, {
                id: result.response.id,
                name: result.response.name
            });

            this.openNewRoute('/');
        }
    }
}