(!window.HTMLXContainerElement) && (() => {

  class HTMLXContainerElement extends HTMLElement {
    constructor() {
      super();
    }
  }

  window.customElements.define('x-container', HTMLXContainerElement);
  window.HTMLXContainerElement = HTMLXContainerElement;

})();
