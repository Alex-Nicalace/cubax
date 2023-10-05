import scrollSmooth from './scrollSmooth.js';

/**
 * Класс `ScrollToAnchor` предназначен для плавной прокрутки к якорным ссылкам на веб-странице.
 * @class
 */
class ScrollToAnchor {
  /**
   * Создает экземпляр класса `ScrollToAnchor`.
   * @constructor
   * @param {Object} options - Настройки для создания экземпляра.
   * @param {number} [options.duration=1000] - Продолжительность анимации скролла в миллисекундах.
   */
  constructor({ duration = 1000 } = {}) {
    /**
     * Продолжительность скролла в миллисекундах.
     * @type {number}
     */
    this.duration = duration;

    /**
     * Массив якорных ссылок на странице.
     * @type {HTMLAnchorElement[]}
     */
    this.anchors = Array.from(
      // для выбора всех элементов <a>, у которых атрибут href начинается с решетки и не содержит подстроку "modal"
      // чтобы не конфликтовать с модальными окнами которые должны открываться по хэшу
      document.querySelectorAll('a[href^="#"]:not([href*="modal"])')
    );

    // Инициализация обработчика клика по якорной ссылке.
    this.initAnchorClickHandler();
  }

  /**
   * Инициализирует обработчик клика по якорной ссылке для плавной прокрутки.
   */
  initAnchorClickHandler() {
    const duration = this.duration;

    for (const anchor of this.anchors) {
      anchor.addEventListener('click', function (e) {
        // Предотвращаем стандартное поведение перехода по якорной ссылке.
        e.preventDefault();

        // Получаем хэш якорной ссылки.
        const hash = this.hash;
        if (!hash) return;

        // Выполняем плавную прокрутку к элементу, соответствующему якорю.
        scrollSmooth(hash, { duration });

        // Изменяем URL, чтобы отобразить якорную ссылку в адресной строке (необязательно).
        history.pushState(null, null, hash);
      });
    }
  }

  /**
   * Статический метод для выполнения плавной прокрутки к якорным ссылкам при изменении хэша URL.
   * @static
   * @param {Object} options - Настройки для плавной прокрутки.
   * @param {number} [options.duration=1000] - Продолжительность анимации скролла в миллисекундах.
   */
  static scrollToAnchorOnURLChange({ duration = 1000 } = {}) {
    const checkIsVisible = (selector) => {
      return !!document.querySelector(selector)?.offsetParent;
    };
    /**
     * Обработчик изменения хэша URL.
     * @param {Event} e - Событие изменения хэша URL.
     */
    const handleOnHashChange = (e) => {
      const hash = location.hash;
      if (!hash) return;
      if (!checkIsVisible(hash)) return;

      // Прокручиваем страницу к началу. Т.к. браузер по умолчанию в момент загрузки страницы прокручивается к якорному элементу
      document.documentElement.scrollTop = 0;

      // Выполняем плавную прокрутку к элементу, соответствующему якорю.
      scrollSmooth(hash, { duration });
    };

    // Добавляем обработчик события загрузки страницы и изменения хэша URL.
    window.addEventListener('load', handleOnHashChange);
    window.addEventListener('hashchange', handleOnHashChange);
  }
}

export default ScrollToAnchor;
