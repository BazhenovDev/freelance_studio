import {AuthUtils} from "../../utils/auth-utils.js";
import {AuthService} from "../../services/auth-service";

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
        await AuthService.logout({
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
        });

        //Удаляем данные из локального хранилища
        AuthUtils.removeAuthInfo()

        //Перевродим на страницу логина
        this.openNewRoute('/login');
    }
}