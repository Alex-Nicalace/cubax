/**
 * Получить позицию элемента относительно посредственного предка
 * @param {HTMLElement} targetEl Целевой элемент
 * @param {string} prop Свойство offsetTop || offsetLeft
 * @param {HTMLElement} containerEl Элемент относительно которого необходимо высчитать top и left
 * @returns {undefined | number}
 */
function getOffsetPosition(targetEl, prop, containerEl) {
  if (!targetEl) return;
  if (!targetEl.offsetParent || targetEl.offsetParent === containerEl)
    return targetEl[prop];
  return (
    targetEl[prop] + getOffsetPosition(targetEl.offsetParent, prop, containerEl)
  );
}

/**
 * Получить offsetTop элемента относительно посредственного предка
 * @param {HTMLElement} targetEl
 * @param {HTMLElement} containerEl
 * @returns {undefined | number}
 */
export function getOffsetTop(targetEl, containerEl) {
  return getOffsetPosition(targetEl, 'offsetTop', containerEl);
}

/**
 * Получить offsetTop элемента относительно посредственного предка
 * @param {HTMLElement} targetEl
 * @param {HTMLElement} containerEl
 * @returns {undefined | number}
 */
export function getOffsetLeft(targetEl, containerEl) {
  return getOffsetPosition(targetEl, 'offsetLeft', containerEl);
}
