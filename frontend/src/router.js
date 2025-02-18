import {Dashboard} from "./components/dashboard.js";
import {Login} from "./components/auth/login.js";
import {SignUp} from "./components/auth/sign-up.js";
import {LogOut} from "./components/auth/logout.js";
import {FreelancersList} from "./components/freelancers/freelancers-list.js";
import {FileUtils} from "./utils/file-utils.js";
import {FreelancersView} from "./components/freelancers/freelancers-view.js";
import {FreelancerCreate} from "./components/freelancers/freelancer-create.js";
import {FreelancersEdit} from "./components/freelancers/freelancers-edit.js";
import {FreelancersDelete} from "./components/freelancers/freelancers-delete.js";
import {OrdersList} from "./components/orders/orders-list.js";
import {OrdersView} from "./components/orders/orders-view.js";
import {OrdersCreate} from "./components/orders/orders-create.js";
import {OrdersEdit} from "./components/orders/orders-edit.js";
import {OrdersDelete} from "./components/orders/orders-delete.js";
import {AuthUtils} from "./utils/auth-utils";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.adminLteStyleElement = document.getElementById('adminlte_style');
        this.userName = null;

        this.currentYear = new Date().getFullYear();

        this.initEvents();
        // Роут с имеющимися страницами на сайте
        this.routes = [
            {
                // Путь роута
                route: '/',
                // Заголовок роута
                title: 'Дашборд',
                // Путь до html документа где хранится роут
                filePathTemplate: '/templates/pages/dashboard.html',
                // Путь до html документа, где хранится лайаут
                useLayout: '/templates/layout.html',
                // Метод load
                load: () => {
                    new Dashboard(this.openNewRoute.bind(this));
                },
                scripts: [
                    'moment.min.js',
                    'moment-ru-locale.js',
                    'fullcalendar.js',
                    'fullcalendar-locale-ru.js'
                ],
                styles: [
                    'fullcalendar.css'
                ]
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false,
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('login-page');
                    document.body.style.height = '100vh';
                    // Тут передаём в класс метод openNewRoute
                    new Login(this.openNewRoute.bind(this));
                },
                // Метод unload
                unload: () => {
                    document.body.classList.remove('login-page');
                    document.body.style.height = 'auto';
                },
                // Название дополнительных стилей, которые нужно подгрузить/удалить
                styles: ['icheck-bootstrap.min.css'],
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('register-page');
                    document.body.style.height = '100vh';
                    new SignUp(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('register-page');
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css'],
            },
            {
                route: '/logout',
                load: () => {
                    new LogOut(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/freelancers',
                title: 'Таблица фрилансеров',
                filePathTemplate: '/templates/pages/freelancers/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancersList(this.openNewRoute.bind(this));
                },
                styles: ['dataTables.bootstrap4.min.css'],
                scripts: ['jquery.dataTables.min.js', 'dataTables.bootstrap4.min.js']
            },
            {
                route: '/freelancers/view',
                title: `Фрилансер`,
                filePathTemplate: '/templates/pages/freelancers/view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancersView(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/freelancers/create',
                title: 'Создание нового фрилансера',
                filePathTemplate: '/templates/pages/freelancers/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancerCreate(this.openNewRoute.bind(this));
                },
                scripts: ['bs-custom-file-input.min.js']
            },
            {
                route: '/freelancers/edit',
                title: 'Редактирование фрилансера',
                filePathTemplate: '/templates/pages/freelancers/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancersEdit(this.openNewRoute.bind(this));
                },
                scripts: ['bs-custom-file-input.min.js']
            },
            {
                route: '/freelancers/delete',
                load: () => {
                    new FreelancersDelete(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/orders',
                title: 'Заказы',
                filePathTemplate: '/templates/pages/orders/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OrdersList(this.openNewRoute.bind(this));
                },
                styles: ['dataTables.bootstrap4.min.css'],
                scripts: ['jquery.dataTables.min.js', 'dataTables.bootstrap4.min.js']
            },
            {
                route: '/orders/view',
                title: `Заказ`,
                filePathTemplate: '/templates/pages/orders/view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OrdersView(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/orders/create',
                title: 'Создание заказа',
                filePathTemplate: '/templates/pages/orders/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OrdersCreate(this.openNewRoute.bind(this));
                },
                styles: [
                    'tempusdominus-bootstrap-4.min.css',
                    'select2.min.css',
                    'select2-bootstrap4.min.css'
                ],
                scripts: [
                    'select2.full.min.js',
                    'moment.min.js',
                    'moment-ru-locale.js',
                    'tempusdominus-bootstrap-4.min.js',
                ]
            },
            {
                route: '/orders/edit',
                title: 'Редактирование заказа',
                filePathTemplate: '/templates/pages/orders/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OrdersEdit(this.openNewRoute.bind(this));
                },
                styles: [
                    'tempusdominus-bootstrap-4.min.css',
                    'select2.min.css',
                    'select2-bootstrap4.min.css'
                ],
                scripts: [
                    'select2.full.min.js',
                    'moment.min.js',
                    'moment-ru-locale.js',
                    'tempusdominus-bootstrap-4.min.js',
                ]
            },
            {
                route: '/orders/delete',
                load: () => {
                    new OrdersDelete(this.openNewRoute.bind(this));
                },
            },
        ];
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    // Активируется функция openNewRoute в аргумент url передаём pathname полученный в функции clickHandler, данная функция
    // openNewRoute в принципе вызывается из функции clickHandler в данной строке await this.openNewRoute(url); где в аргумент передаётся
    // pathname ссылки на которую был произведён клик
    async openNewRoute(url) {
        // В переменную currentRoute записываем текущий pathname который на данной странице
        const currentRoute = window.location.pathname;
        // в url вставляем pathname который получили в функции clickHandler, который был передан тут: await this.openNewRoute(url);
        history.pushState({}, '', url);
        // тут вызываем функцию activateRoute, где в currentRoute передаём текущим pathname страницы!!!
        // Т.е если находясь на главной странице у нас pathname = /, то в currentRoute будет записан '/'
        // А history.pushState({}, '', url); здесь изменён pathname на тот, в котором мы кликнули на ссылку, например '/freelancers'
        // Соответственно в url у нас уже будет url/freelancers, но передаём мы в currentRoute значение текущей страницы '/'
        await this.activateRoute(null, currentRoute);
    }

    // Функция, которая обрабатываем клики на всей странице
    async clickHandler(e) {
        let element = null;
        // Если кликнутый элемент с тегом a, то в переменную element присваиваем его
        if (e.target.nodeName === 'A') {
            element = e.target;
            // Иначе, если у родительского элемента по которому кликнули тег a, то в переменную element присваиваем его
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }
        // Если в element что-то есть
        if (element) {
            // Делаем отмену события
            e.preventDefault();

            // В url находим полный url страницы, вызываем метод replace, внутрь которого передаём домен и заменяем его на пустую строку, останется только путь pathname
            const url = element.href.replace(window.location.origin, '');

            // Присваиваем текущий pathname
            const currentRoute = window.location.pathname;
            // Если в url ничего нет, или текущий currentRoute строго равен url без # (т.к. мы её удаляем с помощью метода replace
            // Или он начинается строго с javascript:void(0), то прерываем функцию с помощью return
            if (!url || (currentRoute === url.replace('#', '')) || url === '/#' || url.startsWith('javascript:void(0)')) {
                return;
            }
            // Иначе вызываем openNewRoute и передаём туда содержание переменной url
            await this.openNewRoute(url);
        }
    }

    // Тут мы получаем oldRoute из функции openNewRoute
    async activateRoute(e, oldRoute = null) {
        // Если oldRoute есть, то мы проходимся по массиву роутов и находим его
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            // Если есть массив стилей, то проходимся по нему и удаляем их со страницы
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove();
                })
            }
            // Если есть массив скриптов, то проходимся по нему и удаляем их со страницы
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove();
                })
            }
            // Если есть метод unload и проверяем, что это функция, то активируем её
            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }
        }

        // Тут берём уже текущий pathname в url
        const urlRoute = window.location.pathname;
        // Проходимся по массиву роутов и в newRoute записываем текущий роут
        const newRoute = this.routes.find(item => item.route === urlRoute);


        if (newRoute) {
            // Если в newRoute что-то есть, проверяем, есть ли массив стилей
            if (newRoute.styles && newRoute.styles.length > 0) {
                // Если есть массив стилей, то проходимся по нему
                newRoute.styles.forEach(style => {
                    // С помощью утилиты loadPageStyle подгружаем стили
                    FileUtils.loadPageStyle(`/css/${style}`, this.adminLteStyleElement)
                })
            }
            // Проверяем есть ли массив скриптов
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                // Если есть массив скриптов, то проходимся по нему
                for (const script of newRoute.scripts) {
                    // С помощью текущего промиса последовательно загружаем скрипты
                    await FileUtils.loadPageScript(`/js/${script}`);
                }
            }

            // Если у роута есть title в объекте, то подставляем его ниже в условии
            if (newRoute.title) {
                this.titlePageElement.innerText = `${newRoute.title} | Freelance Studio`;
            }

            // Проверяем есть ли что-то в filePathTemplate
            if (newRoute.filePathTemplate) {
                // в переменную contentBlock сохраняем элемент, который хранится в this.contentPageElement
                let contentBlock = this.contentPageElement;
                // Проверяем есть ли свойство useLayout в объекте newRoute
                if (newRoute.useLayout) {
                    // Если есть useLayout, то с помощью fetch асинхронно вставляем его в contentBlock
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    // Тут переопределяем переменную contentBlock и присваиваем ей элемент с id content-layout
                    contentBlock = document.getElementById('content-layout');
                    // Находим дату в футоре
                    let footerYear = document.getElementById('current-year');
                    // Вставляем текущий год
                    footerYear.innerText = this.currentYear.toString();
                    // Добавляем для body определённые классы, которые необходимо подтянуть из adminLTE для нашего лайаута
                    document.body.classList.add('sidebar-mini', 'layout-fixed');

                    //Добавление ФИО пользователя в лайаут
                    this.profileNameElement = document.getElementById('profile-name');
                    if (!this.userName) {
                        let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
                        if (userInfo) {
                            userInfo = JSON.parse(userInfo)
                            if (userInfo && userInfo.name) {
                                this.userName = userInfo.name
                            }
                        }
                    }
                    this.profileNameElement.innerText = this.userName;


                    // Делает ссылку страницы активной, на которой находится пользователь в лайауте
                    this.activateMenuItem(newRoute)
                } else {
                    // Если useLayout в newRoute нет, то удаляем лишние классы, которые необходимы только для лайаута
                    document.body.classList.remove('sidebar-mini', 'layout-fixed');
                }
                // Асинхронно вставляем страничку из filePathTemplate в переопределённую переменную contentBlock, в которой хранится 'content-layout'
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }

            // Проверяем есть ли в newRoute метод load, если да и это функция, то вызываем его
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }

            // Если newRoute не существует, то отправляем пользователя на страницу 404
        } else {
            console.log('No route found');
            history.pushState({}, '', '/404');
            await this.activateRoute();
        }
    }

    // Функция проверяет, на каком роуте мы находимся и в лайауте у активной странице делает ссылку с классом active
    // Показывая активную страницу
    activateMenuItem(route) {
        document.querySelectorAll('.sidebar .nav-link').forEach(item => {
            const href = item.getAttribute('href');
            if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        })
    }
}