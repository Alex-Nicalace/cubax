import Swiper, {
  Navigation,
  Pagination,
  Keyboard,
  Lazy,
  Thumbs,
  FreeMode,
} from 'swiper';

// Базовые стили
import '../../scss/base/swiper.scss';

function initSliders() {
  if (document.querySelector('.card-building__thumbs-slider')) {
    // Указываем скласс нужного слайдера
    // Создаем слайдер
    const swiper = new Swiper('.card-building__thumbs-slider', {
      // Указываем скласс нужного слайдера
      modules: [Navigation, Lazy, FreeMode, Keyboard],
      spaceBetween: 3,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
      lazy: true,
      // Брейкпоинты

      breakpoints: {
        479.98: {
          spaceBetween: 8,
        },
      },
    });

    if (document.querySelector('.card-building__main-slider')) {
      // Указываем скласс нужного слайдера
      // Создаем слайдер
      new Swiper('.card-building__main-slider', {
        // Указываем скласс нужного слайдера
        modules: [Navigation, Lazy, Thumbs, Keyboard],
        spaceBetween: 10,
        lazy: true,
        // позволяет стрелками управлять слайдером
        keyboard: true,
        thumbs: {
          swiper: swiper,
        },
      });
    }
  }

  if (document.querySelector('.gallery__thumbs-slider')) {
    // Указываем скласс нужного слайдера
    // Создаем слайдер
    const swiper = new Swiper('.gallery__thumbs-slider', {
      // Указываем скласс нужного слайдера
      modules: [Navigation, Lazy, FreeMode, Keyboard],
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
      lazy: true,
      // Брейкпоинты

      breakpoints: {
        479.98: {
          spaceBetween: 35,
        },
      },
    });

    if (document.querySelector('.gallery__main-slider')) {
      // Указываем скласс нужного слайдера
      // Создаем слайдер
      new Swiper('.gallery__main-slider', {
        // Указываем скласс нужного слайдера
        modules: [Navigation, Lazy, Thumbs, Keyboard],
        spaceBetween: 10,
        lazy: true,
        // позволяет стрелками управлять слайдером
        keyboard: true,
        thumbs: {
          swiper: swiper,
        },
      });
    }
  }
}

window.addEventListener('load', function (e) {
  // Запуск инициализации слайдеров
  initSliders();
  // Запуск инициализации скролла на базе слайдера (по классу swiper_scroll)
  //initSlidersScroll();
});
