/**
 * @type {HTMLCanvasElement}
 */
const canvasEl = document.querySelector('.walls__canvas');
if (canvasEl) {
  const containerEl = canvasEl.offsetParent;

  const resizeObserver = new ResizeObserver(() => {
    drawLines();
  });
  resizeObserver.observe(containerEl);

  /**
   * Рисует линии на канве, соединяющие компоненты и описание компонента
   */
  function drawLines() {
    const context = canvasEl.getContext('2d');
    canvasEl.width = containerEl.offsetWidth;
    canvasEl.height = containerEl.offsetHeight;

    drawLine('.walls__point_1', '.walls__component_num_1 .component__mark');
    drawLine('.walls__point_2', '.walls__component_num_1 .component__mark');
    drawLine('.walls__point_3', '.walls__component_num_2 .component__mark');

    /**
     * Рисует линию на канве, соединяющую компонент и описание компонента
     * @param {string} selectorFrom
     * @param {string} selectorTo
     */
    function drawLine(selectorFrom, selectorTo) {
      const elFrom = document.querySelector(selectorFrom);
      const elTo = document.querySelector(selectorTo);

      const elPosFrom = {
        top: getOffsetTop(elFrom, containerEl) + elFrom.offsetHeight / 2,
        left: getOffsetLeft(elFrom, containerEl) + elFrom.offsetWidth / 2,
      };
      const elPosTo = {
        top: getOffsetTop(elTo, containerEl) + elTo.offsetHeight / 2,
        left: getOffsetLeft(elTo, containerEl) + elTo.offsetWidth / 2,
      };
      // <сокращение длины линии на радиус круга, чтобы линия не перекрывала круг>
      const dLeft = elPosTo.left - elPosFrom.left;
      const dTop = elPosTo.top - elPosFrom.top;
      const distance = Math.sqrt(dLeft ** 2 + dTop ** 2);
      const dLeftRel = dLeft / distance;
      const dTopRel = dTop / distance;
      const d = elFrom.offsetHeight / 2;
      elPosFrom.top = elPosFrom.top + d * dTopRel;
      elPosFrom.left = elPosFrom.left + d * dLeftRel;
      // </сокращение длины линии на радиус круга, чтобы линия не перекрывала круг>

      context.lineWidth = 1;
      context.strokeStyle = 'white';
      context.beginPath();
      context.moveTo(elPosFrom.left, elPosFrom.top);
      context.lineTo(elPosTo.left, elPosTo.top);
      context.stroke();
    }
  }
}

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
function getOffsetTop(targetEl, containerEl) {
  return getOffsetPosition(targetEl, 'offsetTop', containerEl);
}

/**
 * Получить offsetTop элемента относительно посредственного предка
 * @param {HTMLElement} targetEl
 * @param {HTMLElement} containerEl
 * @returns {undefined | number}
 */
function getOffsetLeft(targetEl, containerEl) {
  return getOffsetPosition(targetEl, 'offsetLeft', containerEl);
}
