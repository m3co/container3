'use strict';
test(() => {
  assert_true(HTMLXContainerElement.prototype instanceof HTMLElement);
}, "Container is defined as HTMLXContainerElement");

test(() => {
  var container = document.createElement('x-container');
  assert_true(container.templateReady instanceof Promise,
    "templateReady is defined");

  promise_test(function() {
    var container = document.createElement('x-container');
    return container.templateReady.then(this.step_func((container) => {
      assert_true(container.querySelector('[edit=""]') instanceof HTMLElement);
      assert_true(container.querySelector('[content=""]') instanceof HTMLElement);
      assert_true(container.querySelector('[form=""]') instanceof HTMLElement);
    }));
  }, "The container holds edit, content, form elements");
}, "Hold a template with a clear set of features");
