import { throttle } from './decorators.js';

/**
 * Класс для добавления соответствующих классов хэдеру при скролле.
 * @class
 */
class ScrollWindow {
  /**
   * Создает экземпляр класса ScrollWindow.
   * @constructor
   */
  constructor() {
    /**
     * Показатель скролла на предыдущем шаге.
     * @type {number|undefined}
     */
    this.prevScrollY;

    // Привязка контекста для обработчика события прокрутки
    this.onScroll = this.onScroll.bind(this);
    window.addEventListener('scroll', this.onScroll);
  }

  /**
   * Обработчик события прокрутки страницы.
   * @param {Event} e - Объект события прокрутки.
   */
  onScroll(e) {
    const { scrollY } = window;
    let directScroll =
      this.prevScrollY === undefined
        ? 'none'
        : scrollY > this.prevScrollY
        ? 'down'
        : 'up';

    // Создание события 'scrollWindow' для передачи информации о скролле
    const event = new CustomEvent('scrollWindow', {
      bubbles: true,
      detail: {
        directScroll, // Направление прокрутки ('none', 'up' или 'down')
        scrollY, // Текущая позиция скролла по оси Y
      },
    });
    document.dispatchEvent(event);
    this.prevScrollY = scrollY; // Обновление предыдущей позиции скролла
  }

  /**
   * Инициализация переключения классов хэдеру в зависимости от прокрутки.
   * @param {Object} options - Параметры для инициализации скроллируемого заголовка.
   * @param {string} [options.headerSelector='header'] - Селектор заголовка, который будет реагировать на скролл.
   * @param {string} [options.classNameScroll='header_scroll'] - Название класса, который будет добавляться при скролле.
   * @param {string} [options.classNameScrollDown='header_scroll_down'] - Название класса, который будет добавляться при скролле вниз.
   * @param {string} [options.classNameScrollUp='header_scroll_up'] - Название класса, который будет добавляться при скролле вверх.
   * @param {string} [options.classNameScrollStop='header_scroll_stop'] - Название класса, который будет добавляться при прекращении скролла.
   * @param {number} [options.delayStopClass=500] - Задержка перед добавлением класса classNameScrollStop (в миллисекундах).
   * @param {number} [options.startScroll] - Через какое количество прокрученных вниз пикселей необходимо добавить класс. Если не указано, берется высота хэдера.
   */
  toggleClassesHeader({
    headerSelector = 'header',
    classNameScroll = 'header_scroll',
    classNameScrollDown = 'header_scroll_down',
    classNameScrollUp = 'header_scroll_up',
    classNameScrollStop = 'header_scroll_stop',
    delayStopClass = 500,
    startScroll,
  } = {}) {
    /**
     * Элемент заголовка, которому будут добавляться классы.
     * @type {HTMLElement}
     */
    const header = document.querySelector(headerSelector);
    startScroll = startScroll || header.offsetHeight; // Если не указано, берется высота хэдера

    /**
     * Задержка перед добавлением класса classNameScrollStop.
     * @type {number}
     */
    let timer;

    /**
     * Обработчик события прокрутки 'scrollWindow' с применением throttle.
     * @param {CustomEvent} e - Объект пользовательского события 'scrollWindow'.
     */
    const onScrollWindow = (e) => {
      const { directScroll, scrollY } = e.detail;
      clearTimeout(timer);
      header.classList.remove(classNameScrollStop);

      if (scrollY > startScroll) {
        header.classList.add(classNameScroll);
        if (directScroll == 'down') {
          header.classList.add(classNameScrollDown);
          header.classList.remove(classNameScrollUp);
        } else if (directScroll == 'up') {
          header.classList.remove(classNameScrollDown);
          header.classList.add(classNameScrollUp);
        }
        timer = setTimeout(
          () => header.classList.add(classNameScrollStop),
          delayStopClass
        );
      } else {
        header.classList.remove(classNameScroll);
        header.classList.remove(classNameScrollUp);
        header.classList.remove(classNameScrollDown);
        header.classList.remove(classNameScrollStop);
      }
    };

    // Использование функции throttle для ограничения частоты вызова onScrollWindow
    const throttleScrollWindow = throttle(onScrollWindow, 500);
    document.addEventListener('scrollWindow', throttleScrollWindow);
  }
}

export default ScrollWindow;
