document.currentFragment.loaded.then((cf) => {
  let grid = document.querySelector('[mdl-grid]');
  let form = cf.querySelector('[data-add-cell]');
  let input = form.querySelector('input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let cell = document.createElement('div');
    cell.className = `mdl-cell mdl-cell--${input.value}-col`;
    let fragment = document.createElement('x-fragment');
    fragment.setAttribute('src', 'fragments/container3/index.html');
    cell.appendChild(fragment);
    grid.appendChild(cell);
  });
});
