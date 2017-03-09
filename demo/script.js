'use strict';

(() => {
  let edit = document.querySelector('[data-container3-edit]');
  let container = document.querySelector('[data-container3]');
  let form = document.querySelector('[data-container3-form]');
  let textarea = form.querySelector('textarea');
  edit.addEventListener('click', () => {
    edit.hidden = true;
    form.hidden = false;
    container.hidden = true;
    textarea.value = container.innerHTML.trim();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    edit.hidden = false;
    form.hidden = true;
    container.hidden = false;
    container.innerHTML = textarea.value;
  });

})();
