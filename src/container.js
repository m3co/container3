(() => {

  class HTMLXContainerElement extends HTMLElement {
    constructor() {
      super();
    }
  }

  window.customElements.define('x-container', HTMLXContainerElement);
  if (!window.HTMLXContainerElement) {
    window.HTMLXContainerElement = HTMLXContainerElement;
  }

})();
