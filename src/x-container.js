document.currentFragment.loaded.then((fragment) => {
  'use strict';

  const classAsString = 'HTMLXContainerElement';
  const selector      = 'x-container';

  class HTMLXContainerElement extends HTMLElement {

    static get observedAttributes() {
      return ['value', 'is-editable'];
    }

    constructor() {
      super();
      const content = fragment.querySelector('template').content;
      const node = document.importNode(content, true);

      this.classList.add('x-container');

      this.editBtn = node.querySelector('[edit]');
      this.deleteBtn = node.querySelector('[delete]');
      this.content = node.querySelector('[content]');
      this.form = node.querySelector('[form]');
      this.textarea = this.form.querySelector('textarea');

      this.editBtn.addEventListener('click', this.onEdit.bind(this));
      this.deleteBtn.addEventListener('click', this.onDelete.bind(this));
      this.form.addEventListener('submit', this.onSave.bind(this));

      this.style.height = '';
      this.form.hidden = true;
      this.editBtn.hidden = false;
      this.deleteBtn.hidden = false;
      this.content.hidden = false;

      this.appendChild(node);
    }

    connectedCallback() {
      save_.call(this, this.getAttribute('value'));

      let isEditable = this.getAttribute('is-editable');
      this.isEditable_ = (isEditable && isEditable.length !== 0) ?
        JSON.parse(isEditable) :
        false;

      this.isEditable_ && toggle_.call(this);
    }

    attributeChangedCallback(attr, oldValue, newValue) {
    }

    get value() {
      this.value_;
    }

    set value(value) {
      this.value_ = value;
      this.setAttribute('value', this.value_);
    }

    get isEditable() {
      this.isEditable_;
    }

    set isEditable(isEditable) {
      this.isEditable_ = isEditable;
      this.setAttribute('is-editable', this.isEditable_);
    }

    onEdit() {
      toggle_.call(this);
    }

    onSave(e) {
      e.preventDefault();
      toggle_.call(this);
      save_.call(this, this.textarea.value);
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

  function toggle_() {
    this.isEditable_ = !this.isEditable_;

    this.form.hidden = !this.form.hidden;
    this.editBtn.hidden = !this.editBtn.hidden;
    this.deleteBtn.hidden = !this.deleteBtn.hidden;
    this.content.hidden = !this.content.hidden;
    this.style.height = this.style.height === '' ? this.offsetHeight + 'px' : '';
  }

  function save_(newValue) {
    this.value_ = newValue.trim();
    this.textarea.value = this.value_;
    this.content.innerHTML = this.value_;

    [...this.content.querySelectorAll('script')].forEach((script) => {
      let newScript = document.createElement('script');

      [...script.attributes]
        .forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.text = script.text;
      script.parentNode.replaceChild(newScript, script);
    });
  }

  if (!window[classAsString]) {
    window[classAsString] = HTMLXContainerElement;
    window.customElements.define(selector, HTMLXContainerElement);
  }

});
