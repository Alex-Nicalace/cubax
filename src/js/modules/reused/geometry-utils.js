/**
 * Декартовы координаты
 * @typedef {Object} Coord
 * @property {number} x - Координата по оси X.
 * @property {number} y - Координата по оси Y.
 */

/**
 * Вектор
 * @typedef {Object} Vector
 * @property {number} dx - Разность координат между точками по оси X.
 * @property {number} dy - Разность координат между точками по оси Y.
 */

/**
 * Вычисляет параметры средней перпендикулярной прямой для заданного отрезка.
 *
 * @param {Coord} a - Координата начальной точки отрезка.
 * @param {Coord} b - Координата конечной точки отрезка.
 * @returns {Object} Объект, содержащий параметры средней перпендикулярной прямой.
 * @property {number} m - Угловой коэффициент средней перпендикулярной прямой.
 * @property {number} b - Смещение средней перпендикулярной прямой по оси Y.
 */
export function getMidPerpendicularParams(a, b) {
  // середина отрезка
  const centerPoint = getCenterPoint(a, b);

  // угловой коэфициент
  const M = getSlope(a, b);

  // угловой коэфициент перпендикуляра
  const m = getPerpendicularSlope(M);

  // y = mx + b - уравнение прямой
  // где х и у - координаты середины, m – угловой коэффициент, b – смещение прямой по оси Y
  b = getYOffset(centerPoint, m);

  return { m, b };
}

/**
 * Функция возвращает координаты середины отрезка. Формула:
 * xm = (x1 + x2) / 2; ym = (y1 + y2) / 2
 * @param {Coord} a Координаты точки a
 * @param {Coord} b Координаты точки b
 * @returns {Coord} Координаты середины отрезка
 */
export function getCenterPoint(a, b) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

/**
 * Функция возвращает угловой коэффициент. Формула:
 * (m) = (y2 - y1) / (x2 - x1)
 * @param {Coord} a Координаты точки a
 * @param {Coord} b Координаты точки b
 * @returns {number} Угловой коэффициент
 */
export function getSlope(a, b) {
  return (b.y - a.y) / (b.x - a.x);
}

/**
 * Функция получает угловой коэффициент и возвращает коэффициент перпендикуляра
 * @param {number} m Угловой коэффициент
 */
export function getPerpendicularSlope(m) {
  return -1 / m;
}

/**
 * Функция получает координаты точки и угловой коэффициент и возвращает смещение прямой по оси Y
 * y = mx + b - уравнение прямой
 * где х и у - координаты, m – угловой коэффициент, b – смещение прямой по оси Y
 * @param {Coord} a Координаты точки
 * @param {number} m Угловой коэфициент
 * @returns {number} Смещение прямой по оси Y
 */
export function getYOffset(a, m) {
  return a.y - m * a.x;
}

/**
 * Получить вектор AB
 * @param {Coord} a Координаты точки
 * @param {Coord} b Координаты точки
 * @returns {Vector} Вектор AB
 */
export function getVectorComponents(a, b) {
  return {
    dx: b.x - a.x,
    dy: b.y - a.y,
  };
}

/**
 * Растояние м/у 2-мя точками
 * @param {Coord} a Координаты точки
 * @param {Coord} b Координаты точки
 * @returns {number} расстояние между точками A и B
 */
export function lengthFromCoordinates(a, b) {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

/**
 * Ф-ция получает компоненты вектора и возвращает компоненты нормализованного вектора
 * @param {Vector} vector Компоненты вектора
 * @returns {Vector} Нормализованный вектор
 */
export function getNormalizedVector(vector) {
  const length = Math.sqrt(vector.dx ** 2 + vector.dy ** 2);
  return {
    dx: vector.dx / length,
    dy: vector.dy / length,
  };
}

/**
 * Получает компоненты вектора, возвращает вектор перпендикуляра
 * @param {Vector} vector Компоненты вектора
 * @returns {Vector} Компоненты перпендикулярного вектора
 */
export function getPerpendicularVector(vector) {
  return {
    dx: -vector.dy,
    dy: vector.dx,
  };
}

/**
 * Получает координаты точки, которая находится на срединном перпендикуляре на заданном расстоянии
 * @param {Coord} a Координаты точки
 * @param {Coord} b Координаты точки
 * @param {number} d Расстояние
 * @returns {Coord} Координаты точки, находящейся на срединном перпендикуляре
 */
export function getPointOnMidPerpendicular(a, b, d) {
  const midPoint = getCenterPoint(a, b);
  const vectorAB = getVectorComponents(a, b);
  const normalizedAB = getNormalizedVector(vectorAB);
  const perpendicularVector = getPerpendicularVector(normalizedAB);
  return {
    x: midPoint.x + perpendicularVector.dx * d,
    y: midPoint.y + perpendicularVector.dy * d,
  };
}

/**
 * Возвращает координаты точки которая находится на заданном расстоянии D от точки C в отрезок ВС паралелен AB
 * @param {Coord} a Координаты точки
 * @param {Coord} b Координаты точки
 * @param {Coord} c Координаты точки
 * @param {number} distance Расстояние
 * @returns {Coord} Координаты точки, находящейся на растоянии от точки С
 */
export function getPointAtDistanceInDirection(a, b, c, distance) {
  const vectorAB = getVectorComponents(a, b);
  const normalizedAB = getNormalizedVector(vectorAB);
  return {
    x: c.x + normalizedAB.dx * distance,
    y: c.y + normalizedAB.dy * distance,
  };
}

/**
 * Функция для вычисления координат точки на окружности.
 *
 * @param {Coord} a - Объект с координатами центра окружности: {x: number, y: number}.
 * @param {number} r - Радиус окружности.
 * @param {number} angleDegrees - Угол в градусах, для которого нужно найти точку на окружности.
 * @returns {Coord} - Объект с координатами точки на окружности: {x: number, y: number}.
 */
export function calculatePointOnCircle(a, r, angleDegrees) {
  // Преобразование угла из градусов в радианы
  const angleRadians = (angleDegrees * Math.PI) / 180;

  // Вычисление координат точки на окружности
  const x = a.x + r * Math.cos(angleRadians);
  const y = a.y + r * Math.sin(angleRadians);

  // Возвращаем объект с координатами точки
  return { x, y };
}
