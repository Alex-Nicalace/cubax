import { postData } from '../services/requests.js';
import Modal from './reused/modal.js';

/**
 * Класс, представляющий form.
 * @class
 */
export default class Form {
  /**
   * Создает новый экземпляр класса Form.
   * @constructor
   * @param {HTMLFormElement | undefined} el - Элемент <details> или селектор.
   */
  constructor(el) {
    if (!el) {
      /**
       * Массив объектов Accordion, представляющих Spollers.
       * @type {Form[]}
       */
      const formArr = [];
      for (const formEl of document.forms) {
        formArr.push(new Form(formEl));
      }
      return formArr;
    }
    if (!(el instanceof HTMLFormElement)) {
      throw new Error('Expected an object of type HTMLFormElement');
    }
    /**
     * @type {HTMLFormElement}
     */
    this.formEl = el;
    /**
     * Попап окно при удачной отправке данных
     * @type {HTMLElement}
     */
    this.modalThanks = document.getElementById('modal-thanks');
    this.onSubmit = this.onSubmit.bind(this);
    /**
     * Попап окно, которое содержит текущую форму
     * @type {HTMLDialogElement | undefined}
     */
    this.modalForm = this.formEl.closest('dialog.modal');
    /**
     * Элементы формы, до того как в форму будет вствлен элемент - статус отправки
     * @type {HTMLElement[]}
     */
    this.formElements = [...this.formEl.children];

    this.formEl.addEventListener('submit', this.onSubmit);
  }

  /**
   * Скрыть элементы формы
   */
  hideFormElements() {
    for (const el of this.formElements) {
      el.style.visibility = 'hidden';
    }
  }

  /**
   * Показать элементы формы
   */
  showFormElements() {
    for (const el of this.formElements) {
      el.style.visibility = 'visible';
    }
  }

  /**
   * Событие отправки данных
   * @param {SubmitEvent} e
   */
  onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this.formEl);

    const wrapperEl = document.createElement('div');
    wrapperEl.classList.add('status');
    wrapperEl.innerHTML = `
      <div class='status__body'>
        <div class='status__icon'></div>
        <div class='status__message'></div>
      </div>
    `;
    const msgEl = wrapperEl.querySelector('.status__message');

    this.formEl.append(wrapperEl);
    this.formEl.style.position = 'relative';

    wrapperEl.classList.add('status_loader');

    postData('mailer/sendmail.php', formData)
      .then((res) => {
        return res.json();
      })
      .then(({ success, message }) => {
        if (!success) {
          throw new Error(message);
        }
        this.hideFormElements();
        wrapperEl.className = 'status status_success';
        msgEl.textContent = 'Данные успешно отправлены.';
        Modal.showModal(this.modalThanks);
        this.formEl.reset();
        if (this.modalForm) {
          this.modalForm.close();
        }
      })
      .catch((err) => {
        this.hideFormElements();
        wrapperEl.className = 'status status_error';
        msgEl.textContent = `
          Ошибка! Данные НЕ отправлены...
          ${err}
        `;
      })
      .finally(() => {
        setTimeout(() => {
          this.showFormElements();
          this.formEl.style.position = '';
          wrapperEl.remove();
        }, 3000);
      });
  }
}
