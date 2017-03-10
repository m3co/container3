'use strict';
(() => {
  // see #1
  function preformat(element) {
    let clone = document.importNode(element, true);
    [...clone.querySelectorAll('x-fragment')].forEach(fragment => {
      delete fragment.dataset.baseURI;
    });
    [...clone.querySelectorAll('script')].forEach(script => {
      let src = script.getAttribute('data-src-');
      script.setAttribute('src', src);
      if (src === '' || src === 'null') {
        script.removeAttribute('src');
      }
      script.removeAttribute('data-src');
      script.removeAttribute('data-src-');
    });
    return clone;
  }

  let cf = document.currentFragment;
  let edit = cf.querySelector('[data-container3-edit]');
  let content = cf.querySelector('[data-container3-content]');
  let form = cf.querySelector('[data-container3-form]');
  let textarea = form.querySelector('textarea');
  let originalHTML = preformat(content).innerHTML.trim();

  edit.addEventListener('click', () => {
    edit.hidden = true;
    form.hidden = false;
    content.hidden = true;
    textarea.value = originalHTML;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    edit.hidden = false;
    form.hidden = true;
    content.hidden = false;
    originalHTML = textarea.value;
    content.innerHTML = originalHTML.trim();

    [...content.querySelectorAll('script')].forEach((script) => {
      let newScript = document.createElement('script');

      [...script.attributes]
        .forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.text = script.text;
      script.parentNode.replaceChild(newScript, script);
    });
  });

})();