/**
 * UNIVERS — ALL CONNECTED. INTERACTIVE HOMEPAGE ENGINE
 * Powers the live decarbonization data stream, mobile navigation, scroll
 * reveals, interactive Edge -> Cloud -> Earth simulator, sector explorer,
 * and portfolio value calculator.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeroEntrance();
  initLiveTelemetry();
  initEngineSimulator();
  initSectorExplorer();
  initValueCalculator();
  initScrollReveal();

  // New Interactive Systems
  initKineticCanvas();
  initCyberCursor();
  init3DTiltCards();
  initCyberHUD();
  initNumberTallies();
});

/* ==========================================================================
   HERO ENTRANCE
   A single staggered fade/rise on load for the above-the-fold hero
   elements — the cinematic "curtain up" moment. Skips entirely for
   prefers-reduced-motion; elements are never hidden if JS fails to load.
   ========================================================================== */
function initHeroEntrance() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = document.querySelectorAll(
    '.hero-content .eyebrow, .hero-headline, .hero-lead, .hero-cta-group, .hero-trust-badges, .hero-visual'
  );
  if (!targets.length) return;

  targets.forEach((el, i) => {
    el.classList.add('hero-enter');
    el.style.transitionDelay = `${i * 90}ms`;
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      targets.forEach((el) => el.classList.add('hero-entered'));
    });
  });
}

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
    '.section-header, .card-glass, .compare-card, .engine-step-tab, .flywheel-card, .compliance-category, .authority-stat, .sector-content-card, .statement-text'
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
   2. LIVE TELEMETRY SIMULATOR
   Provides visceral evidence of sub-second real-time machine execution.
   ========================================================================== */
function initLiveTelemetry() {
  const gwEl = document.getElementById('telemetry-gw');
  const endpointsEl = document.getElementById('telemetry-endpoints');
  const latencyEl = document.getElementById('telemetry-latency');
  const actionsEl = document.getElementById('telemetry-actions');
  const streamEl = document.getElementById('hero-log-stream');

  let baseGW = 552.1;
  let baseEndpoints = 220140912;
  let baseActions = 14.82;

  const eventPool = [
    { tag: 'CONNECTED', type: 'tag-autonomous', text: 'Wind Farm Cluster 12: Turbine #8 output logged, generation forecast updated (+3.8%)' },
    { tag: 'REPORTED', type: 'tag-governed', text: 'Substation Alpha: Power factor data synced to EnOS Cloud; logged at 0.99' },
    { tag: 'CONNECTED', type: 'tag-autonomous', text: 'Automated Port Berth 6: AGV charging data streamed; demand flagged for review' },
    { tag: 'REPORTED', type: 'tag-governed', text: 'Semiconductor Fab Cleanroom: Airflow pressure differential logged; delta-P within range' },
    { tag: 'ABATED', type: 'tag-autonomous', text: 'Commercial Microgrid: 2.4 MWh BESS discharge recorded during dynamic tariff spike' }
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
   3. ENOS PLATFORM INTERACTIVE 3-STAGE SIMULATOR
   Edge -> Cloud -> Earth
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
      title: 'ON THE GROUND: ENOS EDGE',
      rate: 'CONNECTED: 220M+ Devices',
      console: '>> Reading real-time energy data from meters, sensors, BMS, and industrial equipment across every OEM protocol...',
      activeNodes: [node1]
    },
    '2': {
      title: 'IN THE CLOUD: ENOS CLOUD',
      rate: 'MANAGING: 552.1 GW Renewable Capacity',
      console: '>> Fusing on-the-ground data with cloud intelligence into accurate, reliable, actionable decarbonization data...',
      activeNodes: [node1, node2]
    },
    '3': {
      title: 'FOR THE EARTH: MONITORING, REPORTING & ABATEMENT',
      rate: 'COMMUNITY: 500+ Customers Toward Net Zero',
      console: '>> Delivering data-driven carbon monitoring, reporting, and abatement across the portfolio...',
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
      triggerBtn.textContent = 'Logging...';
      triggerBtn.disabled = true;

      if (consoleText) {
        consoleText.textContent = '>> NEW DATA POINT: Transformer 4 thermal reading logged. Emissions impact recalculated...';
      }

      setTimeout(() => {
        if (consoleText) {
          consoleText.textContent = '>> [LOGGED] Real-time carbon ledger updated in 32ms. Portfolio emissions trend visible instantly.';
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
  const quoteLabelEl = document.getElementById('quote-label');
  const quoteTextEl = document.getElementById('quote-text');
  const quoteAvatarEl = document.getElementById('quote-avatar');
  const quoteNameEl = document.getElementById('quote-name');
  const quoteRoleEl = document.getElementById('quote-role');

  const sectorData = {
    energy: {
      title: 'Energy & Utilities: Real-Time Data for an Intermittent Grid',
      desc: 'Grids face unprecedented pressure from rising renewable volatility, EV charging peaks, and distributed energy resources. Univers connects generation, storage, and market data in real time — the accurate picture operators need to manage, and transform, performance.',
      kpi1: '10–20%',
      kpiLabel1: 'Reduction in O&M costs',
      kpi2: '12%+',
      kpiLabel2: 'Revenue protection via AI power forecasting',
      kpi3: '550 GW+',
      kpiLabel3: 'Renewable energy under Univers management',
      quoteType: 'testimonial',
      quote: '“With Univers’ end-to-end solution and expertise, ORIX Renewable Energy Management can provide total customer support – from proposals to implementation to maintenance, which in turn helps our customers optimize energy use and reduce costs.”',
      avatar: 'KY',
      name: 'Kazuhisa Yurita',
      role: 'EVP & Chief Strategy Officer, ORIX Renewable Energy Management'
    },
    buildings: {
      title: 'Built Environment: Even Giants Can Have Small Footprints',
      desc: 'Commercial and institutional buildings consume massive amounts of power through inefficient HVAC and manual setpoints. Univers delivers real-time energy monitoring and predictive chiller and ventilation reporting across entire real estate portfolios.',
      kpi1: '9.8%',
      kpiLabel1: 'Verified net energy savings',
      kpi2: '99.5%',
      kpiLabel2: 'Portfolio-wide asset uptime',
      kpi3: '100%',
      kpiLabel3: 'Portfolio visibility, single pane of glass',
      quoteType: 'caseStudy',
      quote: 'Across commercial and institutional real estate portfolios, Univers customers report verified double-digit energy savings and full portfolio visibility from a single operating view — without compromising tenant comfort.',
      avatar: 'BE',
      name: 'Built Environment Benchmark',
      role: 'Aggregated across Univers real estate deployments'
    },
    logistics: {
      title: 'Transportation & Ports: Zero-Downtime Electrification',
      desc: 'Automated ports and EV fleet hubs cannot absorb power disruptions. Univers balances container crane peak demand, yard vehicle charging, and solar-plus-storage microgrids without interrupting global trade flows.',
      kpi1: '85M+ TEUs',
      kpiLabel1: 'Managed at PSA International',
      kpi2: '99.5%',
      kpiLabel2: 'Reduction in energy-related disruptions',
      kpi3: '8–12%',
      kpiLabel3: 'Terminal energy reduction',
      quoteType: 'testimonial',
      quote: '“We identified AI and IoT as technology levers to deliver intelligent insights and open our existing capabilities in engineering and operations.”',
      avatar: 'TC',
      name: 'Tan Choon Huat',
      role: 'AVP Energy Infrastructure, PSA International'
    },
    manufacturing: {
      title: 'Industrial Manufacturing: Pre-empting Unplanned Downtime',
      desc: 'Unplanned downtime is one of the costliest failure modes in manufacturing. Univers fuses machine telemetry, energy data, and maintenance history to catch abnormal equipment behavior before it causes a stoppage.',
      kpi1: '40%',
      kpiLabel1: 'Reduction in unplanned downtime',
      kpi2: '30%',
      kpiLabel2: 'Improvement in equipment effectiveness (OEE)',
      kpi3: '10 : 1',
      kpiLabel3: 'ROI realized within 12–18 months',
      quoteType: 'caseStudy',
      quote: 'Indorama deployed Univers’ smart factory platform to centralize energy data from smart meters and SCADA systems across its global operations — reaching worldwide ISO 50001 Energy Management System compliance while cutting plant-wide energy waste.',
      avatar: 'IN',
      name: 'Indorama',
      role: 'Global manufacturer & petrochemicals — Customer Story'
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
      if (window.UniversInteractive && window.UniversInteractive.updateOdometer) {
        if (kpi1El) window.UniversInteractive.updateOdometer(kpi1El, d.kpi1);
        if (kpi2El) window.UniversInteractive.updateOdometer(kpi2El, d.kpi2);
        if (kpi3El) window.UniversInteractive.updateOdometer(kpi3El, d.kpi3);
      } else {
        if (kpi1El) kpi1El.textContent = d.kpi1;
        if (kpi2El) kpi2El.textContent = d.kpi2;
        if (kpi3El) kpi3El.textContent = d.kpi3;
      }
      if (kpiLabel1El) kpiLabel1El.textContent = d.kpiLabel1;
      if (kpiLabel2El) kpiLabel2El.textContent = d.kpiLabel2;
      if (kpiLabel3El) kpiLabel3El.textContent = d.kpiLabel3;
      if (quoteLabelEl) quoteLabelEl.textContent = d.quoteType === 'testimonial' ? 'Customer Testimonial' : 'Customer Story';
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
      savingsRate = 0.098;
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
      if (window.UniversInteractive && window.UniversInteractive.updateOdometer) {
        window.UniversInteractive.updateOdometer(resSavings, `$${netSavings.toLocaleString('en-US')}`);
      } else {
        resSavings.textContent = `$${netSavings.toLocaleString('en-US')}`;
      }
    }
    if (resSubtext) {
      resSubtext.textContent = `Illustrative estimate — modeled at a ${(savingsRate * 100).toFixed(1)}% optimization rate from Univers’ published sector benchmarks`;
    }
    if (resPayback) {
      if (window.UniversInteractive && window.UniversInteractive.updateOdometer) {
        window.UniversInteractive.updateOdometer(resPayback, `< ${paybackMonths} Months`);
      } else {
        resPayback.textContent = `< ${paybackMonths} Months`;
      }
    }
    if (resCarbon) {
      if (window.UniversInteractive && window.UniversInteractive.updateOdometer) {
        window.UniversInteractive.updateOdometer(resCarbon, `${carbonTons.toLocaleString('en-US')} Tons/yr`);
      } else {
        resCarbon.textContent = `${carbonTons.toLocaleString('en-US')} Tons/yr`;
      }
    }
  }

  if (sectorSelect) sectorSelect.addEventListener('change', updateCalculator);
  if (scaleSlider) scaleSlider.addEventListener('input', updateCalculator);
  if (spendSlider) spendSlider.addEventListener('input', updateCalculator);

  updateCalculator();
}

/* ==========================================================================
   INTERACTIVE ENGINE: KINETIC BACKGROUND CANVAS & PHYSICS SIMULATION
   Decarbonization data mesh, floating OT telemetry nodes, mouse force-field,
   and drag-activated electric tethering.
   ========================================================================== */
function initKineticCanvas() {
  const canvas = document.getElementById('kinetic-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;

  // Global interactive configuration accessible by HUD
  window.UniversInteractive = window.UniversInteractive || {};
  window.UniversInteractive.bgMode = 'mesh'; // 'mesh' | 'matrix' | 'particles'
  window.UniversInteractive.cursorMode = 'plasma'; // 'plasma' | 'sparks'
  window.UniversInteractive.isSurging = false;
  window.UniversInteractive.soundEnabled = false;

  const particles = [];
  const floatingGlyphs = [];
  const dragTrail = [];
  const dragSparks = [];
  const radarRings = [];

  let mouseX = -9999;
  let mouseY = -9999;
  let prevMouseX = -9999;
  let prevMouseY = -9999;
  let isMouseDown = false;
  let isDragging = false;
  let dragDistance = 0;

  // Track viewport sizing with device pixel ratio
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  // Generate responsive pool of OT physical nodes
  function initParticles() {
    particles.length = 0;
    const count = Math.floor(Math.min(width, 1600) / 18); // ~50 to 90 nodes
    const colors = ['#5B4FE5', '#00E599', '#00D2FF', '#8478FF', '#14142B'];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: 1.5 + Math.random() * 2.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: 0.25 + Math.random() * 0.5,
        alpha: 0.3,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseOffset: Math.random() * Math.PI * 2,
        highlightTime: 0,
        highlightLabel: ''
      });
    }

    // Ambient floating OT data packets / HUD glyphs
    floatingGlyphs.length = 0;
    const glyphLabels = [
      'OT-NODE // 400kV',
      'IEC 61850 STREAM',
      'EnOS™ CLOUD SYNC',
      '552.1 GW MANAGED',
      'SUBSTATION ALPHA',
      'BERTH-04 AGV',
      'ALL CONNECTED',
      'BESS 2.4 MWh'
    ];

    const glyphCount = Math.max(4, Math.floor(width / 320));
    for (let g = 0; g < glyphCount; g++) {
      floatingGlyphs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.15 - Math.random() * 0.25,
        label: glyphLabels[g % glyphLabels.length],
        alpha: 0.18 + Math.random() * 0.22,
        size: 14 + Math.random() * 12,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.004
      });
    }
  }

  // Listeners for mouse tracking and interaction
  window.addEventListener('mousemove', (e) => {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (isMouseDown) {
      const distMoved = Math.hypot(mouseX - prevMouseX, mouseY - prevMouseY);
      dragDistance += distMoved;
      if (dragDistance > 4) {
        isDragging = true;
        addDragSparks(mouseX, mouseY, distMoved);
      }
    }
  });

  window.addEventListener('mousedown', (e) => {
    // Only capture primary mouse clicks
    if (e.button !== 0) return;
    isMouseDown = true;
    dragDistance = 0;
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isMouseDown = false;
    isDragging = false;
    dragDistance = 0;
  });

  window.addEventListener('mouseleave', () => {
    isMouseDown = false;
    isDragging = false;
    mouseX = -9999;
    mouseY = -9999;
  });

  // Radar click ping emitter on canvas
  window.addEventListener('click', (e) => {
    // Check if clicked element was an input or button
    if (e.target.closest('button, a, input, select, textarea, .cyber-hud')) return;
    triggerRadarPing(e.clientX, e.clientY);
  });

  function triggerRadarPing(x, y) {
    radarRings.push({
      x,
      y,
      radius: 5,
      maxRadius: Math.max(width, height) * 0.75,
      alpha: 0.8,
      speed: 14
    });

    if (window.UniversInteractive.soundEnabled && window.UniversInteractive.playSound) {
      window.UniversInteractive.playSound('ping');
    }
  }
  window.UniversInteractive.triggerRadar = triggerRadarPing;

  // Add sparks along cursor drag path
  function addDragSparks(x, y, speed) {
    const sparkCount = Math.min(Math.floor(speed * 0.4) + 1, 5);
    const colors = ['#5B4FE5', '#00E599', '#00D2FF', '#FFFFFF', '#8478FF'];

    // Push into drag trail points
    dragTrail.push({
      x,
      y,
      life: 1.0,
      decay: 0.04
    });
    if (dragTrail.length > 25) dragTrail.shift();

    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 1.5 + Math.random() * 4.5;
      dragSparks.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: 2 + Math.random() * 3.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0,
        decay: 0.035 + Math.random() * 0.04
      });
    }

    if (dragSparks.length > 120) dragSparks.splice(0, dragSparks.length - 120);

    if (window.UniversInteractive.soundEnabled && window.UniversInteractive.playSound) {
      window.UniversInteractive.playSound('drag');
    }
  }

  // Main Canvas Render Loop (60fps)
  let lastTime = performance.now();

  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    ctx.clearRect(0, 0, width, height);

    const isSurging = window.UniversInteractive.isSurging;
    const mode = window.UniversInteractive.bgMode;
    const speedMult = isSurging ? 2.8 : 1.0;

    // 1. Update & Render Ambient Floating Glyphs
    ctx.font = '9px "JetBrains Mono", monospace';
    for (let g = 0; g < floatingGlyphs.length; g++) {
      const gl = floatingGlyphs[g];
      gl.y += gl.vy * speedMult;
      gl.x += gl.vx * speedMult;
      gl.rot += gl.rotSpeed;

      if (gl.y < -40) gl.y = height + 40;
      if (gl.x < -40) gl.x = width + 40;
      if (gl.x > width + 40) gl.x = -40;

      // Draw subtle hexagon
      ctx.save();
      ctx.translate(gl.x, gl.y);
      ctx.rotate(gl.rot);
      ctx.strokeStyle = isSurging ? 'rgba(91, 79, 229, 0.4)' : `rgba(20, 20, 43, ${gl.alpha * 0.8})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let s = 0; s < 6; s++) {
        const a = (s * Math.PI) / 3;
        const hx = Math.cos(a) * (gl.size * 0.6);
        const hy = Math.sin(a) * (gl.size * 0.6);
        s === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();

      // Draw telemetry label
      ctx.fillStyle = isSurging ? 'rgba(91, 79, 229, 0.7)' : `rgba(82, 82, 95, ${gl.alpha})`;
      ctx.fillText(gl.label, gl.size * 0.8, 3);
      ctx.restore();
    }

    // 2. Update & Render Particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Physics velocity
      p.x += p.vx * speedMult;
      p.y += p.vy * speedMult;

      // Gentle screen bounce/wrap
      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      if (p.x > width) { p.x = width; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      if (p.y > height) { p.y = height; p.vy *= -1; }

      // Mouse Force-Field Repulsion & Interaction
      if (mouseX > 0 && mouseY > 0) {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.hypot(dx, dy);

        if (dist < 140) {
          const force = (1 - dist / 140) * (isDragging ? 3.0 : 1.4);
          p.vx += (dx / dist) * force * 0.8;
          p.vy += (dy / dist) * force * 0.8;
          p.highlightTime = 0.4;
        }
      }

      // Dampening to prevent runaway speed
      p.vx *= 0.98;
      p.vy *= 0.98;

      // Pulse alpha
      const pulse = Math.sin(now * p.pulseSpeed + p.pulseOffset);
      p.alpha = Math.max(0.1, p.baseAlpha + pulse * 0.15);

      if (p.highlightTime > 0) {
        p.highlightTime -= dt;
        p.alpha = Math.min(1.0, p.alpha + 0.5);
      }

      // Render node dot
      ctx.fillStyle = isSurging ? '#5B4FE5' : p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * (isSurging ? 1.5 : 1), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 3. Connect Nodes (OT Mesh / Matrix)
    if (mode === 'mesh' || mode === 'matrix') {
      const maxDist = mode === 'matrix' ? 95 : 115;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.18 * (isSurging ? 2.5 : 1);
            ctx.strokeStyle = isSurging
              ? `rgba(91, 79, 229, ${lineAlpha})`
              : `rgba(91, 79, 229, ${lineAlpha * 0.75})`;
            ctx.lineWidth = isSurging ? 1.4 : 0.8;

            ctx.beginPath();
            if (mode === 'matrix') {
              // Digital right-angle connections
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
            } else {
              // Direct organic vector connections
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
            }
            ctx.stroke();
          }
        }
      }
    }

    // 4. Mouse Tethering / Energy Arcs when Dragging
    if (isDragging && mouseX > 0) {
      let connectedCount = 0;
      for (let i = 0; i < particles.length && connectedCount < 4; i++) {
        const p = particles[i];
        const dist = Math.hypot(p.x - mouseX, p.y - mouseY);
        if (dist < 190) {
          connectedCount++;
          const arcAlpha = (1 - dist / 190) * 0.7;
          ctx.strokeStyle = `rgba(132, 120, 255, ${arcAlpha})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(mouseX, mouseY);
          // Curved electric bezier arc
          const cx = (mouseX + p.x) / 2 + (Math.random() - 0.5) * 20;
          const cy = (mouseY + p.y) / 2 + (Math.random() - 0.5) * 20;
          ctx.quadraticCurveTo(cx, cy, p.x, p.y);
          ctx.stroke();
        }
      }
    }

    // 5. Render Electric Drag Ribbon Trail
    if (dragTrail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(dragTrail[0].x, dragTrail[0].y);
      for (let t = 1; t < dragTrail.length; t++) {
        const pt = dragTrail[t];
        ctx.lineTo(pt.x, pt.y);
        pt.life -= pt.decay;
      }
      ctx.strokeStyle = 'rgba(91, 79, 229, 0.45)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Clean dead trail points
      while (dragTrail.length > 0 && dragTrail[0].life <= 0) {
        dragTrail.shift();
      }
    }

    // 6. Render Kinetic Drag Sparks
    for (let s = dragSparks.length - 1; s >= 0; s--) {
      const sp = dragSparks[s];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.vx *= 0.94;
      sp.vy *= 0.94;
      sp.life -= sp.decay;

      if (sp.life <= 0) {
        dragSparks.splice(s, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = sp.life;
      ctx.fillStyle = sp.color;
      ctx.shadowColor = sp.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 7. Render Radar Wave Rings
    for (let r = radarRings.length - 1; r >= 0; r--) {
      const ring = radarRings[r];
      ring.radius += ring.speed;
      ring.alpha = Math.max(0, 1 - ring.radius / ring.maxRadius);

      if (ring.radius >= ring.maxRadius) {
        radarRings.splice(r, 1);
        continue;
      }

      ctx.save();
      ctx.strokeStyle = `rgba(91, 79, 229, ${ring.alpha * 0.85})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = '#5B4FE5';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Highlight particles crossed by radar
      for (let p = 0; p < particles.length; p++) {
        const pt = particles[p];
        const dist = Math.hypot(pt.x - ring.x, pt.y - ring.y);
        if (Math.abs(dist - ring.radius) < ring.speed * 1.5) {
          pt.highlightTime = 0.9;
        }
      }
      ctx.restore();
    }
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(animate);
}

/* ==========================================================================
   INTERACTIVE CYBERNETIC CURSOR SYSTEM & DRAG ANIMATIONS
   Center dot + smooth lerp outer ring + magnetic target brackets
   and drag state morphing.
   ========================================================================== */
function initCyberCursor() {
  const cursorEl = document.getElementById('cyber-cursor');
  if (!cursorEl) return;

  // Only enable custom cursor on fine pointer devices (desktop/mouse)
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    cursorEl.style.display = 'none';
    return;
  }

  document.body.classList.add('cyber-cursor-active');

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;
  let isDragging = false;
  let isMouseDown = false;
  let dragOriginX = 0;
  let dragOriginY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (isMouseDown) {
      const moved = Math.hypot(mouseX - dragOriginX, mouseY - dragOriginY);
      if (moved > 5 && !isDragging) {
        isDragging = true;
        cursorEl.classList.add('is-dragging');
      }
    }
  });

  window.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    isMouseDown = true;
    dragOriginX = e.clientX;
    dragOriginY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isMouseDown = false;
    isDragging = false;
    cursorEl.classList.remove('is-dragging');
  });

  // Smooth lerp animation loop for the outer cursor ring
  function renderCursor() {
    // Lerp outer ring toward mouse coordinate
    cursorX += (mouseX - cursorX) * 0.22;
    cursorY += (mouseY - cursorY) * 0.22;

    cursorEl.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover detection for interactive targets
  const interactiveSelector = `
    a, button, input, select, textarea,
    [role="tab"], [role="button"],
    .sector-pill, .engine-step-tab, .logo-item,
    .tilt-card, .flow-node, .hud-action-btn, .hud-pill-btn
  `;

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(interactiveSelector);
    if (target) {
      cursorEl.classList.add('is-hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(interactiveSelector);
    if (target) {
      cursorEl.classList.remove('is-hovering');
    }
  });

  // Click spark burst on elements
  document.addEventListener('click', (e) => {
    spawnClickSparks(e.clientX, e.clientY);
  });

  function spawnClickSparks(x, y) {
    const sparkCount = 12;
    const colors = ['#5B4FE5', '#00E599', '#00D2FF', '#8478FF'];

    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement('div');
      spark.className = 'click-burst-spark';

      const angle = (i / sparkCount) * Math.PI * 2;
      const distance = 24 + Math.random() * 32;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const size = 3 + Math.random() * 3;
      const color = colors[i % colors.length];

      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;
      spark.style.backgroundColor = color;
      spark.style.boxShadow = `0 0 10px ${color}`;
      spark.style.setProperty('--dx', `${dx}px`);
      spark.style.setProperty('--dy', `${dy}px`);

      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 700);
    }
  }
}

/* ==========================================================================
   INTERACTIVE 3D PERSPECTIVE TILT & SPECULAR FLASHLIGHT
   Gives cards tactile physical depth responding to cursor coordinates.
   ========================================================================== */
function init3DTiltCards() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const cardSelectors = [
    '.telemetry-console',
    '.compare-card',
    '.sector-content-card',
    '.flywheel-card',
    '.calculator-card',
    '.hardware-banner',
    '.compliance-category',
    '.authority-stat'
  ];

  const cards = document.querySelectorAll(cardSelectors.join(', '));
  if (!cards.length) return;

  cards.forEach((card) => {
    card.classList.add('tilt-card');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Set CSS variables for spotlight flashlight
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Calculate subtle 3D rotation angles (-6deg to +6deg)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5.5;
      const rotateY = ((x - centerX) / centerX) * 5.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });
}

/* ==========================================================================
   INTERACTIVE CYBER HUD ENGINE & SOUND SYNTHESIZER
   Web Audio API procedural sound effects, stress test simulation,
   particle mode switcher, and radar controls.
   ========================================================================== */
function initCyberHUD() {
  const hudToggle = document.getElementById('cyber-hud-toggle');
  const hudPanel = document.getElementById('cyber-hud-panel');
  const hudClose = document.getElementById('cyber-hud-close');

  const soundToggle = document.getElementById('hud-sound-toggle');
  const audioIndicator = document.getElementById('hud-audio-indicator');
  const soundText = document.getElementById('hud-sound-text');
  const iconAudioOff = soundToggle ? soundToggle.querySelector('.icon-audio-off') : null;
  const iconAudioOn = soundToggle ? soundToggle.querySelector('.icon-audio-on') : null;

  const surgeBtn = document.getElementById('hud-trigger-surge');
  const statusBadge = document.getElementById('hud-status-badge');
  const radarScanBtn = document.getElementById('hud-radar-scan');

  const bgModeBtns = document.querySelectorAll('[data-bg-mode]');
  const cursorModeBtns = document.querySelectorAll('[data-cursor-mode]');

  // 1. HUD Toggle open/close
  if (hudToggle && hudPanel) {
    hudToggle.addEventListener('click', () => {
      const isExpanded = hudToggle.getAttribute('aria-expanded') === 'true';
      hudToggle.setAttribute('aria-expanded', !isExpanded);
      hudPanel.hidden = isExpanded;
    });
  }

  if (hudClose && hudPanel && hudToggle) {
    hudClose.addEventListener('click', () => {
      hudToggle.setAttribute('aria-expanded', 'false');
      hudPanel.hidden = true;
    });
  }

  // 2. Web Audio API Procedural Sound Synthesizer
  let audioCtx = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playProceduralSound(type) {
    if (!window.UniversInteractive.soundEnabled || !audioCtx) return;

    try {
      const now = audioCtx.currentTime;

      if (type === 'hover') {
        // High-tech subtle blip
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.05);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'click') {
        // Crisp tactile click
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'ping') {
        // Deep radar ping with resonant harmonics
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(520, now);
        osc1.frequency.exponentialRampToValueAtTime(260, now + 0.4);
        osc2.frequency.setValueAtTime(1040, now);
        osc2.frequency.exponentialRampToValueAtTime(520, now + 0.4);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.5);
        osc2.stop(now + 0.5);
      } else if (type === 'drag') {
        // Gentle electric buzz tone
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220 + Math.random() * 80, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'surge') {
        // High voltage surge frequency sweep
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.linearRampToValueAtTime(660, now + 0.5);
        osc.frequency.exponentialRampToValueAtTime(220, now + 1.2);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 1.35);
      }
    } catch (e) {
      // Audio playback failsafe
    }
  }

  window.UniversInteractive.playSound = playProceduralSound;

  // Sound Toggle Listener
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      initAudioContext();
      const isActive = !window.UniversInteractive.soundEnabled;
      window.UniversInteractive.soundEnabled = isActive;

      soundToggle.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      if (audioIndicator) {
        audioIndicator.textContent = isActive ? 'ACTIVE' : 'MUTED';
        audioIndicator.classList.toggle('active', isActive);
      }
      if (soundText) {
        soundText.textContent = isActive ? 'Disable Sci-Fi Audio FX' : 'Enable Sci-Fi Audio FX';
      }
      if (iconAudioOff) iconAudioOff.style.display = isActive ? 'none' : 'block';
      if (iconAudioOn) iconAudioOn.style.display = isActive ? 'block' : 'none';

      if (isActive) {
        playProceduralSound('ping');
      }
    });
  }

  // 3. Grid Surge / Stress Test Simulator
  if (surgeBtn) {
    surgeBtn.addEventListener('click', () => {
      initAudioContext();
      if (window.UniversInteractive.isSurging) return;

      window.UniversInteractive.isSurging = true;
      document.body.classList.add('grid-surge-active');
      surgeBtn.disabled = true;

      if (statusBadge) {
        statusBadge.textContent = 'SURGE ACTIVE';
        statusBadge.classList.add('active');
      }

      playProceduralSound('surge');

      // Spike hero telemetry metrics
      const gwEl = document.getElementById('telemetry-gw');
      const latencyEl = document.getElementById('telemetry-latency');
      const actionsEl = document.getElementById('telemetry-actions');
      const streamEl = document.getElementById('hero-log-stream');

      if (gwEl) gwEl.textContent = '714.9';
      if (latencyEl) {
        latencyEl.textContent = '9';
        latencyEl.style.color = '#FF4D4D';
      }
      if (actionsEl) actionsEl.textContent = '28.94';

      if (streamEl) {
        const surgeLog = document.createElement('div');
        surgeLog.className = 'action-log-item';
        surgeLog.innerHTML = `
          <span class="log-time mono-metric">[SURGE-ALERT]</span>
          <span class="log-tag tag-autonomous" style="background: rgba(255, 77, 77, 0.2); color: #FF4D4D; border-color: rgba(255, 77, 77, 0.4);">ANOMALY LOGGED</span>
          <span class="log-desc" style="color: #FF4D4D; font-weight: 600;">Substation 400kV bus frequency spike detected. Real-time data flagged for immediate reporting.</span>
        `;
        streamEl.insertBefore(surgeLog, streamEl.firstChild);
      }

      // After 1.8 seconds, the connected data stream resolves the anomaly
      setTimeout(() => {
        window.UniversInteractive.isSurging = false;
        document.body.classList.remove('grid-surge-active');
        surgeBtn.disabled = false;

        if (statusBadge) {
          statusBadge.textContent = 'STABILIZED';
          setTimeout(() => {
            if (statusBadge) {
              statusBadge.textContent = 'STANDBY';
              statusBadge.classList.remove('active');
            }
          }, 3000);
        }

        if (latencyEl) {
          latencyEl.textContent = '12';
          latencyEl.style.color = 'var(--univ-purple)';
        }

        if (streamEl) {
          const resolvedLog = document.createElement('div');
          resolvedLog.className = 'action-log-item';
          resolvedLog.innerHTML = `
            <span class="log-time mono-metric">[LOGGED]</span>
            <span class="log-tag tag-governed" style="background: rgba(0, 229, 153, 0.2); color: #00E599; border-color: rgba(0, 229, 153, 0.4);">NOMINAL ENVELOPE RESTORED</span>
            <span class="log-desc" style="color: #00E599; font-weight: 600;">Anomaly resolved and logged in 11ms. Frequency locked at 50.00 Hz. All 220M+ devices synchronized.</span>
          `;
          streamEl.insertBefore(resolvedLog, streamEl.firstChild);
        }

        playProceduralSound('ping');
      }, 1800);
    });
  }

  // 4. Background Particle Modes
  bgModeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      bgModeBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-bg-mode');
      if (mode && window.UniversInteractive) {
        window.UniversInteractive.bgMode = mode;
      }
      playProceduralSound('click');
    });
  });

  // 5. Cursor Drag FX Modes
  cursorModeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      cursorModeBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-cursor-mode');
      if (mode && window.UniversInteractive) {
        window.UniversInteractive.cursorMode = mode;
      }
      playProceduralSound('click');
    });
  });

  // 6. Radar Scan Button
  if (radarScanBtn) {
    radarScanBtn.addEventListener('click', () => {
      initAudioContext();
      if (window.UniversInteractive.triggerRadar) {
        window.UniversInteractive.triggerRadar(window.innerWidth / 2, window.innerHeight / 2);
      }
    });
  }
}

/* ==========================================================================
   INTERACTIVE TALLY & SCROLLING DIGIT ODOMETER SYSTEM
   Mechanical slot-machine / rolling counter physics for statistics,
   telemetry, KPIs, and calculator results.
   ========================================================================== */
function initNumberTallies() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function createOdometer(el, text) {
    if (!el) return null;
    const raw = text !== undefined ? String(text).trim() : el.textContent.trim();
    // Skip if there are no numerical digits (e.g. "Gartner Leader")
    if (!/\d/.test(raw)) return null;

    el.dataset.tallyTarget = raw;
    el.classList.add('tally-number');
    el.setAttribute('title', 'Hover or click to re-tally');

    el.innerHTML = '';
    const ribbons = [];
    let digitIdx = 0;

    const chars = raw.split('');
    chars.forEach((ch) => {
      if (/\d/.test(ch)) {
        const digit = parseInt(ch, 10);
        const col = document.createElement('span');
        col.className = 'odometer-col';

        const ribbon = document.createElement('span');
        ribbon.className = 'odometer-ribbon';

        // 20 items: 2 cycles of 0 through 9 so every digit scrolls down at least 10 numbers
        for (let cycle = 0; cycle < 2; cycle++) {
          for (let d = 0; d <= 9; d++) {
            const digitSpan = document.createElement('span');
            digitSpan.className = 'odometer-char';
            digitSpan.textContent = d;
            ribbon.appendChild(digitSpan);
          }
        }

        // Start position at top (0%)
        ribbon.style.transform = 'translateY(0%)';
        ribbon.dataset.target = digit;
        ribbon.dataset.colIdx = digitIdx;

        col.appendChild(ribbon);
        el.appendChild(col);
        ribbons.push(ribbon);
        digitIdx++;
      } else {
        const staticSpan = document.createElement('span');
        staticSpan.className = 'odometer-static';
        staticSpan.textContent = ch;
        el.appendChild(staticSpan);
      }
    });

    let isRolling = false;

    function roll(duration = 1200) {
      if (isRolling) return;
      isRolling = true;

      // Reset to 0% initially
      ribbons.forEach((ribbon) => {
        ribbon.style.transition = 'none';
        ribbon.style.transform = 'translateY(0%)';
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ribbons.forEach((ribbon) => {
            const target = parseInt(ribbon.dataset.target, 10);
            const colIdx = parseInt(ribbon.dataset.colIdx, 10);
            const delay = colIdx * 45; // Staggered ripple
            // Scroll down into the second cycle: (10 + target) * 5%
            const targetY = (10 + target) * 5;
            ribbon.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;
            ribbon.style.transform = `translateY(-${targetY}%)`;
          });

          setTimeout(() => {
            isRolling = false;
            el.classList.remove('tally-landed');
            requestAnimationFrame(() => el.classList.add('tally-landed'));
          }, duration + ribbons.length * 45);
        });
      });

      if (window.UniversInteractive && window.UniversInteractive.soundEnabled && window.UniversInteractive.playSound) {
        window.UniversInteractive.playSound('hover');
      }
    }

    // Interactive re-roll triggers
    el.addEventListener('mouseenter', () => roll(850));
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      roll(1050);
    });

    const odo = { roll, update: (newText) => createOdometer(el, newText) };
    el.__odometer = odo;
    return odo;
  }

  // Expose global update method for dynamic recalculations
  window.UniversInteractive = window.UniversInteractive || {};
  window.UniversInteractive.updateOdometer = (el, text) => {
    const odo = createOdometer(el, text);
    if (odo) odo.roll(800);
  };

  // Find all statistics on page
  const targetSelectors = [
    '.authority-stat .stat-number',
    '.market-signal-grid .kpi-metric',
    '.sector-kpis .kpi-metric',
    '#res-savings',
    '#res-carbon',
    '#res-payback'
  ];

  const statEls = document.querySelectorAll(targetSelectors.join(', '));
  const odometers = [];

  statEls.forEach((el) => {
    const odo = createOdometer(el);
    if (odo) odometers.push({ el, odo });
  });

  // IntersectionObserver: trigger scrolling tally when scrolled into view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const matched = odometers.find((item) => item.el === entry.target);
          if (matched) {
            matched.odo.roll(1250);
          }
        }
      });
    },
    { threshold: 0.15 }
  );

  odometers.forEach((item) => observer.observe(item.el));
}


