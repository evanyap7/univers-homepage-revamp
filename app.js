document.addEventListener('DOMContentLoaded', () => {
  initLiveTelemetry();
});

function initLiveTelemetry() {
  const gwEl = document.getElementById('telemetry-gw');
  const endpointsEl = document.getElementById('telemetry-endpoints');
  let baseGW = 1072.4;
  let baseEndpoints = 452890140;

  setInterval(() => {
    if (gwEl) {
      baseGW = parseFloat((baseGW + (Math.random() * 0.2 - 0.1)).toFixed(1));
      gwEl.textContent = baseGW.toLocaleString('en-US', { minimumFractionDigits: 1 });
    }
    if (endpointsEl) {
      baseEndpoints += Math.floor(Math.random() * 8) + 1;
      endpointsEl.textContent = baseEndpoints.toLocaleString('en-US');
    }
      const streamEl = document.getElementById('hero-log-stream');
    if (streamEl) {
      const logItem = document.createElement('div');
      logItem.className = 'action-log-item';
      logItem.innerHTML = '<span class="log-tag tag-autonomous">AUTONOMOUS</span> <span class="log-desc">Dynamic volt-VAR optimization active</span>';
      streamEl.insertBefore(logItem, streamEl.firstChild);
    }
  }, 3800);
}

function initEngineSimulator() {
  const tabs = document.querySelectorAll('.engine-step-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const step = tab.getAttribute('data-step');
      const consoleText = document.getElementById('sim-console-text');
      if (consoleText) {
        consoleText.textContent = '>> Active Layer ' + step + ' engaged.';
      }
    });
  });
}
