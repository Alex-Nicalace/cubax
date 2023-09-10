/* 
data-spollers="768, max" на каком брейкпоинте включать отключать
если нет значения то работает в обысном режиме
data-spollers-one - можно открыть только один
data-spoller-close - при клике вне споллера закрывать все сполеры
 */
import Accordion from './detail.js';

/**
 * Класс, представляющий группу Spollers.
 * @class
 */
class Spollers {
  /**
   * Создает новый экземпляр класса Spollers.
   * @constructor
   * @param {HTMLElement} el - Элемент, содержащий Spollers.
   */
  constructor(el) {
    /**
     * HTML-элемент, содержащий Spollers.
     * @type {HTMLElement}
     * @private
     */
    this.el = el;

    /**
     * Массив объектов Accordion, представляющих Spollers.
     * @type {Accordion[]}
     */
    this.items = [];

    if (!(el instanceof HTMLElement)) return;

    /**
     * @type {HTMLDetailsElement[]}
     */
    const details = [...this.el.querySelectorAll('details')].filter(
      (item) =>
        item.tagName === 'DETAILS' && !item.hasAttribute('data-detail-init')
    );

    // Инициализация объектов Accordion для каждого <details> элемента.
    details.forEach((detail) => {
      this.items.push(new Accordion(detail, { isItemSpollers: true }));
    });
    const dataSpollers = this.el.dataset.spollers;
    [this.breakpoint, this.rule] = this.parseDataSpollers(dataSpollers);

    /**
     * Флаг для отслеживания состояния Spollers (свернуты/развернуты).
     * @type {number}
     * @private
     */
    this.flag = 0;

    /**
     * Флаг для управления открытием только одного элемента.
     * @type {boolean}
     */
    this.isOneOpen = this.el.hasAttribute('data-spollers-one');

    /**
     * Флаг для управления закрытием Spollers при клике вне них.
     * @type {boolean}
     */
    this.isSpollersClose = this.el.hasAttribute('data-spoller-close');

    /**
     * Ссылка на метод onDocumentClick, привязанный к текущему экземпляру Spollers.
     * @type {function}
     * @private
     */
    this.onDocumentClick = this.onDocumentClick.bind(this);

    /**
     * Ссылка на метод onDetailsChangeState, привязанный к текущему экземпляру Spollers.
     * @type {function}
     * @private
     */
    this.onDetailsChangeState = this.onDetailsChangeState.bind(this);

    // Включение обработчиков событий и функциональности Spollers.
    this.on();

    if (this.breakpoint && this.rule) {
      this.onResize();
      window.addEventListener('resize', () => this.onResize());
    }

    this.el.addEventListener('click', (e) => this.onElClick(e));
  }

  /**
   * Разбирает строку данных Spollers и возвращает брейкпоинт и правило.
   * @param {string} dataSpollers - Строка с данными Spollers.
   * @returns {Array} - Массив, содержащий брейкпоинт и правило.
   * @private
   */
  parseDataSpollers(dataSpollers) {
    const array = dataSpollers.split(',').map((item) => item.trim());
    return [+array[0], array[1]];
  }

  /**
   * Отключает функциональность Spollers.
   */
  off() {
    this.expandAll();

    this.el.removeAttribute('data-spollers-minimize');
    this.isSpollersStateMinimize = false;

    this.el.removeEventListener(
      'details-change-state',
      this.onDetailsChangeState
    );
  }

  /**
   * Включает функциональность Spollers.
   */
  on() {
    this.shrinkAll();

    this.el.setAttribute('data-spollers-minimize', '');
    this.isSpollersStateMinimize = true;
    // включить прослушивание открытия сполеров и если есть настройка закрывать сполеры
    // при клике вне споеров, то закрывать
    if (this.isSpollersClose) {
      this.el.addEventListener(
        'details-change-state',
        this.onDetailsChangeState
      );
    }
  }

  /**
   * Обработчик события изменения размера окна.
   */
  onResize() {
    if (this.breakpoint >= window.innerWidth) {
      if (this.flag == -1 || this.flag == 0) {
        switch (this.rule) {
          case 'min':
            // выключение
            this.off();
            break;
          case 'max':
            // включение
            this.on();
            break;
          default:
            this.on();
            break;
        }
        this.flag = 1;
      }
    } else {
      if (this.flag == 1 || this.flag == 0) {
        switch (this.rule) {
          case 'min':
            // включение
            this.on();
            break;
          case 'max':
            // выключение
            this.off();
            break;
          default:
            this.off();
            break;
        }
        this.flag = -1;
      }
    }
  }

  /**
   * Обработчик клика на элементе Spollers.
   * @param {Event} e - Объект события "click".
   */
  onElClick(e) {
    const summary = e && e.target && e.target.closest('summary');
    if (!summary) return;
    e.preventDefault();
    if (!this.isSpollersStateMinimize) return;

    const curentDetails = this.items.find(
      (item) => item.el === summary.parentElement
    );
    if (this.isOneOpen) {
      this.items.forEach((item) => {
        if (item.el !== curentDetails.el) {
          item.shrink();
        }
      });
    }
    curentDetails.onClick(e);
  }

  /**
   * Проверяет, есть ли открытые элементы Spollers.
   * @returns {boolean} - True, если есть открытые элементы, в противном случае - false.
   */
  isExistsOpen() {
    return this.items.some((item) => item.el.open);
  }

  /**
   * Сворачивает все элементы Spollers.
   */
  shrinkAll() {
    this.items.forEach((element) => {
      element.shrink();
    });
  }

  /**
   * Разворачивает все элементы Spollers.
   */
  expandAll() {
    this.items.forEach((element) => {
      element.open();
    });
  }

  /**
   * Обработчик клика вне элементов Spollers.
   * @param {Event} e - Объект события "click".
   */
  onDocumentClick(e) {
    const target = e && e.target;
    if (!target) return;
    if (!this.el.contains(target)) {
      this.shrinkAll();
      document.removeEventListener('click', this.onDocumentClick);
    }
  }

  /**
   * Обработчик изменения состояния элемента Spollers.
   * @param {Event} e - Объект события "details-change-state".
   */
  onDetailsChangeState(e) {
    const target = e && e.target;
    const open = e && e.detail && e.detail.open;
    if (!target) return;
    if (open) {
      // добавить прослушивания клика вне сполера
      document.addEventListener('click', this.onDocumentClick);
    }
  }
}

export default Spollers;
