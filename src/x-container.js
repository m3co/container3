(() => {
  'use strict';

  const classAsString = 'HTMLXContainerElement';
  const selector      = 'x-container';

  class HTMLXContainerElement extends HTMLElement {

    constructor() {
      super();
    }

    connectedCallback() {
      const content = document.currentScript.ownerDocument.querySelector('template').content;
      const node = document.importNode(content, true);

      this.classList.add('x-container');
      this.editBtn = node.querySelector('[edit]');
      this.deleteBtn = node.querySelector('[delete]');
      this.content = node.querySelector('[content]');
      this.form = node.querySelector('[form]');
      this.textarea = this.form.querySelector('textarea');
      this.originalHTML = preformat_(this.content).innerHTML.trim();

      this.editBtn.addEventListener('click', this.onEdit.bind(this));
      this.deleteBtn.addEventListener('click', this.onDelete.bind(this));
      this.form.addEventListener('submit', this.onSave.bind(this));

      this.appendChild(node);
    }

    onEdit() {
      this.style.height = this.offsetHeight + 'px';
      this.form.hidden = false;
      this.editBtn.hidden = true;
      this.deleteBtn.hidden = true;
      this.content.hidden = true;
      this.textarea.value = this.originalHTML;
    }

    onSave(e) {
      e.preventDefault();
      this.style.height = '';
      this.form.hidden = true;
      this.editBtn.hidden = false;
      this.deleteBtn.hidden = false;
      this.content.hidden = false;
      this.originalHTML = this.textarea.value;
      this.content.innerHTML = this.originalHTML.trim();

      [...this.content.querySelectorAll('script')].forEach((script) => {
        let newScript = document.createElement('script');

        [...script.attributes]
          .forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.text = script.text;
        script.parentNode.replaceChild(newScript, script);
      });
    }

    onDelete() {
      confirm('Delete?') && this.remove();
    }
  }

  function preformat_(element) {
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

  if (!window[classAsString]) {
    window[classAsString] = HTMLXContainerElement;
    window.customElements.define(selector, HTMLXContainerElement);
  }

})();
