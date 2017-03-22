(!window.HTMLXContainerElement) && (() => {

  // all this is just for importing the code without using fragments.
  // The imported code lays on an absolute path
  // the path "/container.html" is a temporary solution. It must be relative
  var template = fetch('/container.html')
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.text();
      }
      throw new Error(response.statusText);
    })
    .then(text => {
      var template = document.createDocumentFragment();
      var content = document.createElement('div');
      content.innerHTML = text;
      [...content.querySelectorAll('script')].forEach((script) => {
        let newScript = document.createElement('script');

        [...script.attributes]
          .forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.text = script.text;
        script.parentNode.replaceChild(newScript, script);
      });
      while(content.firstChild) {
        template.appendChild(content.firstChild);
      }
      return template;
    });

  function initTemplate(template) {
    var edit = template.querySelector('[edit=""]');
    var content = template.querySelector('[content=""]');
    var form = template.querySelector('[form=""]');

    edit.addEventListener('click', () => {
      content.hidden = true;
      form.hidden = false;
    });
  }

  class HTMLXContainerElement extends HTMLElement {
    constructor() {
      super();
      this.templateReady = new Promise((resolve, reject) => {
        template.catch(reason => {
          reject(reason);
        }).then((template) => {
          var clone = document.importNode(template, true);
          initTemplate(clone);
          this.appendChild(clone);
          resolve(this);
        });
      });
    }
  }

  window.customElements.define('x-container', HTMLXContainerElement);
  window.HTMLXContainerElement = HTMLXContainerElement;

})();
