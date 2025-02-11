import config from "../config/config.js";

export class AuthUtils {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoTokenKey = 'userInfo';

    static setAuthInfo(accessToken, refreshToken, userInfo = null) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
        }
    }

    static removeAuthInfo() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }

    static getAuthInfo(key = null) {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return localStorage.getItem(key)
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoTokenKey]: localStorage.getItem(this.userInfoTokenKey),
            }
        }
    }

    // Делаем обновление токена
    static async updateRefreshToken() {
        // Флаг result для определения, удалять токены или нет
        let result = false;
        // Получаем рефреш токен
        const refreshToken = this.getAuthInfo(this.refreshTokenKey);
        // Если рефреш токен есть
        if (refreshToken) {
            // Делаем запрос на обновление токена
            const response = await fetch(config.api + '/refresh', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                // Передаём текущий рефреш токен
                body: JSON.stringify({
                    refreshToken: refreshToken
                })
            });
            // Если есть ответ и статус 200
            if (response && response.status === 200) {
                // Ответ преобразуем в JSON и сохраняем в переменную tokens
               const tokens = await response.json();
               // Есть в переменной tokens что-то есть и нет ошибки tokens.error
               if (tokens && !tokens.error) {
                   // Обновляем рефреш и аксес токены
                   this.setAuthInfo(tokens.accessToken, tokens.refreshToken);
                   // Флаг result переводим в true
                   result = true;
               }
            }
        }

        // Если в result false, то удаляем все токены
        if (!result) {
            this.removeAuthInfo();
        }

        // Возвращаем ответ результата false или true
        return result;
    }
}