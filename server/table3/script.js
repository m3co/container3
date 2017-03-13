'use strict';

var table = d3.select('#example-table');
fetch('http://localhost:3000/data.json').then(function (response) {
  return response.json();
}).then(function (json) {
  var data = json.data;
  var columns = Object.keys(data[0] ? data[0] : {}).map(function (c) {
    return {
      sort: null,
      text: c,
      key: c
    };
  });

  // filtering
  table.select('#filter').on('keyup', function () {
    var value = d3.event.target.value;
    table.select('tbody').selectAll('tr').each(function (d, i, trs) {
      var tr = trs[i];
      if (value === '') {
        tr.hidden = false;
      } else if (tr.textContent.indexOf(value) === -1) {
        tr.hidden = true;
      }
    });
  });

  // head & sorting
  table.select('thead tr').selectAll('th').data(columns).enter().append('th').text(function (d) {
    return d.text;
  }).on('click', function (d, i, ths) {
    if (!d.sort) {
      d.sort = 'asc';
      ths[i].classList.add('th--sort-asc');
    } else if (d.sort == 'asc') {
      d.sort = 'desc';
      ths[i].classList.add('th--sort-desc');
    } else if (d.sort == 'desc') {
      d.sort = null;
      ths[i].classList.remove('th--sort-asc');
      ths[i].classList.remove('th--sort-desc');
    }

    var isNumber = function isNumber(n) {
      return isFinite(n) && +n === n;
    };
    var prepare = function prepare(d) {
      return isNumber(d) ? Number(d) : !d ? '' : d;
    };

    renderBody(data.map(function (d) {
      return d;
    }).sort(function (a, b) {
      return columns.reduce(function (r, d) {
        if (r !== 0) {
          return r;
        }
        if (d.sort == null) {
          return 0;
        }
        var a_ = prepare(a[d.key]); // this may be in other place
        var b_ = prepare(b[d.key]); // this may be in other place
        if (d.sort === 'asc') {
          return d3.ascending(a_, b_);
        } else if (d.sort === 'desc') {
          return d3.descending(a_, b_);
        }
      }, 0);
    }));
  });

  renderBody(data);

  function renderBody(data) {
    var tr = table.select('tbody').selectAll('tr').data(data);

    var td = tr.enter().append('tr').merge(tr).selectAll('td').data(function (d) {
      return columns.map(function (c) {
        return d[c.key];
      });
    });

    td.enter().append('td').merge(td).text(function (d) {
      return d;
    });
  }
});
