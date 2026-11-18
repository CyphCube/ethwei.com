(function () {
  'use strict';

  // Public testnet RPC endpoints. Testnets only, no mainnet data.
  var CHAINS = [
    { name: 'Ethereum Sepolia', rpc: 'https://11155111.rpc.thirdweb.com' },
    { name: 'Base Sepolia', rpc: 'https://sepolia.base.org' },
    { name: 'Arbitrum Sepolia', rpc: 'https://sepolia-rollup.arbitrum.io/rpc' },
    { name: 'OP Sepolia', rpc: 'https://sepolia.optimism.io' },
    { name: 'Polygon Amoy', rpc: 'https://polygon-amoy.drpc.org' },
    { name: 'Arc Testnet', rpc: 'https://rpc.testnet.arc.io' }
  ];
  var TIMEOUT_MS = 8000;

  var root = document.getElementById('gas-widget');
  var list = document.getElementById('gas-list');
  var stamp = document.getElementById('gas-updated');
  var btn = document.getElementById('gas-refresh');
  if (!root || !list) return;

  var labelLoading = root.getAttribute('data-loading') || 'Loading…';
  var labelUnavailable = root.getAttribute('data-unavailable') || 'Unavailable';
  var labelUpdated = root.getAttribute('data-updated') || 'Updated';

  function formatGwei(hex) {
    var wei = BigInt(hex);
    var gwei = Number(wei) / 1e9;
    if (gwei >= 100) return gwei.toFixed(0);
    if (gwei >= 1) return gwei.toFixed(2);
    if (gwei >= 0.001) return gwei.toFixed(4);
    return gwei.toFixed(6);
  }

  function fetchGas(chain) {
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS);
    return fetch(chain.rpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_gasPrice', params: [] }),
      signal: ctrl.signal
    })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (j) {
        if (!j || typeof j.result !== 'string') throw new Error('Bad response');
        return formatGwei(j.result);
      })
      .finally(function () { clearTimeout(timer); });
  }

  function row(name, valueHtml, cls) {
    var li = document.createElement('li');
    li.className = 'gas-row' + (cls ? ' ' + cls : '');
    var a = document.createElement('span');
    a.className = 'gas-chain';
    a.textContent = name;
    var b = document.createElement('span');
    b.className = 'gas-price';
    b.textContent = valueHtml;
    li.appendChild(a);
    li.appendChild(b);
    return li;
  }

  function render() {
    btn.disabled = true;
    list.innerHTML = '';
    CHAINS.forEach(function (c) { list.appendChild(row(c.name, labelLoading, 'is-loading')); });

    var tasks = CHAINS.map(function (c) {
      return fetchGas(c).then(
        function (v) { return { ok: true, v: v }; },
        function () { return { ok: false }; }
      );
    });

    Promise.all(tasks).then(function (results) {
      list.innerHTML = '';
      results.forEach(function (r, i) {
        var c = CHAINS[i];
        if (r.ok) list.appendChild(row(c.name, r.v + ' gwei'));
        else list.appendChild(row(c.name, labelUnavailable, 'is-error'));
      });
      stamp.textContent = labelUpdated + ' ' + new Date().toLocaleTimeString();
      btn.disabled = false;
    });
  }

  btn.addEventListener('click', render);
  render();
})();
