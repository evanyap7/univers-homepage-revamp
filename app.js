/**
 * UNIVERS PHYSICAL AI - INTERACTIVE HOMEPAGE ENGINE
 * Powers live telemetry stream, Elementor Inspector overlay,
 * interactive 3-stage architecture simulator, sector explorer,
 * and portfolio value calculator.
 */

document.addEventListener('DOMContentLoaded', () => {
  initElementorInspector();
  initMobileNav();
  initLiveTelemetry();
  initEngineSimulator();
  initSectorExplorer();
  initValueCalculator();
  initScrollReveal();
});

/* ==========================================================================
   MOBILE NAV: OFFCANVAS DRAWER
   Accessible hamburger toggle: focus handling, Escape-to-close,
   backdrop click, and auto-close when a link is chosen or the
   viewport grows back past the mobile breakpoint.
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('nav-backdrop');
  if (!toggleBtn || !drawer || !backdrop) return;

  const mobileMediaQuery = window.matchMedia('(max-width: 768px)');
  let lastFocusedEl = null;

  function openDrawer() {
    lastFocusedEl = document.activeElement;
    drawer.classList.add('open');
    backdrop.classList.add('open');
    backdrop.hidden = false;
    document.body.classList.add('nav-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Close menu');
    const firstLink = drawer.querySelector('.nav-link');
    if (firstLink) firstLink.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.classList.remove('nav-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Open menu');
    setTimeout(() => {
      if (!drawer.classList.contains('open')) backdrop.hidden = true;
    }, 350);
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  function isOpen() {
    return drawer.classList.contains('open');
  }

  toggleBtn.addEventListener('click', () => {
    isOpen() ? closeDrawer() : openDrawer();
  });

  backdrop.addEventListener('click', closeDrawer);

  drawer.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeDrawer();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !isOpen()) return;
    closeDrawer();
  });

  drawer.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !isOpen()) return;
    const focusable = drawer.querySelectorAll('a, button');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  mobileMediaQuery.addEventListener('change', (e) => {
    if (!e.matches && isOpen()) closeDrawer();
  });
}

/* ==========================================================================
   SCROLL REVEAL
   Lightweight IntersectionObserver fade/slide-up on section entry.
   Skips entirely for prefers-reduced-motion.
   ========================================================================== */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll(
    '.section-header, .card-glass, .compare-card, .engine-step-tab, .flywheel-card, .compliance-category, .authority-stat, .sector-content-card'
  );
  if (!targets.length) return;

  targets.forEach((el) => el.classList.add('reveal-on-scroll'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   1. ELEMENTOR INSPECTOR OVERLAY
   Enables web developers to preview how this design translates 1:1
   into Elementor 4.x Containers and Widgets.
   ========================================================================== */
function initElementorInspector() {
  const inspectorBtn = document.getElementById('toggle-inspector-btn');
  if (!inspectorBtn) return;

  inspectorBtn.addEventListener('click', () => {
    const isActive = document.body.classList.toggle('elementor-inspector-active');
    inspectorBtn.classList.toggle('active', isActive);
    inspectorBtn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    
    // Update button text
    const textSpan = inspectorBtn.querySelector('span');
    if (textSpan) {
      textSpan.textContent = isActive ? 'Elementor Mode: ON' : 'Elementor Mode';
    }
  });
}

/* ==========================================================================
   2. LIVE TELEMETRY SIMULATOR
   Provides visceral evidence of sub-second real-time machine execution.
   ========================================================================== */
function initLiveTelemetry() {
  const gwEl = document.getElementById('telemetry-gw');
  const endpointsEl = document.getElementById('telemetry-endpoints');
  const latencyEl = document.getElementById('telemetry-latency');
  const actionsEl = document.getElementById('telemetry-actions');
  const streamEl = document.getElementById('hero-log-stream');

  let baseGW = 1072.4;
  let baseEndpoints = 452890140;
  let baseActions = 14.82;

  const eventPool = [
    { tag: 'AUTONOMOUS', type: 'tag-autonomous', text: 'Wind Farm Cluster 12: Turbine #8 yaw optimized for wake-steering (+3.8% generation)' },
    { tag: 'GOVERNED', type: 'tag-governed', text: 'Substation Alpha: Volt-VAR optimization triggered; active power factor locked at 0.99' },
    { tag: 'AUTONOMOUS', type: 'tag-autonomous', text: 'Automated Port Berth 6: AGV charging throttled to prevent transformer surge' },
    { tag: 'GOVERNED', type: 'tag-governed', text: 'Semiconductor Fab Cleanroom: Airflow pressure differential stabilized; delta-P restored' },
    { tag: 'AUTONOMOUS', type: 'tag-autonomous', text: 'Commercial Microgrid: Discharged 2.4 MWh BESS during dynamic tariff price spike' }
  ];

  let eventIdx = 0;

  // Pulse telemetry every 3.5 seconds
  setInterval(() => {
    // Subtle numerical micro-variations
    if (gwEl) {
      const deltaGW = (Math.random() * 0.2 - 0.1).toFixed(1);
      baseGW = parseFloat((baseGW + parseFloat(deltaGW)).toFixed(1));
      gwEl.textContent = baseGW.toLocaleString('en-US', { minimumFractionDigits: 1 });
    }

    if (endpointsEl) {
      baseEndpoints += Math.floor(Math.random() * 8) + 1;
      endpointsEl.textContent = baseEndpoints.toLocaleString('en-US');
    }

    if (actionsEl) {
      baseActions = parseFloat((baseActions + 0.001).toFixed(3));
      actionsEl.textContent = baseActions.toFixed(2);
    }

    if (latencyEl) {
      const lat = Math.floor(42 + Math.random() * 12);
      latencyEl.textContent = lat;
    }

    // Add new event to live console log stream
    if (streamEl) {
      const evt = eventPool[eventIdx % eventPool.length];
      eventIdx++;

      const now = new Date();
      const timeStr = `[${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}]`;

      const logItem = document.createElement('div');
      logItem.className = 'action-log-item';
      logItem.innerHTML = `
        <span class="log-time mono-metric">${timeStr}</span>
        <span class="log-tag ${evt.type}">${evt.tag}</span>
        <span class="log-desc">${evt.text}</span>
      `;

      streamEl.insertBefore(logItem, streamEl.firstChild);
      if (streamEl.children.length > 4) {
        streamEl.removeChild(streamEl.lastChild);
      }
    }
  }, 3800);
}

/* ==========================================================================
   3. PHYSICAL AI ENGINE INTERACTIVE 3-STAGE SIMULATOR
   Perceive -> Understand -> Orchestrate
   ========================================================================== */
function initEngineSimulator() {
  const tabs = document.querySelectorAll('.engine-step-tab');
  const stageTitle = document.getElementById('engine-stage-title');
  const consoleText = document.getElementById('sim-console-text');
  const telemetryRate = document.getElementById('engine-telemetry-rate');
  const triggerBtn = document.getElementById('trigger-sim-action');
  
  const node1 = document.getElementById('node-1');
  const node2 = document.getElementById('node-2');
  const node3 = document.getElementById('node-3');

  const stageData = {
    '1': {
      title: 'LAYER 01: REAL-TIME PHYSICAL PERCEPTION',
      rate: 'RATE: 2.84M events/sec',
      console: '>> Streaming 450M endpoints: Ingesting Modbus, IEC 61850, OPC-UA, BACnet, MQTT packets in sub-50ms cycles...',
      activeNodes: [node1]
    },
    '2': {
      title: 'LAYER 02: INDUSTRIAL DOMAIN ONTOLOGY',
      rate: 'GRAPH: 12.8M Nodes // 48M Relations',
      console: '>> Fusing time-series physics, weather vectors, degradation models, and dynamic power market constraints...',
      activeNodes: [node1, node2]
    },
    '3': {
      title: 'LAYER 03: GOVERNED AUTONOMOUS EXECUTION',
      rate: 'EXECUTION: <15ms Closed-Loop',
      console: '>> EnOS Domain Agents executing autonomous setpoint adjustments within pre-certified safety parameters...',
      activeNodes: [node1, node2, node3]
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const step = tab.getAttribute('data-step');
      const data = stageData[step];

      if (data) {
        if (stageTitle) stageTitle.querySelector('span:last-child').textContent = data.title;
        if (telemetryRate) telemetryRate.textContent = data.rate;
        if (consoleText) consoleText.textContent = data.console;

        [node1, node2, node3].forEach(n => {
          if (n) n.classList.remove('highlighted');
        });
        data.activeNodes.forEach(n => {
          if (n) n.classList.add('highlighted');
        });
      }
    });
  });

  // Manual Trigger Simulation
  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      triggerBtn.textContent = 'Executing...';
      triggerBtn.disabled = true;

      if (consoleText) {
        consoleText.textContent = '>> ANOMALY DETECTED: Thermal surge on Transformer 4. Pre-empting trip with load-rebalance agent...';
      }

      setTimeout(() => {
        if (consoleText) {
          consoleText.textContent = '>> [SUCCESS] Load rebalanced in 32ms. Trip avoided. Telemetry returned to nominal envelope.';
        }
        triggerBtn.textContent = 'Simulate Event';
        triggerBtn.disabled = false;
      }, 1400);
    });
  }
}

/* ==========================================================================
   4. SECTOR EXPLORER (4 CRITICAL INFRASTRUCTURE DOMAINS)
   ========================================================================== */
function initSectorExplorer() {
  const pills = document.querySelectorAll('.sector-pill');
  const titleEl = document.getElementById('sec-title');
  const descEl = document.getElementById('sec-desc');
  const kpi1El = document.getElementById('kpi-1');
  const kpiLabel1El = document.getElementById('kpi-label-1');
  const kpi2El = document.getElementById('kpi-2');
  const kpiLabel2El = document.getElementById('kpi-label-2');
  const kpi3El = document.getElementById('kpi-3');
  const kpiLabel3El = document.getElementById('kpi-label-3');
  const quoteTextEl = document.getElementById('quote-text');
  const quoteAvatarEl = document.getElementById('quote-avatar');
  const quoteNameEl = document.getElementById('quote-name');
  const quoteRoleEl = document.getElementById('quote-role');

  const sectorData = {
    energy: {
      title: 'Energy & Utilities: Stabilizing the Intermittent Grid',
      desc: 'Grids are facing unprecedented pressure from rising renewable volatility, EV charging peaks, and distributed energy resources. Univers coordinates generation, storage, and curtailment in real time.',
      kpi1: '1,005 GW',
      kpiLabel1: 'Assets under AI orchestration',
      kpi2: '10–20%',
      kpiLabel2: 'Reduction in O&M costs',
      kpi3: '+12%',
      kpiLabel3: 'Revenue gain via AI power forecast',
      quote: '“The clarity and consistency of data across different suppliers, and the ability to drill from site-level KPIs down to rack and cell data, are vital to our day-to-day operation.”',
      avatar: 'KS',
      name: 'Ked Shayer',
      role: 'Engineering Director, Harmony Energy'
    },
    buildings: {
      title: 'Built Environment: Eliminating 40% Global Energy Waste',
      desc: 'Commercial and institutional buildings consume massive amounts of power through inefficient HVAC and manual setpoints. Univers delivers autonomous predictive chiller and ventilation control across entire real estate portfolios.',
      kpi1: '9.8%',
      kpiLabel1: 'Verified net energy reduction',
      kpi2: '99.5%',
      kpiLabel2: 'Critical chiller plant uptime',
      kpi3: '< 12 Mo',
      kpiLabel3: 'Verified payback period',
      quote: '“Univers gave us complete portfolio visibility across 42 commercial towers. The predictive thermal optimization reduced our chiller consumption with zero tenant discomfort.”',
      avatar: 'DL',
      name: 'David Lim',
      role: 'Head of Portfolio Operations, Global Asset Management'
    },
    logistics: {
      title: 'Transportation & Ports: Zero-Downtime Electrification',
      desc: 'Automated ports and EV fleet hubs cannot absorb power disruptions. Univers balances container crane peak demand, yard vehicle charging, and solar-plus-storage microgrids without interrupting global trade flows.',
      kpi1: '85M+ TEUs',
      kpiLabel1: 'Managed at PSA International',
      kpi2: '99.5%',
      kpiLabel2: 'Energy disruption reduction',
      kpi3: '8–12%',
      kpiLabel3: 'Terminal energy reduction',
      quote: '“We identified AI and IoT as technology levers to deliver intelligent insights and open our existing capabilities in engineering and port operations.”',
      avatar: 'TC',
      name: 'Tan Choon Huat',
      role: 'AVP Energy Infrastructure, PSA International'
    },
    manufacturing: {
      title: 'Industrial Manufacturing: Pre-empting Unplanned Downtime',
      desc: 'Unplanned downtime is the single costliest failure mode in manufacturing. Univers analyzes CNC machine vibrations, motor current signatures, and power quality to predict mechanical failures 30 to 90 days before they occur.',
      kpi1: '40%',
      kpiLabel1: 'Reduction in unplanned downtime',
      kpi2: '30%',
      kpiLabel2: 'Improvement in asset effectiveness',
      kpi3: '10 : 1',
      kpiLabel3: 'ROI realized within 12–18 months',
      quote: '“With Univers, we track 50 CNC machines in real time. Predictive maintenance spots abnormal power signatures early, reducing idle consumption and cutting breakdown risk significantly.”',
      avatar: 'AC',
      name: 'Astro Chang',
      role: 'CEO, Starburst Holdings / Nordic Group'
    }
  };

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      const sectorKey = pill.getAttribute('data-sector');
      const d = sectorData[sectorKey];
      if (!d) return;

      if (titleEl) titleEl.textContent = d.title;
      if (descEl) descEl.textContent = d.desc;
      if (kpi1El) kpi1El.textContent = d.kpi1;
      if (kpiLabel1El) kpiLabel1El.textContent = d.kpiLabel1;
      if (kpi2El) kpi2El.textContent = d.kpi2;
      if (kpiLabel2El) kpiLabel2El.textContent = d.kpiLabel2;
      if (kpi3El) kpi3El.textContent = d.kpi3;
      if (kpiLabel3El) kpiLabel3El.textContent = d.kpiLabel3;
      if (quoteTextEl) quoteTextEl.textContent = d.quote;
      if (quoteAvatarEl) quoteAvatarEl.textContent = d.avatar;
      if (quoteNameEl) quoteNameEl.textContent = d.name;
      if (quoteRoleEl) quoteRoleEl.textContent = d.role;
    });
  });
}

/* ==========================================================================
   5. PORTFOLIO VALUE REALIZATION CALCULATOR
   ========================================================================== */
function initValueCalculator() {
  const sectorSelect = document.getElementById('calc-sector');
  const scaleSlider = document.getElementById('calc-scale-slider');
  const spendSlider = document.getElementById('calc-spend-slider');

  const scaleDisplay = document.getElementById('calc-scale-display');
  const spendDisplay = document.getElementById('calc-spend-display');

  const resSavings = document.getElementById('res-savings');
  const resSubtext = document.getElementById('res-subtext');
  const resPayback = document.getElementById('res-payback');
  const resCarbon = document.getElementById('res-carbon');

  function updateCalculator() {
    if (!scaleSlider || !spendSlider || !sectorSelect) return;

    const sector = sectorSelect.value;
    const scaleVal = parseInt(scaleSlider.value, 10);
    const spendVal = parseInt(spendSlider.value, 10); // in Millions USD

    // Update slider labels
    if (sector === 'buildings') {
      const sqft = (scaleVal * 1000000).toLocaleString('en-US');
      scaleDisplay.textContent = `${sqft} sq ft`;
    } else if (sector === 'energy') {
      const gw = (scaleVal * 0.25).toFixed(2);
      scaleDisplay.textContent = `${gw} GW Capacity`;
    } else if (sector === 'logistics') {
      const teus = (scaleVal * 1.5).toFixed(1);
      scaleDisplay.textContent = `${teus}M TEUs / Terminals`;
    } else {
      scaleDisplay.textContent = `${scaleVal * 2} Industrial Plants`;
    }

    spendDisplay.textContent = `$${spendVal},000,000 / yr`;

    // Calculation multipliers based on Univers real-world benchmarks
    let savingsRate = 0.12; // 12% default
    let paybackMonths = 10;
    let carbonMultiplier = 400; // tons per $M spend

    if (sector === 'energy') {
      savingsRate = 0.14;
      paybackMonths = 8;
      carbonMultiplier = 650;
    } else if (sector === 'buildings') {
      savingsRate = 0.118;
      paybackMonths = 10;
      carbonMultiplier = 420;
    } else if (sector === 'logistics') {
      savingsRate = 0.105;
      paybackMonths = 11;
      carbonMultiplier = 380;
    } else if (sector === 'manufacturing') {
      savingsRate = 0.155;
      paybackMonths = 9;
      carbonMultiplier = 510;
    }

    const netSavings = Math.round(spendVal * 1000000 * savingsRate);
    const carbonTons = Math.round(spendVal * carbonMultiplier);

    if (resSavings) {
      resSavings.textContent = `$${netSavings.toLocaleString('en-US')}`;
    }
    if (resSubtext) {
      resSubtext.textContent = `Verified ${(savingsRate * 100).toFixed(1)}% operational optimization & downtime prevention`;
    }
    if (resPayback) {
      resPayback.textContent = `< ${paybackMonths} Months`;
    }
    if (resCarbon) {
      resCarbon.textContent = `${carbonTons.toLocaleString('en-US')} Tons/yr`;
    }
  }

  if (sectorSelect) sectorSelect.addEventListener('change', updateCalculator);
  if (scaleSlider) scaleSlider.addEventListener('input', updateCalculator);
  if (spendSlider) spendSlider.addEventListener('input', updateCalculator);

  updateCalculator();
}
