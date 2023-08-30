import {
  getPointAtDistanceInDirection,
  getPointOnMidPerpendicular,
  calculatePointOnCircle,
} from './reused/geometry-utils.js';
import { getOffsetTop, getOffsetLeft } from './reused/metrics-utils.js';

class DrawOnCanvas {
  /**
   *
   * @param {string} selector
   * @param {function(CanvasRenderingContext2D, string, string): void} callback
   * @param {string[][]} segments
   */
  constructor(selector, cbDraw, segments) {
    /**
     * @type {HTMLCanvasElement | null}
     */
    this.canvasEl = document.querySelector(selector);

    if (!this.canvasEl) return this;

    /**
     * @type {HTMLElement}
     */
    this.containerEl = this.canvasEl.offsetParent;

    /**
     * @type {CanvasRenderingContext2D}
     */
    this.context = this.canvasEl.getContext('2d');

    this.cbDraw = cbDraw;

    /**
     * @type {string[][]}
     */
    this.segments = segments;

    /**
     * ID интервалов анимации
     * @type {string[]}
     */
    this.intervals = [];

    const resizeObserver = new ResizeObserver(() => {
      this.drawLines();
    });
    resizeObserver.observe(this.containerEl);
  }
  drawLines() {
    this.clearIntervals();

    this.canvasEl.width = this.containerEl.offsetWidth;
    this.canvasEl.height = this.containerEl.offsetHeight;

    this.segments.forEach((arr) => {
      this.cbDraw(arr[0], arr[1]);
    });
  }
  clearIntervals() {
    this.intervals.forEach((id) => clearInterval(id));
  }
}

new DrawOnCanvas('.walls__canvas', drawLineOnWalls, [
  ['.walls__point_1', '.walls__component_num_1 .component__mark'],
  ['.walls__point_2', '.walls__component_num_1 .component__mark'],
  ['.walls__point_3', '.walls__component_num_2 .component__mark'],
]);
/**
 * Рисует линию на канве, соединяющую компонент и описание компонента
 * @param {string} selectorFrom
 * @param {string} selectorTo
 */
function drawLineOnWalls(selectorFrom, selectorTo) {
  const elFrom = document.querySelector(selectorFrom);
  const elTo = document.querySelector(selectorTo);

  let pointA = {
    y: getOffsetTop(elFrom, this.containerEl) + elFrom.offsetHeight / 2,
    x: getOffsetLeft(elFrom, this.containerEl) + elFrom.offsetWidth / 2,
  };
  let pointB = {
    y: getOffsetTop(elTo, this.containerEl) + elTo.offsetHeight / 2,
    x: getOffsetLeft(elTo, this.containerEl) + elTo.offsetWidth / 2,
  };
  // <сокращение длины линии на радиус круга, чтобы линия не перекрывала круг>
  const d = elFrom.offsetHeight / 2;
  pointA = { ...getPointAtDistanceInDirection(pointA, pointB, pointA, d) };
  // </сокращение длины линии на радиус круга, чтобы линия не перекрывала круг>

  this.context.lineWidth = 1;
  this.context.strokeStyle = 'white';
  this.context.beginPath();
  this.context.moveTo(pointA.x, pointA.y);
  this.context.lineTo(pointB.x, pointB.y);
  this.context.stroke();
}

new DrawOnCanvas('.stages__canvas', drawDashedLineOnStage, [
  [
    '.stage:nth-child(1) .stage__wrap-icon',
    '.stage:nth-child(2) .stage__wrap-icon',
  ],
  [
    '.stage:nth-child(2) .stage__wrap-icon',
    '.stage:nth-child(3) .stage__wrap-icon',
  ],
  [
    '.stage:nth-child(3) .stage__wrap-icon',
    '.stage:nth-child(4) .stage__wrap-icon',
  ],
]);
/**
 * Рисует линию на канве, соединяющую компонент и описание компонента
 * @param {string} selectorFrom
 * @param {string} selectorTo
 */
function drawDashedLineOnStage(selectorFrom, selectorTo) {
  const elFrom = document.querySelector(selectorFrom);
  const elTo = document.querySelector(selectorTo);

  // координаты центров 2 элементов
  let pointA = {
    y: getOffsetTop(elFrom, this.containerEl) + elFrom.offsetHeight / 2,
    x: getOffsetLeft(elFrom, this.containerEl) + elFrom.offsetWidth / 2,
  };
  let pointB = {
    y: getOffsetTop(elTo, this.containerEl) + elTo.offsetHeight / 2,
    x: getOffsetLeft(elTo, this.containerEl) + elTo.offsetWidth / 2,
  };
  // <сокращение длины линии на радиус круга, чтобы линия не перекрывала круг>
  if (window.innerWidth < 768) {
    let r = elFrom.offsetHeight / 2 + (elFrom.offsetHeight * 10) / 167;
    pointA = calculatePointOnCircle(pointA, r, -200);

    r = elTo.offsetHeight / 2 + (elTo.offsetHeight * 10) / 167;
    pointB = calculatePointOnCircle(pointB, r, -160);
  } else {
    let r = elFrom.offsetHeight / 2 + (elFrom.offsetHeight * 10) / 167;
    pointA = getPointAtDistanceInDirection(pointA, pointB, pointA, r);
    // pointA = calculatePointOnCircle(pointA, r, 0);

    r = elTo.offsetHeight / 2 + (elTo.offsetHeight * 10) / 167;
    pointB = getPointAtDistanceInDirection(pointA, pointB, pointB, -r);
    // pointB = calculatePointOnCircle(pointB, r, -180);
  }
  // </сокращение длины линии на радиус круга, чтобы линия не перекрывала круг>

  const h = window.innerWidth < 768 ? 50 : -31;
  const pointC = getPointOnMidPerpendicular(pointA, pointB, h);

  let offset = 0;

  const draw = () => {
    this.context.clearRect(
      pointA.x - 50,
      pointA.y - (window.innerWidth < 768 ? 50 : 100),
      pointB.x + 50,
      pointB.y + 50
    );
    this.context.strokeStyle = '#63AFCD';
    this.context.lineWidth = 3;
    this.context.setLineDash([3, 7]);
    this.context.lineDashOffset = -offset;
    this.context.beginPath();
    this.context.moveTo(pointA.x, pointA.y);
    this.context.quadraticCurveTo(pointC.x, pointC.y, pointB.x, pointB.y);
    this.context.stroke();
  };

  const timerId = setInterval(() => {
    offset++;
    if (offset > 20) {
      offset = 0;
    }
    draw();
  }, 30);
  this.intervals.push(timerId);
  draw();
}
