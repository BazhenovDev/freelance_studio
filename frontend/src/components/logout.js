export class LogOut {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        //Проверяем есть ли какие-либо токены в локальном хранилище
        if (!localStorage.getItem('accessToken') || !localStorage.getItem('refreshToken')) {
            //Если токенов нет, переводим пользователя на страницу login
            return this.openNewRoute('/login');
        }
        //Иначе делаем запрос на сервер, чтобы разлогинить пользователя
        this.logout().then();
    }

    async logout() {
        //Отправляем запрос на бэкенд, чтобы разлогинить
        const response = await fetch('http://localhost:3000/api/logout', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                refreshToken: localStorage.getItem('refreshToken')
            })
        });
        const result = await response.json();
        console.log(result.message)

        //Удаляем данные из локального хранилища
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');

        //Перевродим на страницу логина
        this.openNewRoute('/login');
    }
}