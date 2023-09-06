/**
 * Класс, представляющий аккордеон для элементов HTML <details>.
 * @class
 */
class Accordion {
  /**
   * Создает новый экземпляр класса Accordion.
   * @constructor
   * @param {HTMLDetailsElement | string} el - Элемент <details> или селектор.
   * @param {Object} options - Настройки аккордеона.
   * @param {number} [options.duration=0.3] - Продолжительность анимации в секундах.
   * @param {string} [options.timingFunction='ease-out'] - Тип анимации (CSS timing function).
   * @param {boolean} [options.isItemSpollers=false] - Является ли элемент частью Spollers.
   */
  constructor(el, options = {}) {
    if (typeof el === 'string') {
      const elements = document.querySelectorAll(el);
      /**
       * Массив объектов Accordion, представляющих Spollers.
       * @type {Accordion[]}
       */
      const accordions = [];
      elements.forEach((element) => {
        accordions.push(new Accordion(element, options));
      });
      return accordions;
    }
    this.initDetails(el, options);
  }
  /**
   * Создает новый экземпляр класса Accordion.
   * @constructor
   * @param {HTMLDetailsElement | string} el - Элемент <details> или селектор.
   * @param {Object} options - Настройки аккордеона.
   * @param {number} [options.duration=0.3] - Продолжительность анимации в секундах.
   * @param {string} [options.timingFunction='ease-out'] - Тип анимации (CSS timing function).
   * @param {boolean} [options.isItemSpollers=false] - Является ли элемент частью Spollers.
   */
  initDetails(
    el,
    { duration = 0.3, timingFunction = 'ease-out', isItemSpollers = false } = {}
  ) {
    if (!el instanceof HTMLDetailsElement) return this;
    /**
     * HTML-элемент <details>, с которым связан аккордеон.
     * @type {HTMLDetailsElement}
     * @private
     */
    this.el = el;
    // Store the <summary> element
    this.summary = el.querySelector('summary');
    // Store the <div class="content"> element
    this.content = el.querySelector('summary + *');
    /**
     * Продолжительность анимации в миллисекундах.
     * @type {number}
     */
    this.duration = duration * 1000;
    /**
     * Тип анимации (CSS timing function).
     * @type {string}
     */
    this.timingFunction = timingFunction;
    /**
     * Флаг, указывающий, является ли элемент частью Spollers.
     * @type {boolean}
     */
    this.isItemSpollers = isItemSpollers;

    /**
     * Объект анимации для управления анимацией открытия/закрытия.
     * @type {Animation}
     * @private
     */
    this.animation = null;
    /**
     * Флаг, указывающий, что элемент закрывается.
     * @type {boolean}
     * @private
     */
    this.isClosing = false;
    /**
     * Флаг, указывающий, что элемент раскрывается.
     * @type {boolean}
     * @private
     */
    this.isExpanding = false;
    // Detect user clicks on the summary element
    // если в составе сполеров то уже из сполера регулировать открытие
    if (!this.isItemSpollers) {
      this.summary.addEventListener('click', (e) => this.onClick(e));
    }
    // признак проинициализированного элемента
    this.el.dataset.detailInit = '';
  }

  /**
   * Обработчик события "click" для элемента <summary>. Открывает или закрывает элемент.
   * @param {Event} e - Объект события "click".
   */
  onClick(e) {
    // Stop default behaviour from the browser
    e.preventDefault();
    if (this.el.hasAttribute('data-disabled')) return;
    // Check if the element is being closed or is already closed
    if (this.isClosing || !this.el.open) {
      this.open();
      // Check if the element is being openned or is already open
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
    }
  }

  /**
   * Закрывает элемент аккордеона.
   */
  shrink() {
    if (!this.el.open) return;
    // Add an overflow on the <details> to avoid content overflowing
    this.el.style.overflow = 'hidden';
    // Set the element as "being closed"
    this.isClosing = true;

    // Store the current height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the height of the summary
    const endHeight = `${this.summary.offsetHeight}px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.el.animate(
      {
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight],
      },
      {
        duration: this.duration,
        easing: this.timingFunction,
      }
    );

    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(false);
    // If the animation is cancelled, isClosing variable is set to false
    this.animation.oncancel = () => (this.isClosing = false);
  }

  /**
   * Открывает элемент аккордеона.
   */
  open() {
    if (this.el.open) return;
    // Add an overflow on the <details> to avoid content overflowing
    this.el.style.overflow = 'hidden';
    // Apply a fixed height on the element
    this.el.style.height = `${this.el.offsetHeight}px`;
    // Force the [open] attribute on the details element
    this.el.open = true;
    // Wait for the next frame to call the expand function
    window.requestAnimationFrame(() => this.expand());
  }

  /**
   * Раскрывает элемент аккордеона.
   */
  expand() {
    // Set the element as "being expanding"
    this.isExpanding = true;
    // Get the current fixed height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the open height of the element (summary height + content height)
    const endHeight = `${
      this.summary.offsetHeight + this.content.offsetHeight
    }px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.el.animate(
      {
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight],
      },
      {
        duration: this.duration,
        easing: this.timingFunction,
      }
    );
    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(true);
    // If the animation is cancelled, isExpanding variable is set to false
    this.animation.oncancel = () => (this.isExpanding = false);
  }

  /**
   * Обработчик завершения анимации открытия/закрытия элемента.
   * @param {boolean} open - Флаг состояния элемента (true - открыт, false - закрыт).
   * @private
   */
  onAnimationFinish(open) {
    // Set the open attribute based on the parameter
    this.el.open = open;
    // Clear the stored animation
    this.animation = null;
    // Reset isClosing & isExpanding
    this.isClosing = false;
    this.isExpanding = false;
    // Remove the overflow hidden and the fixed height
    this.el.style.height = this.el.style.overflow = '';
    // генерация события
    const event = new CustomEvent('details-change-state', {
      bubbles: true,
      detail: { open },
    });
    this.el.dispatchEvent(event);
  }
}

export default Accordion;
