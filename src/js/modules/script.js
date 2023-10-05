import ScrollWindow from './reused/scrollWindow.js';
import { mask } from './reused/mask-input-tel-new.js';
import ScrollToAnchor from './reused/scrollToAnchor.js';
import Modal from './reused/modal.js';
import Spollers from './reused/spollers.js';
import { bindInputLabel } from './reused/bindInputLabel.js';

bindInputLabel();

const scrollWindow = new ScrollWindow();
scrollWindow.toggleClassesHeader();

mask('.input-block__input[type="tel"]', '+38 (___) ___-__-__');

ScrollToAnchor.scrollToAnchorOnURLChange();
new ScrollToAnchor();

import './toggleThemeHeader.js';

Modal.openModalOnHashChange();
new Modal('[data-modal]');

import './walls.js';

const spollers = new Spollers(document.querySelector('[data-spollers]'));
spollers.items.length > 0 && spollers.items[0].open();
