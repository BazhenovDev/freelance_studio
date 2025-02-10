import {AuthUtils} from "../utils/auth-utils.js";
import {HttpUtils} from "../utils/http-utils.js";

export class LogOut {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        //Проверяем есть ли какие-либо токены в локальном хранилище
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            //Если токенов нет, переводим пользователя на страницу login
            return this.openNewRoute('/login');
        }
        //Иначе делаем запрос на сервер, чтобы разлогинить пользователя
        this.logout().then();
    }

    async logout() {
        //Отправляем запрос на бэкенд, чтобы разлогинить
        const result = await HttpUtils.request('/logout', 'POST', {
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
        });
        console.log(result.response.message);

        //Удаляем данные из локального хранилища
        AuthUtils.removeAuthInfo()

        //Перевродим на страницу логина
        this.openNewRoute('/login');
    }
}