export class FileUtils {
    static loadPageScript(src) {
        return new Promise((resolve, reject) => {
            // Создаём тег script
            const script = document.createElement('script');
            // в атрибут src подставляем путь js с названием скрипка который хранится в массиве
            script.src = src;
            script.onload = () => resolve(`Script loaded: ${src}`);
            script.onerror = () => reject(new Error(`Script load Error for: ${src}`));
            // Вставляем имеющийся скрипт в body
            document.body.appendChild(script);
        })
    }

    static loadPageStyle(src, insertBeforeElement) {
        // Создаём тег link
        const link = document.createElement('link');
        // в атрибур rel подставляем 'stylesheet', type 'text/css'
        link.rel = 'stylesheet';
        link.type = 'text/css';
        // в атрибут href подставляем путь css с названием стиля который хранится в массиве
        link.href = src;
        // Вставляем этот link перед элементом передаваемым в insertBeforeElement атрибуте
        document.head.insertBefore(link, insertBeforeElement);
    }

    // По мере необходимости в будущем сделать методы:

    // unloadPageScript



    // unloadPageStyle

    static convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result)
            reader.onerror = () => reject(new Error('Can not convert this file'))
        })



    }


}