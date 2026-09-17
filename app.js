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
  }, 3800);
}
