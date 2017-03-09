'use strict';

(() => {
  let edit = document.querySelector('[data-container3-edit]');
  let container = document.querySelector('[data-container3]');
  let form = document.querySelector('[data-container3-form]');
  let textarea = form.querySelector('textarea');
  let originalHTML = container.innerHTML.trim();
  edit.addEventListener('click', () => {
    edit.hidden = true;
    form.hidden = false;
    container.hidden = true;
    textarea.value = originalHTML;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    edit.hidden = false;
    form.hidden = true;
    container.hidden = false;
    container.innerHTML = textarea.value;
    originalHTML = container.innerHTML.trim();
    [...container.querySelectorAll('script')].forEach((script) => {
      console.log(script);
      let oldScript = script;
      let newScript = document.createElement('script');

      [...oldScript.attributes]
        .forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.text = oldScript.text;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  });

})();
