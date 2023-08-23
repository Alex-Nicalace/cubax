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

  /**
   * @type {HTMLElement}
   */
  const projectSlider = document.querySelector('.projects__slider');
  if (projectSlider) {
    // Указываем скласс нужного слайдера
    // Создаем слайдер
    new Swiper(projectSlider, {
      // Указываем скласс нужного слайдера
      modules: [Navigation, Lazy, Keyboard],
      slidesPerView: 1,
      spaceBetween: 20,
      lazy: true,
      // позволяет стрелками управлять слайдером
      keyboard: true,
      breakpoints: {
        479.98: {
          slidesPerView: 'auto',
        },
      },
      navigation: {
        nextEl: '.projects__button-slide_next',
        prevEl: '.projects__button-slide_prev',
      },
    });
    window.addEventListener('resize', setWidthSlider);
    setWidthSlider();
    function setWidthSlider() {
      const clientWidth = document.documentElement.clientWidth;
      const buttonNext = document.querySelector('.projects__button-slide_next');
      if (clientWidth <= 479.98) {
        projectSlider.style.width = '';
        buttonNext.style.right = '';
        return;
      }
      const offset = projectSlider.getBoundingClientRect().left;
      projectSlider.style.width = clientWidth - offset + 'px';

      const sizeShadow =
        getComputedStyle(buttonNext)?.boxShadow.match(/\d+(\.\d+)?(?=px$)/);
      buttonNext.style.right = offset + (sizeShadow && +sizeShadow[0]) + 'px';
    }
  }
}

window.addEventListener('load', function (e) {
  // Запуск инициализации слайдеров
  initSliders();
  // Запуск инициализации скролла на базе слайдера (по классу swiper_scroll)
  //initSlidersScroll();
});
