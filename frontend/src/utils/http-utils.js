import config from "../config/config.js";
import {AuthUtils} from "./auth-utils.js";

// Утилита для работы с запросами
export class HttpUtils {

    // Шаблон для запросов
    // в url передаём путь на который происходит запрос, method выбираем метод, по умолчанию это GET запрос
    // useAuth используется для того, нужна ли проверка на авторизационный токен
    // body по умолчанию null, т.к. в GET запросе его нет
    static async request(url, method = "GET", useAuth = true, body = null) {
        // в переменной result хранится объект с буливым значением ошибки true или false и ответом запроса в response
        const result = {
            error: false,
            response: null,
        };

        // в переменной params хранится метод, который передаётся в запросе, и заголовки headers по умолчанию
        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
        }

        // переменная token по умолчанию пустая, но
        let token = null;
        // Если флаг useAuth стоит true
        if (useAuth) {
            // То в переменной token будет храниться аксес токен
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            // Если в переменной token что-то есть, то в заголовки header добавляется имя свойства authorization со значением
            // Которое хранится в token
            if (token) {
                params.headers['authorization'] = token;
            }

        }

        // Если в body что-то передали при запросе, то мы приводим его к виду строки методом JSON.stringify и добавляем
        // В объект params, свойство body где в значение будет строка передаваемая в запросе
        if (body) {
            params.body = JSON.stringify(body)
        }

        // Переменная response по умолчанию пустая
        let response = null;
        // Пробуем обработать запрос внутри try catch, чтобы в случае ошибки приложение не сломалось
        try {
            // В переменную response записываем ответ запроса
            // В config.api находится api с доменным именем
            // В url путь куда пользователь хочет пройти
            // В params передаём параметры, которые находятся в переменной выше, и содержит, то что в неё попало из сделанных проверок выше
            response = await fetch(config.api + url, params);
            // В объект result в свойство response преобразуем ответ в виде JSON с помощью метода .json()
            result.response = await response.json();
            // Если есть ошибка
        } catch (e) {
            // То делаем флаг error в объекте result - true
            result.error = true;
            // Выводим ошибку в консоль и завершаем запрос
            console.log(e);
            return result;
        }

        // Если статус запроса не в пределах 200-299
        if (response.status < 200 || response.status >= 300) {
            // Делаем error true в объекте result
            result.error = true;
            // Если флаг useAuth true и статус запроса 401
            if (useAuth && response.status === 401) {
                // Если токена нет
                if (!token) {
                    // В redirect передаём /login для перевода пользователя на эту страницу
                    result.redirect = '/login';
                } else {
                    // Если токен устарел или невалиден (нужно обновлять) делаем обновление
                    const updateTokenResult = await AuthUtils.updateRefreshToken();
                    // Если updateTokenResult имеется
                    if (updateTokenResult) {
                        // Повторно отправляем запрос
                        return this.request(url, method, useAuth, body);
                        // Иначе переводим пользователя на страницу /login
                    } else {
                        result.redirect = '/login';
                    }
                }
            }
        }

        return result;
    }
}