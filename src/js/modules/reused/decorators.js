/**
 * Возвращает функцию-обертку, которая передаёт вызов f не более одного раза в ms миллисекунд. 
 * Другими словами, когда мы вызываем debounce, это гарантирует, что все остальные 
 * вызовы будут игнорироваться в течение ms.
 *
 * @param {Function} f - Функция, вызов которой нужно отложить.
 * @param {number} ms - Задержка в миллисекундах.
 * @returns {Function} - Функция-обертка с отложенным вызовом переданной функции `f`.
 */
export function debounce(f, ms) {
   let isCooldown = false;

   return function () {
      if (isCooldown) return;

      f.apply(this, arguments);

      isCooldown = true;

      setTimeout(() => isCooldown = false, ms);
   };
}

/**
 * Возвращает функцию-обертку, которая обеспечивает вызов переданной функции `func` не чаще, чем каждые `ms` миллисекунд.
 * Если функция `func` вызывается повторно во время задержки, то она будет выполнена только после истечения этой задержки.
 * Если функция `func` была вызвана несколько раз во время задержки, она будет вызвана только один раз с последним набором аргументов.
 *
 * @param {Function} func - Функция, которую нужно вызывать с задержкой.
 * @param {number} ms - Задержка в миллисекундах между вызовами функции.
 * @returns {Function} - Функция-обертка с задержкой между вызовами переданной функции `func`.
 */
export function throttle(func, ms) {
   let isThrottled = false,
      savedArgs,
      savedThis;

   function wrapper() {
      if (isThrottled) {
         savedArgs = arguments;
         savedThis = this;
         return;
      }

      func.apply(this, arguments);

      isThrottled = true;

      setTimeout(function () {
         isThrottled = false;
         if (savedArgs) {
            wrapper.apply(savedThis, savedArgs);
            savedArgs = savedThis = null;
         }
      }, ms);
   }

   return wrapper;
}
