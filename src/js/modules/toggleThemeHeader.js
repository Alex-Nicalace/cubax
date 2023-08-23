import { CreateIntersectionObserver } from './reused/observerScroll.js';
/**
 *
 * @param {IntersectionObserverEntry[]} entries
 */
const onIntersection = (entries) => {
  const headerEl = document.querySelector('header.header');
  entries.forEach((entry) => {
    const isDark =
      entry.boundingClientRect.top < 0 && entry.boundingClientRect.bottom > 0;
    if (isDark) {
      headerEl.classList.add('header_sombre');
    } else {
      headerEl.classList.remove('header_sombre');
    }
  });
};
const scroll = new CreateIntersectionObserver(
  '[class*="_dark"]',
  onIntersection,
  {
    threshold: [0],
    rootMargin: '0px 0px -100% 0px',
  }
);
scroll.observe();
