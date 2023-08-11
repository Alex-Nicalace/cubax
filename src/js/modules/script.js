import ScrollWindow from './reused/scrollWindow.js';
import { mask } from './reused/mask-input-tel-new.js';
import scrollToAnchor from './reused/scrollToAnchor.js';

const scrollWindow = new ScrollWindow();
scrollWindow.toggleClassesHeader();

mask('.input-block__input[type="tel"]', '+38 (___) ___-__-__');

scrollToAnchor();
