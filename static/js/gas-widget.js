(function () {
  'use strict';

  // Reads gas data from the gas.ethwei.com endpoint. Display only: no transactions.
  var TIMEOUT_MS = 10000;

  var root = document.getElementById('gas-widget');
  var list = document.getElementById('gas-list');
  var stamp = document.getElementById('gas-updated');
  var btn = document.getElementById('gas-refresh');
  var sourceEl = document.getElementById('gas-source');
  if (!root || !list) return;

  var api = root.getAttribute('data-api');
  var labelLoading = root.getAttribute('data-loading') || 'Loading…';
  var labelUnavailable = root.getAttribute('data-unavailable') || 'Unavailable';
  var labelUpdated = root.getAttribute('data-updated') || 'Updated';
  var labelStale = root.getAttribute('data-stale') || 'Stale';
  var labelSource = root.getAttribute('data-source') || 'Source';
  var baseSourceText = sourceEl ? sourceEl.textContent : '';

  function isNum(v) { return typeof v === 'number' && isFinite(v); }

  function formatGwei(g) {
    if (g >= 100) return g.toFixed(0);
    if (g >= 1) return g.toFixed(2);
    if (g >= 0.001) return g.toFixed(4);
    return g.toFixed(6);
  }

  function formatUsd(v) {
    if (v >= 0.01) return '$' + v.toFixed(2);
    if (v <= 0) return '$0';
    var decimals = Math.min(8, Math.ceil(-Math.log10(v)) + 1);
    return '$' + v.toFixed(decimals);
  }

  function cell(text, cls) {
    var s = document.createElement('span');
    s.className = cls;
    s.textContent = text;
    return s;
  }

  function row(name, gasText, costText, cls) {
    var li = document.createElement('li');
    li.className = 'gas-row' + (cls ? ' ' + cls : '');
    li.appendChild(cell(name, 'gas-chain'));
    li.appendChild(cell(gasText, 'gas-price'));
    li.appendChild(cell(costText, 'gas-price'));
    return li;
  }

  function showLoading() {
    list.innerHTML = '';
    list.appendChild(row(labelLoading, '', '', 'is-loading'));
  }

  function showUnavailable() {
    list.innerHTML = '';
    list.appendChild(row(labelUnavailable, '', '', 'is-error'));
  }

  function render(data) {
    list.innerHTML = '';
    var chains = data && Array.isArray(data.chains) ? data.chains : [];
    if (!chains.length) { showUnavailable(); return; }
    chains.forEach(function (c) {
      var name = String(c.name || '');
      var hasGas = isNum(c.gasPriceGwei);
      var hasCost = isNum(c.transferCostUsd);
      if (!hasGas && !hasCost) {
        list.appendChild(row(name, labelUnavailable, labelUnavailable, 'is-error'));
        return;
      }
      var mark = c.stale ? ' (' + labelStale + ')' : '';
      list.appendChild(row(
        name,
        hasGas ? formatGwei(c.gasPriceGwei) + ' gwei' + mark : labelUnavailable,
        hasCost ? formatUsd(c.transferCostUsd) + mark : labelUnavailable,
        c.stale ? 'is-stale' : ''
      ));
    });
    if (sourceEl) {
      sourceEl.textContent = baseSourceText;
      if (typeof data.source === 'string' && data.source) {
        sourceEl.textContent = baseSourceText + ' ' + labelSource + ': ' + data.source;
      }
    }
    var when = data.updatedAt ? new Date(data.updatedAt) : new Date();
    stamp.textContent = labelUpdated + ' ' + (isNaN(when.getTime()) ? new Date() : when).toLocaleTimeString();
  }

  function load() {
    btn.disabled = true;
    showLoading();
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS);
    fetch(api, { signal: ctrl.signal })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(render)
      .catch(showUnavailable)
      .finally(function () {
        clearTimeout(timer);
        btn.disabled = false;
      });
  }

  btn.addEventListener('click', load);
  load();
})();
