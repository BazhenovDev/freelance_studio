/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _router_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./router.js */ \"./src/router.js\");\n\r\n\r\nclass App {\r\n    constructor() {\r\n        new _router_js__WEBPACK_IMPORTED_MODULE_0__.Router();\r\n    }\r\n}\r\n\r\n(new App());\n\n//# sourceURL=webpack://frontend/./src/app.js?");

/***/ }),

/***/ "./src/components/dashboard.js":
/*!*************************************!*\
  !*** ./src/components/dashboard.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Dashboard: () => (/* binding */ Dashboard)\n/* harmony export */ });\nclass Dashboard {\r\n    constructor() {\r\n        console.log('DASHBOARD');\r\n    }\r\n}\n\n//# sourceURL=webpack://frontend/./src/components/dashboard.js?");

/***/ }),

/***/ "./src/components/login.js":
/*!*********************************!*\
  !*** ./src/components/login.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Login: () => (/* binding */ Login)\n/* harmony export */ });\nclass Login {\r\n    constructor() {\r\n        console.log('LOGIN');\r\n    }\r\n}\n\n//# sourceURL=webpack://frontend/./src/components/login.js?");

/***/ }),

/***/ "./src/components/sign-up.js":
/*!***********************************!*\
  !*** ./src/components/sign-up.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SignUp: () => (/* binding */ SignUp)\n/* harmony export */ });\nclass SignUp {\r\n    constructor() {\r\n        console.log('SIGN-UP');\r\n    }\r\n}\n\n//# sourceURL=webpack://frontend/./src/components/sign-up.js?");

/***/ }),

/***/ "./src/router.js":
/*!***********************!*\
  !*** ./src/router.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Router: () => (/* binding */ Router)\n/* harmony export */ });\n/* harmony import */ var _components_dashboard_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/dashboard.js */ \"./src/components/dashboard.js\");\n/* harmony import */ var _components_login_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/login.js */ \"./src/components/login.js\");\n/* harmony import */ var _components_sign_up_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/sign-up.js */ \"./src/components/sign-up.js\");\n\r\n\r\n\r\n\r\nclass Router {\r\n    constructor() {\r\n        this.titlePageElement = document.getElementById('title');\r\n        this.contentPageElement = document.getElementById('content');\r\n        this.initEvents();\r\n        this.routes = [\r\n            {\r\n                route: '/',\r\n                title: 'Дашборд',\r\n                filePathTemplate: '/templates/dashboard.html',\r\n                load: () => {\r\n                    new _components_dashboard_js__WEBPACK_IMPORTED_MODULE_0__.Dashboard();\r\n                },\r\n            },\r\n            {\r\n                route: '/404',\r\n                title: 'Страница не найдена',\r\n                filePathTemplate: '/templates/404.html',\r\n            },\r\n            {\r\n                route: '/login',\r\n                title: 'Авторизация',\r\n                filePathTemplate: '/templates/login.html',\r\n                load: () => {\r\n                    new _components_login_js__WEBPACK_IMPORTED_MODULE_1__.Login();\r\n                },\r\n            },\r\n            {\r\n                route: '/sign-up',\r\n                title: 'Регистрация',\r\n                filePathTemplate: '/templates/sign-up.html',\r\n                load: () => {\r\n                    new _components_sign_up_js__WEBPACK_IMPORTED_MODULE_2__.SignUp();\r\n                },\r\n            },\r\n        ];\r\n    }\r\n\r\n    initEvents() {\r\n        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));\r\n        window.addEventListener('popstate', this.activateRoute.bind(this));\r\n    }\r\n\r\n    async activateRoute() {\r\n        const urlRoute = window.location.pathname;\r\n        const newRoute = this.routes.find(item => item.route === urlRoute);\r\n        if (newRoute) {\r\n            if (newRoute.title) {\r\n                this.titlePageElement.innerText = `${newRoute.title} | Freelance Studio`;\r\n            }\r\n\r\n            if (newRoute.filePathTemplate) {\r\n                this.contentPageElement.innerHTML = await fetch(newRoute.filePathTemplate)\r\n                    .then(response => response.text());\r\n            }\r\n\r\n            if (newRoute.load && typeof newRoute.load === 'function') {\r\n                newRoute.load();\r\n            }\r\n\r\n        } else {\r\n            console.log('No route found');\r\n            window.location = '/404';\r\n        }\r\n    }\r\n\r\n}\n\n//# sourceURL=webpack://frontend/./src/router.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app.js");
/******/ 	
/******/ })()
;