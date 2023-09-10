import ScrollWindow from './reused/scrollWindow.js';
import { mask } from './reused/mask-input-tel-new.js';
import scrollToAnchor from './reused/scrollToAnchor.js';
import Modal from './reused/modal.js';
import Spollers from './reused/spollers.js';

const scrollWindow = new ScrollWindow();
scrollWindow.toggleClassesHeader();

mask('.input-block__input[type="tel"]', '+38 (___) ___-__-__');

scrollToAnchor();

import './toggleThemeHeader.js';

Modal.openModalOnHashChange();

import './walls.js';

const spollers = new Spollers(document.querySelector('[data-spollers]'));
spollers.items.length > 0 && spollers.items[0].open();
