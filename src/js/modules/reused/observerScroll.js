export function createIntersectionObserver(targetSelector, cb, options = {}) {
  const observer = new IntersectionObserver(cb, {
    root: null, // null - пересечение с областью видимости, либо указывается родительский элемент
    rootMargin: '0px',
    threshold: 1, // степень пересечения объекта при которой срваботает колбэк. 1 - 100%

    /* обязательные параметры для того чтобы работало свойство entry.isVisible - Свойство isVisible является 
      частью предлагаемых обновлений Intersection Observer v2, касающихся фактической видимости целевого 
      элемента для пользователя.*/
    trackVisibility: true,
    delay: 100, // minimum 100
    ...options,
  });

  const targets = document.querySelectorAll(targetSelector);
  for (const target of targets) {
    observer.observe(target);
  }
}

/**
 * Функция обработски события пересечения
 * @param {IntersectionObserverEntry[]} entries
 */
// const cb = (entries) => {
//   console.log(entries);
//   entries.forEach((entry) => {
//   });
// };

/**
 * Класс для создания Intersection Observer с дополнительными функциональностями.
 */
export class CreateIntersectionObserver {
  /**
   * Колбэк-функция, вызываемая при пересечении наблюдаемого элемента.
   *
   * @callback IntersectionObserverCallback
   * @param {Array<IntersectionObserverEntry>} entries - Массив объектов Intersection Observer Entry, представляющих состояние пересечения наблюдаемых элементов.
   * @param {IntersectionObserver} observer - Объект Intersection Observer, используемый для наблюдения за элементами.
   * @returns {void}
   */

  /**
   * Создает новый экземпляр Intersection Observer.
   * @param {string|Element} selectorOrElement - Селектор CSS или элемент, для которого будет создан Intersection Observer.
   * @param {IntersectionObserverCallback} cb - Колбэк-функция, вызываемая при пересечении наблюдаемого элемента.
   * @param {IntersectionObserverInit} [options={}] - Настройки Intersection Observer.
   */
  constructor(selectorOrElement, cb, options = {}) {
    /**
     * @type {IntersectionObserver}
     * Объект Intersection Observer для наблюдения за элементами.
     */
    this.observer = new IntersectionObserver(cb, {
      root: null, // null - пересечение с областью видимости, либо указывается родительский элемент
      rootMargin: '0px', // положительное значение расширяет рамки изначального размера root, отрицательные уменьшает во внутрь
      threshold: 0, // степень пересечения объекта при которой сработает колбэк. 1 - 100%
      /**
       * Обязательные параметры для использования свойства `entry.isVisible`.
       * @type {boolean}
       */
      trackVisibility: true,
      /**
       * Задержка перед вызовом колбэка после пересечения.
       * @type {number}
       */
      delay: 100, // minimum 100
      ...options,
      root:
        typeof options.root === 'string'
          ? document.querySelector(options.root)
          : options.root,
    });

    /**
     * @type {Array<Element>}
     * Массив целевых элементов для наблюдения.
     */
    this.targets = [];

    if (typeof selectorOrElement === 'string') {
      // Если передан селектор, находим все соответствующие элементы и добавляем их в массив targets.
      this.targets = [...document.querySelectorAll(selectorOrElement)];
    } else if (selectorOrElement.tagName) {
      // Если передан элемент, добавляем его в массив targets.
      this.targets.push(selectorOrElement);
    }
  }

  /**
   * Запускает наблюдение за целевыми элементами.
   */
  observe() {
    this.targets.forEach((target) => {
      this.observer.observe(target);
    });
  }

  /**
   * Прекращает наблюдение за целевыми элементами.
   */
  unobserve() {
    this.targets.forEach((target) => {
      this.observer.unobserve(target);
    });
  }
}

// Example callback
/*
function cb(entries, observer) {
   for (const entry of entries) {
      const target = entry.target;
      if (entry.isIntersecting) {
         console.log('show');
         // observer.unobserve(target);
      } else {
         console.log('hide');
      }
   }
};
*/

// EXAMPLE
// createIntersectionObserver('.gallery-product__video', cb, {
//    root: document.querySelector('.gallery-product__main-slider'),
// });
// createIntersectionObserver('.range-slider', cb);
// createIntersectionObserver('.advantage', cb, { rootMargin: '0px 0px', threshold: 0.5 });
// createIntersectionObserver('.subscribe', cb, { rootMargin: '0px 0px', threshold: 0.5 });
