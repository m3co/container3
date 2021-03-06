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
      assert_true(container.querySelector('[edit=""]') instanceof HTMLElement,
        "edit element is present");
      assert_true(container.querySelector('[content=""]') instanceof HTMLElement,
        "content element is present");
      assert_true(container.querySelector('[form=""]') instanceof HTMLElement,
        "form element is present");

      assert_false(container.querySelector('[content=""]').hidden,
        "content element is visible");
      assert_true(container.querySelector('[form=""]').hidden,
        "form element is not visible");
    }));
  }, "The container holds edit, content, form elements");
}, "Hold a template with a clear set of features");

promise_test(function() {
  var container = document.createElement('x-container');
  return container.templateReady.then(this.step_func((container) => {
    var edit = container.querySelector('[edit=""]');
    var content = container.querySelector('[content=""]');
    var form = container.querySelector('[form=""]');

    edit.dispatchEvent(new MouseEvent('click'));
    assert_true(content.hidden, "Hide content after click on edit");
    assert_false(form.hidden, "Unhide form after click on edit");
  }));
}, "A container can be edited");
