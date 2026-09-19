/**
 * UNIVERS — ALL CONNECTED. INTERACTIVE HOMEPAGE ENGINE
 * Powers the live decarbonization data stream, mobile navigation, scroll
 * reveals, interactive Edge -> Cloud -> Earth simulator, sector explorer,
 * and portfolio value calculator.
 */

function boot() {
  const systems = [
    ['initMobileNav', initMobileNav],
    ['initHeroEntrance', initHeroEntrance],
    ['initLiveTelemetry', initLiveTelemetry],
    ['initEngineSimulator', initEngineSimulator],
    ['initSectorExplorer', initSectorExplorer],
    ['initCompareAccordion', initCompareAccordion],
    ['initKeyClientsInteractive', initKeyClientsInteractive],
    ['initPartnerMarqueeTooltip', initPartnerMarqueeTooltip],
    ['initValueCalculator', initValueCalculator],
    ['initScrollReveal', initScrollReveal],
    ['initKineticCanvas', initKineticCanvas],
    ['initCyberCursor', initCyberCursor],
    ['init3DTiltCards', init3DTiltCards],
    ['initCyberHUD', initCyberHUD],
    ['initNumberTallies', initNumberTallies],
    ['initDemoBookingFlow', initDemoBookingFlow],
    ['initChapterNav', initChapterNav],
    ['initEnOSStackExplorer', initEnOSStackExplorer]
  ];

  systems.forEach(([name, fn]) => {
    try {
      if (typeof fn === 'function') fn();
    } catch (err) {
      console.warn(`[Univers] Error starting ${name}:`, err);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}


/* ==========================================================================
   HERO ENTRANCE
   A single staggered fade/rise on load for the above-the-fold hero
   elements — the cinematic "curtain up" moment. Skips entirely for
   prefers-reduced-motion; elements are never hidden if JS fails to load.
   ========================================================================== */
function initHeroEntrance() {
  // Render above the fold immediately: first paint presents the value proposition
  // instantly without visual blank, opacity delay, or staggered layout shift.
  return;
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

  let baseGW = 1072.4;
  let baseEndpoints = 452140912;
  let baseActions = 1013.24;

  const eventPool = [
    { tag: 'OPTIMIZED', type: 'tag-autonomous', text: 'Public housing cluster: 9-vendor BMS setpoint dispatched; 142 kWh saved with zero comfort deviation' },
    { tag: 'CONNECTED', type: 'tag-governed', text: 'Port terminal, SEA: Automated prime mover routing synchronized across 70+ global terminals' },
    { tag: 'THROTTLED', type: 'tag-autonomous', text: 'Commercial fleet hub: 2,100 EV truck charging loads scheduled; peak demand protected in 11ms' },
    { tag: 'STABILIZED', type: 'tag-governed', text: 'Battery gigafactory: Cell thermal variance analyzed; production line OEE stabilized at 81.4%' },
    { tag: 'DISPATCHED', type: 'tag-autonomous', text: 'Regional BESS: 2.4 MWh discharge recorded during dynamic tariff peak; avoided carbon logged' }
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
      baseActions = parseFloat((baseActions + 0.01).toFixed(2));
      actionsEl.textContent = Math.round(baseActions).toLocaleString('en-US');
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
      rate: 'CONNECTED: 450M+ Sensors & Devices',
      console: '>> Reading real-time energy data from meters, sensors, BMS, and industrial equipment across every OEM protocol...',
      activeNodes: [node1]
    },
    '2': {
      title: 'IN THE CLOUD: ENOS CLOUD',
      rate: 'MANAGING: 1,070 GW Energy Assets (~20% Global Renewable Capacity)',
      console: '>> Fusing on-the-ground data with cloud intelligence into accurate, reliable, actionable decarbonization data...',
      activeNodes: [node1, node2]
    },
    '3': {
      title: 'FOR THE EARTH: MONITORING, REPORTING & ABATEMENT',
      rate: 'ABATEMENT: 1,013M tCO2e Avoided (800+ Global Clients)',
      console: '>> Delivering data-driven carbon monitoring, reporting, and abatement across the global enterprise portfolio...',
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

  // Deep-link support: ?step=1|2|3 — the EnOS Platform page's "See in
  // Simulator" bridge buttons land here cross-page and pass this instead
  // of the old same-page scroll+click.
  const requestedStep = new URLSearchParams(window.location.search).get('step');
  if (requestedStep) {
    const targetTab = document.querySelector(`.engine-step-tab[data-step="${requestedStep}"]`);
    if (targetTab) targetTab.click();
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
      desc: 'Grids face unprecedented pressure from rising renewable volatility, EV charging peaks, and distributed energy resources. Univers connects generation, storage, and market data in real time, managing ~20% of global installed renewable capacity.',
      kpi1: '10–20%',
      kpiLabel1: 'Reduction in O&M costs',
      kpi2: '1,013M',
      kpiLabel2: 'Million tCO2e avoided carbon emissions',
      kpi3: '1,070 GW',
      kpiLabel3: 'Managed energy assets (~20% global renewable capacity)',
      quoteType: 'testimonial',
      quote: '“With Univers’ end-to-end solution and expertise, ORIX Renewable Energy Management can provide total customer support – from proposals to implementation to maintenance, which in turn helps our customers optimize energy use and reduce costs.”',
      avatar: 'KY',
      name: 'Kazuhisa Yurita',
      role: 'EVP & Chief Strategy Officer, ORIX Renewable Energy Management'
    },
    buildings: {
      title: 'Built Environment: Cloud BMS Proven at National Scale',
      desc: 'Commercial and institutional buildings consume massive amounts of power through inefficient HVAC and manual setpoints. Univers migrated 9 legacy BMS vendors into a single sovereign cloud across 10,000+ national assets.',
      kpi1: 'S$7.0M / yr',
      kpiLabel1: 'Verified annual benefit (HDB Singapore)',
      kpi2: '1.94×',
      kpiLabel2: 'Verified ROI on S$3.6M investment',
      kpi3: '10,000+',
      kpiLabel3: 'Assets AI-onboarded across 9 BMS vendors',
      quoteType: 'caseStudy',
      quote: 'HDB deployed Univers to unify 11,000 residential blocks, 36 shopping malls, and 2,000 car parks into one sovereign cloud platform, replacing 9 proprietary BMS vendors, slashing integration time by 50%, and generating S$7.0M in verified annual savings.',
      avatar: 'HDB',
      name: 'Housing & Development Board (HDB)',
      role: 'Singapore Sovereign Smart Nation Deployment'
    },
    logistics: {
      title: 'Transportation & Ports: Fleet Electrification & Coordinated Terminals',
      desc: 'Automated ports and electrified logistics cannot absorb power disruptions. Univers balances container crane peak demand, yard EV fleets, and automated charging depots without interrupting global supply chains.',
      kpi1: '€41M / yr',
      kpiLabel1: 'Net annual EBIT impact by 2030 (DHL Fleet)',
      kpi2: 'S$330M',
      kpiLabel2: 'Annual operating profit uplift (PSA International)',
      kpi3: '60,000+',
      kpiLabel3: 'Assets onboarded across 40+ OEMs',
      quoteType: 'caseStudy',
      quote: 'At PSA International (70+ terminals across 45 countries) and DHL Fleet (electrifying 2,100 heavy-duty trucks across 299 sites), Univers unlocks massive operational upside while guaranteeing grid resiliency under intensive megawatt charging demands.',
      avatar: 'PSA',
      name: 'PSA International & DHL Fleet',
      role: 'Global Trade & Logistics Electrification Case Studies'
    },
    manufacturing: {
      title: 'Industrial Manufacturing: Physical AI for Core Factory Operations',
      desc: 'Unplanned downtime and yield loss are the costliest failure modes in advanced manufacturing. Univers fuses machine telemetry, thermodynamics, and energy management to systematically boost Overall Equipment Effectiveness.',
      kpi1: '50% → 80%',
      kpiLabel1: 'Systematic OEE improvement (AESC)',
      kpi2: '$48M+ / yr',
      kpiLabel2: 'Annual productivity improvement per plant',
      kpi3: '$39M+',
      kpiLabel3: 'Annual operating cost reduction',
      quoteType: 'caseStudy',
      quote: 'AESC deployed Univers across 10+ battery gigafactories in 6 countries. By combining physical AI with real-time operational feedback, AESC achieved a 30%+ OEE uplift in 18 months, generating over $192M in annual net EBIT impact across its manufacturing fleet.',
      avatar: 'AESC',
      name: 'AESC Gigafactories',
      role: 'Global Battery Manufacturing: Core Factory Operations'
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
   4a2. COMPARE LIST ACCORDION (Fragmentation Trap / Unity Through Connection)
   Collapsed-by-default so the Overview doesn't dump all four points at once.
   ========================================================================== */
function initCompareAccordion() {
  const items = document.querySelectorAll('.compare-accordion-item');
  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector('.compare-accordion-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const willOpen = !item.classList.contains('open');
      item.classList.toggle('open', willOpen);
      trigger.setAttribute('aria-expanded', String(willOpen));
    });
  });
}

/* ==========================================================================
   4b. KEY CLIENTS INTERACTIVE TAB PANEL
   ========================================================================== */
function initKeyClientsInteractive() {
  const tabs = document.querySelectorAll('.kc-tab');
  const badgeEl = document.getElementById('kc-badge');
  const nameEl = document.getElementById('kc-name');
  const descEl = document.getElementById('kc-desc');
  const metricsEl = document.getElementById('kc-metrics');

  if (!tabs.length || !badgeEl) return;

  const clients = {
    psa: {
      badge: 'KEY CLIENT // GLOBAL PORTS',
      name: 'PSA International',
      desc: "World's largest port operator spanning 70+ terminals across 180+ locations in 45 countries, with S$5B annual OPEX managed on EnOS.",
      metrics: [
        { val: 'S$330M', lbl: 'Annual operating profit uplift' },
        { val: 'S$83M',  lbl: 'Annual revenue uplift' },
        { val: '45',     lbl: 'Countries covered' }
      ]
    },
    dhl: {
      badge: 'KEY CLIENT // FLEET ELECTRIFICATION',
      name: 'DHL Fleet',
      desc: 'Electrifying 2,100 heavy-duty trucks across 299 German sites, with 60,000+ assets onboarded across 40+ EV and charger OEMs.',
      metrics: [
        { val: '€41M',    lbl: 'Net annual EBIT impact by 2030' },
        { val: '2,100',   lbl: 'Heavy-duty trucks electrified' },
        { val: '60,000+', lbl: 'Assets onboarded' }
      ]
    },
    hdb: {
      badge: 'KEY CLIENT // NATIONAL INFRASTRUCTURE',
      name: 'HDB Singapore',
      desc: '9 legacy BMS vendors unified into 1 sovereign Singapore cloud platform across 11,000 residential blocks, 36 malls, and 2,000 car parks.',
      metrics: [
        { val: 'S$7.0M', lbl: 'Verified annual benefit' },
        { val: '1.94×',  lbl: 'ROI on S$3.6M investment' },
        { val: '10,000+', lbl: 'Assets AI-onboarded' }
      ]
    },
    aesc: {
      badge: 'KEY CLIENT // BATTERY GIGAFACTORIES',
      name: 'AESC Gigafactories',
      desc: '10+ battery gigafactories in 6 countries with U$5B OPEX, from 50% to 80% systematic OEE uplift in 18 months.',
      metrics: [
        { val: '50%→80%', lbl: 'Systematic OEE uplift' },
        { val: '$48M+',   lbl: 'Annual productivity gain / plant' },
        { val: '$39M+',   lbl: 'Annual operating cost reduction' }
      ]
    },
    changi: {
      badge: 'KEY CLIENT // GLOBAL AVIATION',
      name: 'Changi Airport Singapore',
      desc: 'Terminal 3 and Jewel HVAC energy optimization, delivering real-time operational insights and heightened asset reliability at the world\'s most awarded airport.',
      metrics: [
        { val: 'T1–T5',  lbl: 'Terminals covered' },
        { val: '24/7',   lbl: 'Real-time HVAC monitoring' },
        { val: 'Smart',  lbl: 'Net-zero airport initiative' }
      ]
    },
    sp: {
      badge: 'KEY CLIENT // GRID VPP',
      name: 'SP Group',
      desc: "Advancing Singapore's Virtual Power Plant (VPP) initiative under the Energy Market Authority's (EMA) Regulatory Sandbox, enabling distributed energy at national scale.",
      metrics: [
        { val: 'VPP',    lbl: 'Virtual Power Plant operator' },
        { val: 'EMA',    lbl: 'Regulatory sandbox certified' },
        { val: 'SGX',    lbl: 'Listed national utility' }
      ]
    },
    cdg: {
      badge: 'KEY CLIENT // TRANSIT & FLEET',
      name: 'ComfortDelGro',
      desc: 'Multi-modal smart charging, site microgrid optimization, and automated machine maintenance for one of the world\'s largest land transport groups.',
      metrics: [
        { val: '45K+',   lbl: 'Fleet vehicles managed' },
        { val: 'Multi',  lbl: 'Modal transport types' },
        { val: 'Smart',  lbl: 'EV depot microgrid' }
      ]
    },
    hkia: {
      badge: 'KEY CLIENT // AIRPORT MICROGRID',
      name: 'HK International Airport',
      desc: 'AI-orchestrated smart building automation, peak load shifting, and predictive energy efficiency at international aviation scale, Asia\'s cargo hub.',
      metrics: [
        { val: '#1',     lbl: 'Busiest cargo airport, Asia' },
        { val: 'AI',     lbl: 'Energy optimization engine' },
        { val: 'Smart',  lbl: 'Building automation layer' }
      ]
    }
  };

  function renderMetrics(metricsList) {
    metricsEl.innerHTML = metricsList.map(m => `
      <div class="kc-metric">
        <div class="kc-metric-val">${m.val}</div>
        <div class="kc-metric-lbl">${m.lbl}</div>
      </div>
    `).join('');
  }

  function selectClient(key) {
    const data = clients[key];
    if (!data) return;

    // Animate out panel
    const panel = document.getElementById('kc-panel');
    if (panel) {
      panel.style.opacity = '0';
      panel.style.transform = 'translateY(6px)';
    }

    setTimeout(() => {
      badgeEl.textContent = data.badge;
      nameEl.textContent = data.name;
      descEl.textContent = data.desc;
      renderMetrics(data.metrics);

      if (panel) {
        panel.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0)';
      }
    }, 180);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      selectClient(tab.dataset.client);
    });
  });

  // Auto-cycle through clients every 5s
  let autoIdx = 0;
  const tabKeys = Array.from(tabs).map(t => t.dataset.client);

  const autoCycle = setInterval(() => {
    // Only auto-cycle if user hasn't interacted recently
    autoIdx = (autoIdx + 1) % tabKeys.length;
    const targetTab = tabs[autoIdx];
    if (targetTab) {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      targetTab.classList.add('active');
      targetTab.setAttribute('aria-selected', 'true');
      selectClient(tabKeys[autoIdx]);
    }
  }, 5000);

  // Stop auto-cycle when user clicks
  tabs.forEach(tab => {
    tab.addEventListener('click', () => clearInterval(autoCycle), { once: true });
  });
}

/* ==========================================================================
   4c. PARTNER MARQUEE HOVER TOOLTIP
   The scrolling track sits inside an overflow:hidden wrapper (needed to
   mask the infinite-loop edges), so a per-logo tooltip can't be a child of
   that wrapper without being clipped. Instead we position one shared
   tooltip node against the un-clipped .partners-marquee-wrap ancestor.
   ========================================================================== */
function initPartnerMarqueeTooltip() {
  const wrap = document.querySelector('.partners-marquee-wrap');
  if (!wrap) return;

  const tooltip = document.createElement('div');
  tooltip.className = 'marquee-hover-tooltip';
  wrap.appendChild(tooltip);

  let hideTimer = null;

  wrap.addEventListener('mouseover', (e) => {
    const item = e.target.closest('.marquee-logo-item');
    if (!item || !item.dataset.name) return;
    clearTimeout(hideTimer);

    const wrapRect = wrap.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    tooltip.textContent = item.dataset.name;
    tooltip.style.left = `${itemRect.left - wrapRect.left + itemRect.width / 2}px`;
    tooltip.style.top = `${itemRect.top - wrapRect.top}px`;
    tooltip.classList.add('visible');
  });

  wrap.addEventListener('mouseout', (e) => {
    const item = e.target.closest('.marquee-logo-item');
    if (!item) return;
    if (item.contains(e.relatedTarget)) return;
    hideTimer = setTimeout(() => tooltip.classList.remove('visible'), 60);
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
      resSubtext.textContent = `Illustrative estimate, modeled at a ${(savingsRate * 100).toFixed(1)}% optimization rate from Univers’ published sector benchmarks`;
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
  let isDragging = false;
  let isMouseDown = false;
  let dragDistance = 0;

  // Scroll depth tracking for 5-stage kinetic narrative transitions
  let currentScrollProgress = 0;
  let targetScrollProgress = 0;

  function updateScrollProgress() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      targetScrollProgress = Math.max(0, Math.min(1, window.scrollY / totalHeight));
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

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
    updateScrollProgress();
  }

  // Generate responsive pool of OT physical nodes — kept sparse and low-contrast
  // so it reads as quiet ambient texture, not a busy foreground decoration.
  function initParticles() {
    particles.length = 0;
    const count = Math.floor(Math.min(width, 1600) / 42); // ~20 to 38 nodes
    const colors = ['#7A42EA', '#00E599', '#00D2FF', '#A984F1', '#14142B'];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: 1.5 + Math.random() * 2.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: 0.12 + Math.random() * 0.22,
        alpha: 0.15,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseOffset: Math.random() * Math.PI * 2,
        highlightTime: 0,
        highlightLabel: '',
        clusterId: i % 3
      });
    }

    // Ambient floating OT data packets / HUD glyphs — rare, not a wallpaper pattern
    floatingGlyphs.length = 0;
    const glyphLabels = [
      'OT-NODE // 400kV',
      'IEC 61850 STREAM',
      'EnOS™ CLOUD SYNC',
      '1,070 GW MANAGED',
      'SUBSTATION ALPHA',
      'BERTH-04 AGV',
      'ALL CONNECTED',
      'BESS 2.4 MWh'
    ];

    const glyphCount = Math.max(1, Math.floor(width / 700));
    for (let g = 0; g < glyphCount; g++) {
      floatingGlyphs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.15 - Math.random() * 0.25,
        label: glyphLabels[g % glyphLabels.length],
        alpha: 0.07 + Math.random() * 0.08,
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
    const colors = ['#7A42EA', '#00E599', '#00D2FF', '#FFFFFF', '#A984F1'];

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

    // Smooth scroll depth lerp for 5-stage kinetic narrative
    currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.08;
    const isLabPage = !!document.getElementById('cyber-hud-panel');

    // 1. Update & Render Ambient Floating Glyphs (strictly on lab playground page to prevent text occlusion on marketing pages)
    if (isLabPage) {
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
        ctx.strokeStyle = isSurging ? 'rgba(122, 66, 234, 0.4)' : `rgba(20, 20, 43, ${gl.alpha * 0.8})`;
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
        ctx.fillStyle = isSurging ? 'rgba(122, 66, 234, 0.7)' : `rgba(82, 82, 95, ${gl.alpha})`;
        ctx.fillText(gl.label, gl.size * 0.8, 3);
        ctx.restore();
      }
    }

    // 2. Update & Render Particles with 5-stage scroll behavior
    const isStage2 = currentScrollProgress >= 0.16 && currentScrollProgress < 0.36;
    const isStage3 = currentScrollProgress >= 0.36 && currentScrollProgress < 0.56;
    const isStage5 = currentScrollProgress >= 0.78;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Stage-specific physics forces
      if (isStage2) {
        // Stage 2 (Tension / Fragmentation): Particles pulled toward 3 siloed cluster centers
        const clusterCenters = [
          { x: width * 0.22, y: height * 0.35 },
          { x: width * 0.78, y: height * 0.35 },
          { x: width * 0.50, y: height * 0.70 }
        ];
        const target = clusterCenters[p.clusterId];
        p.vx += (target.x - p.x) * 0.0006;
        p.vy += (target.y - p.y) * 0.0006;
      } else if (isStage3) {
        // Stage 3 (The Turn): Gentle central attraction to bridge clusters
        p.vx += (width * 0.5 - p.x) * 0.00025;
        p.vy += (height * 0.5 - p.y) * 0.00025;
      }

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

      // Pulse alpha with stage fade on close
      const pulse = Math.sin(now * p.pulseSpeed + p.pulseOffset);
      let baseAlpha = Math.max(0.1, p.baseAlpha + pulse * 0.15);
      if (isStage5) {
        baseAlpha *= Math.max(0.15, 1 - (currentScrollProgress - 0.78) * 3);
      }
      p.alpha = baseAlpha;

      if (p.highlightTime > 0) {
        p.highlightTime -= dt;
        p.alpha = Math.min(1.0, p.alpha + 0.5);
      }

      // Render node dot
      ctx.fillStyle = isSurging ? '#7A42EA' : p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * (isSurging ? 1.5 : 1), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 3. Connect Nodes across 5 narrative stages
    if (mode === 'mesh' || mode === 'matrix') {
      let maxDist = 115;
      if (isStage2) {
        maxDist = 85;
      } else if (isStage3) {
        maxDist = 135;
      } else if (isStage5) {
        maxDist = 80;
      }

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];

          // In Stage 2 (Tension / Fragmentation), suppress cross-cluster connections
          if (isStage2 && p1.clusterId !== p2.clusterId) {
            continue;
          }

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDist) {
            let lineAlpha = (1 - dist / maxDist) * 0.18 * (isSurging ? 2.5 : 1);
            if (isStage5) lineAlpha *= 0.25;

            // In Stage 3 (The Turn), highlight cross-cluster bridges
            const isBridge = isStage3 && p1.clusterId !== p2.clusterId;
            if (isBridge) {
              ctx.strokeStyle = `rgba(0, 229, 153, ${lineAlpha * 1.5})`;
              ctx.lineWidth = 1.2;
            } else {
              ctx.strokeStyle = isSurging
                ? `rgba(122, 66, 234, ${lineAlpha})`
                : `rgba(122, 66, 234, ${lineAlpha * 0.75})`;
              ctx.lineWidth = isSurging ? 1.4 : 0.8;
            }

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
      ctx.strokeStyle = 'rgba(122, 66, 234, 0.45)';
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
      ctx.strokeStyle = `rgba(122, 66, 234, ${ring.alpha * 0.85})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = '#7A42EA';
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
    const colors = ['#7A42EA', '#00E599', '#00D2FF', '#A984F1'];

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
  // The HUD panel is only included on the homepage — other pages skip it.
  if (!hudToggle || !hudPanel) return;

  const soundToggle = document.getElementById('hud-sound-toggle');
  const audioIndicator = document.getElementById('hud-audio-indicator');
  const soundText = document.getElementById('hud-sound-text');
  const iconAudioOff = soundToggle ? soundToggle.querySelector('.icon-audio-off') : null;
  const iconAudioOn = soundToggle ? soundToggle.querySelector('.icon-audio-on') : null;

  const surgeBtn = document.getElementById('hud-trigger-surge');
  const statusBadge = document.getElementById('hud-status-badge');
  const radarScanBtn = document.getElementById('hud-radar-scan');
  const logicCoreToggle = document.getElementById('hud-logic-core-toggle');
  const logicCoreStage = document.getElementById('logic-core-stage');
  const logicCoreBadge = document.getElementById('hud-logic-core-badge');
  const logicCoreText = document.getElementById('hud-logic-core-text');

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
            <span class="log-desc" style="color: #00E599; font-weight: 600;">Anomaly resolved and logged in 11ms. Frequency locked at 50.00 Hz. All 450M+ devices synchronized.</span>
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

  // 7. Logic Core Toggle — intensifies the CSS-only pulse/orbit for 6s
  if (logicCoreToggle && logicCoreStage) {
    let logicCoreTimer = null;
    logicCoreToggle.addEventListener('click', () => {
      initAudioContext();
      playProceduralSound('surge');
      logicCoreStage.classList.add('is-active');
      if (logicCoreBadge) logicCoreBadge.classList.add('active');
      if (logicCoreBadge) logicCoreBadge.textContent = 'ACTIVE';
      if (logicCoreText) logicCoreText.textContent = 'Logic Core Active';

      clearTimeout(logicCoreTimer);
      logicCoreTimer = setTimeout(() => {
        logicCoreStage.classList.remove('is-active');
        if (logicCoreBadge) logicCoreBadge.classList.remove('active');
        if (logicCoreBadge) logicCoreBadge.textContent = 'IDLE';
        if (logicCoreText) logicCoreText.textContent = 'Activate Logic Core';
      }, 6000);
    });
  }
}

/* ==========================================================================
   INTERACTIVE TALLY & SCROLLING DIGIT ODOMETER SYSTEM
   Mechanical slot-machine / rolling counter physics for statistics,
   telemetry, KPIs, and calculator results.
   ========================================================================== */
function initNumberTallies() {
  function createOdometer(el, text) {
    if (!el) return null;
    const raw = text !== undefined ? String(text).trim() : el.textContent.trim();
    // Skip if there are no numerical digits (e.g. "All Connected")
    if (!/\d/.test(raw)) return null;

    // Stop odometer animations on static years (2030) and scientific thresholds (1.5°C)
    if (el.classList.contains('no-odometer') || el.dataset.staticMetric === 'true' || /1\.5|2030|2026/i.test(raw)) {
      return null;
    }

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
            const delay = colIdx * 50; // Staggered ripple
            // Scroll down into the second cycle: (10 + target) * 5%
            const targetY = (10 + target) * 5;
            ribbon.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;
            ribbon.style.transform = `translateY(-${targetY}%)`;
          });

          setTimeout(() => {
            isRolling = false;
            el.classList.remove('tally-landed');
            requestAnimationFrame(() => el.classList.add('tally-landed'));
          }, duration + ribbons.length * 50);
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

    // Also enable parent stat card click to re-roll
    const parentCard = el.closest('.authority-stat, .kpi-box, .sector-kpis');
    if (parentCard && !parentCard.__hasTallyListener) {
      parentCard.__hasTallyListener = true;
      parentCard.addEventListener('click', () => roll(1050));
    }

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
    '.stat-number',
    '.market-signal-grid .kpi-metric',
    '.sector-kpis .kpi-metric',
    '#res-savings',
    '#res-carbon',
    '#res-payback'
  ];

  const statEls = Array.from(document.querySelectorAll(targetSelectors.join(', ')));
  // Filter unique elements
  const uniqueEls = [...new Set(statEls)];
  const odometers = [];

  uniqueEls.forEach((el) => {
    const odo = createOdometer(el);
    if (odo) odometers.push({ el, odo });
  });

  // Helper to check if element is already in viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom > 0
    );
  }

  // Trigger roll for elements already visible on load
  setTimeout(() => {
    odometers.forEach(({ el, odo }, i) => {
      if (isElementInViewport(el)) {
        setTimeout(() => odo.roll(1200), i * 80);
      }
    });
  }, 250);

  // IntersectionObserver: trigger scrolling tally when scrolled into view
  if ('IntersectionObserver' in window) {
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
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    odometers.forEach((item) => observer.observe(item.el));
  }
}

/* ==========================================================================
   INTERACTIVE DEMO BOOKING FLOW & CSV DATABASE ENGINE
   Handles modal states, strict email validation, confirmation follow-through,
   and persistent CSV database management.
   ========================================================================== */
function initDemoBookingFlow() {
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Modals
  const demoBackdrop = document.getElementById('demo-modal-backdrop');
  const demoModal = document.getElementById('demo-modal');
  const demoCloseBtn = document.getElementById('demo-modal-close');

  const leadsBackdrop = document.getElementById('leads-modal-backdrop');
  const leadsModal = document.getElementById('leads-db-modal');
  const leadsCloseBtn = document.getElementById('leads-modal-close');

  // Form elements
  const formView = document.getElementById('demo-form-view');
  const successView = document.getElementById('demo-success-view');
  const form = document.getElementById('demo-booking-form');
  const submitBtn = document.getElementById('demo-submit-btn');

  const nameInput = document.getElementById('demo-name');
  const emailInput = document.getElementById('demo-email');
  const orgInput = document.getElementById('demo-org');
  const inquiryInput = document.getElementById('demo-inquiry');

  const nameError = document.getElementById('demo-name-error');
  const emailError = document.getElementById('demo-email-error');
  const orgError = document.getElementById('demo-org-error');
  const inquiryError = document.getElementById('demo-inquiry-error');

  // Success view elements
  const receiptId = document.getElementById('receipt-id');
  const receiptContact = document.getElementById('receipt-name-email');
  const receiptOrg = document.getElementById('receipt-org');
  const receiptInquiry = document.getElementById('receipt-inquiry');
  const btnDoneDemo = document.getElementById('btn-done-demo');
  const btnDownloadRecord = document.getElementById('btn-download-record-csv');
  const btnViewLeads = document.getElementById('btn-view-leads-db');

  // Database elements
  const leadsCountText = document.getElementById('leads-total-count');
  const hudLeadsCount = document.getElementById('hud-leads-count');
  const leadsTableBody = document.getElementById('leads-table-body');
  const btnExportCsv = document.getElementById('btn-export-full-csv');
  const btnAddSample = document.getElementById('btn-add-sample-lead');
  const hudOpenLeadsBtn = document.getElementById('hud-open-leads-db');

  // Triggers
  const triggerNav = document.getElementById('nav-cta-demo');
  const triggerMobile = document.getElementById('mobile-cta-demo');
  const triggerCalc = document.getElementById('calc-cta-demo');
  const triggerFinal = document.getElementById('final-cta-demo');

  // --- CSV DATABASE STORAGE ---
  const STORAGE_KEY = 'univers_demo_leads_db_v1';
  const DEFAULT_LEADS = [
    {
      id: 'UNIV-DEMO-2026-001',
      timestamp: '2026-09-17T12:00:00.000Z',
      name: 'Marcus Vance',
      email: 'm.vance@orix-renewables.com',
      organisation: 'ORIX Renewable Energy Management',
      inquiry: 'Scaling real-time AI power forecasting across 4.2 GW solar-plus-storage fleet.',
      status: 'DISPATCHED'
    },
    {
      id: 'UNIV-DEMO-2026-002',
      timestamp: '2026-09-17T15:30:00.000Z',
      name: 'Eileen Wu',
      email: 'eileen.wu@capitaland.com',
      organisation: 'CapitaLand Real Estate Investment',
      inquiry: 'Automating central chiller plant COP telemetry and Scope 2 tenant carbon accounting across 12 commercial towers.',
      status: 'DISPATCHED'
    }
  ];

  function getLeads() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return DEFAULT_LEADS;
  }

  function saveLeads(leads) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {}
    updateLeadsCount(leads.length);
    renderLeadsTable(leads);
  }

  function updateLeadsCount(count) {
    if (leadsCountText) leadsCountText.textContent = count;
    if (hudLeadsCount) hudLeadsCount.textContent = count;
  }

  function escapeCsv(val) {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  }

  function generateCsvString(leads) {
    const header = 'ID,Timestamp (ISO),Full Name,Business Email,Organisation,Inquiry,Status\r\n';
    const rows = leads.map((l) =>
      [
        escapeCsv(l.id),
        escapeCsv(l.timestamp),
        escapeCsv(l.name),
        escapeCsv(l.email),
        escapeCsv(l.organisation),
        escapeCsv(l.inquiry),
        escapeCsv(l.status || 'PENDING')
      ].join(',')
    ).join('\r\n');
    return header + rows;
  }

  function downloadCsv(filename, content) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    if (window.UniversInteractive && window.UniversInteractive.playSound) {
      window.UniversInteractive.playSound('ping');
    }
  }

  function renderLeadsTable(leads) {
    if (!leadsTableBody) return;
    leadsTableBody.innerHTML = '';
    leads.forEach((lead) => {
      const tr = document.createElement('tr');
      const dateStr = new Date(lead.timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      tr.innerHTML = `
        <td class="mono-metric" style="font-weight: 600; color: var(--univ-purple);">${lead.id}</td>
        <td style="color: var(--univ-text-muted); font-size: 0.76rem;">${dateStr}</td>
        <td style="font-weight: 600;">${lead.name}</td>
        <td class="mono-metric" style="color: var(--univ-text-secondary);">${lead.email}</td>
        <td>${lead.organisation}</td>
        <td class="cell-inquiry" title="${lead.inquiry}">${lead.inquiry}</td>
        <td><span class="status-tag ${lead.status === 'DISPATCHED' ? 'status-dispatched' : 'status-new'}">${lead.status || 'NEW'}</span></td>
      `;
      leadsTableBody.appendChild(tr);
    });
  }

  // --- MODAL CONTROLS ---
  let lastActiveLead = null;

  function openDemoModal(initialInquiry = '') {
    if (demoBackdrop) {
      demoBackdrop.hidden = false;
      document.body.style.overflow = 'hidden';
      // Reset views
      if (formView) formView.hidden = false;
      if (successView) successView.hidden = true;
      clearErrors();

      if (initialInquiry && inquiryInput) {
        inquiryInput.value = initialInquiry;
      }
      setTimeout(() => {
        if (nameInput) nameInput.focus();
      }, 100);
    }
    if (window.UniversInteractive && window.UniversInteractive.playSound) {
      window.UniversInteractive.playSound('click');
    }
  }

  function closeDemoModal() {
    if (demoBackdrop) {
      demoBackdrop.hidden = true;
      document.body.style.overflow = '';
    }
  }

  function openLeadsModal() {
    renderLeadsTable(getLeads());
    if (leadsBackdrop) {
      leadsBackdrop.hidden = false;
      document.body.style.overflow = 'hidden';
    }
    if (window.UniversInteractive && window.UniversInteractive.playSound) {
      window.UniversInteractive.playSound('click');
    }
  }

  function closeLeadsModal() {
    if (leadsBackdrop) {
      leadsBackdrop.hidden = true;
      document.body.style.overflow = '';
    }
  }

  // Bind close buttons and backdrop clicks
  if (demoCloseBtn) demoCloseBtn.addEventListener('click', closeDemoModal);
  if (demoBackdrop) {
    demoBackdrop.addEventListener('click', (e) => {
      if (e.target === demoBackdrop) closeDemoModal();
    });
  }

  if (leadsCloseBtn) leadsCloseBtn.addEventListener('click', closeLeadsModal);
  if (leadsBackdrop) {
    leadsBackdrop.addEventListener('click', (e) => {
      if (e.target === leadsBackdrop) closeLeadsModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDemoModal();
      closeLeadsModal();
    }
  });

  // --- VALIDATION HELPERS ---
  function showError(input, errorEl, msg) {
    if (input) input.classList.add('has-error');
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.add('visible');
    }
  }

  function clearError(input, errorEl) {
    if (input) input.classList.remove('has-error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  function clearErrors() {
    clearError(nameInput, nameError);
    clearError(emailInput, emailError);
    clearError(orgInput, orgError);
    clearError(inquiryInput, inquiryError);
  }

  [nameInput, emailInput, orgInput, inquiryInput].forEach((inp) => {
    if (inp) {
      inp.addEventListener('input', () => {
        inp.classList.remove('has-error');
        const err = document.getElementById(`${inp.id}-error`);
        if (err) {
          err.textContent = '';
          err.classList.remove('visible');
        }
      });
    }
  });

  // --- FORM SUBMISSION ---
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const org = orgInput ? orgInput.value.trim() : '';
      const inquiry = inquiryInput ? inquiryInput.value.trim() : '';

      let hasError = false;

      if (!name || name.length < 2) {
        showError(nameInput, nameError, 'Please provide your full name.');
        hasError = true;
      }

      if (!email) {
        showError(emailInput, emailError, 'Business email is required.');
        hasError = true;
      } else if (!EMAIL_REGEX.test(email)) {
        showError(emailInput, emailError, 'Please enter a valid email address (e.g. name@organisation.com).');
        hasError = true;
      }

      if (!org || org.length < 2) {
        showError(orgInput, orgError, 'Please provide your organisation or enterprise name.');
        hasError = true;
      }

      if (!inquiry || inquiry.length < 5) {
        showError(inquiryInput, inquiryError, 'Please describe your inquiry or decarbonization requirements.');
        hasError = true;
      }

      if (hasError) return;

      // Disable button during submission
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span>Submitting Demo Request...</span>
          <svg class="btn-icon rotating" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
          </svg>
        `;
      }

      const id = `UNIV-DEMO-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const timestamp = new Date().toISOString();

      const newLead = {
        id,
        timestamp,
        name,
        email: email.toLowerCase(),
        organisation: org,
        inquiry,
        status: 'DISPATCHED'
      };

      lastActiveLead = newLead;

      // 1. Save to local CSV database
      const leads = getLeads();
      leads.unshift(newLead);
      saveLeads(leads);

      // 2. Dispatch to /api/book-demo in background
      try {
        fetch('/api/book-demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newLead)
        }).catch(() => {});
      } catch (err) {}

      // 3. Show follow-through confirmation screen
      setTimeout(() => {
        if (formView) formView.hidden = true;
        if (successView) successView.hidden = false;

        if (receiptId) receiptId.textContent = newLead.id;
        if (receiptContact) receiptContact.textContent = `${newLead.name} (${newLead.email})`;
        if (receiptOrg) receiptOrg.textContent = newLead.organisation;
        if (receiptInquiry) receiptInquiry.textContent = newLead.inquiry;

        // Reset submit button state for next time
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span>Book a demo</span>
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          `;
        }

        if (form) form.reset();

        if (window.UniversInteractive && window.UniversInteractive.playSound) {
          window.UniversInteractive.playSound('ping');
        }
      }, 500);
    });
  }

  // --- ACTIONS IN SUCCESS VIEW ---
  if (btnDoneDemo) {
    btnDoneDemo.addEventListener('click', closeDemoModal);
  }

  if (btnDownloadRecord) {
    btnDownloadRecord.addEventListener('click', () => {
      if (!lastActiveLead) return;
      const csvData = generateCsvString([lastActiveLead]);
      downloadCsv(`univers_demo_booking_${lastActiveLead.id}.csv`, csvData);
    });
  }

  if (btnViewLeads) {
    btnViewLeads.addEventListener('click', () => {
      closeDemoModal();
      openLeadsModal();
    });
  }

  // --- ACTIONS IN LEADS DATABASE MODAL ---
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      const leads = getLeads();
      const csvData = generateCsvString(leads);
      downloadCsv('univers_demo_leads.csv', csvData);
    });
  }

  if (btnAddSample) {
    btnAddSample.addEventListener('click', () => {
      const sampleNames = ['Alex Mercer', 'Elena Rostova', 'Kenji Sato', 'Priya Sharma', 'David Lindqvist'];
      const sampleOrgs = ['Vattenfall Renewables', 'Singapore Power Grid', 'Mitsubishi Heavy Industries', 'Vestas Offshore', 'Maersk Decarb'];
      const sampleInquiries = [
        'Looking to integrate 1.8 GW wind telemetry into EnOS Cloud.',
        'Feasibility study for building microgrid BESS load shifting.',
        'Connecting port container cranes for peak demand abatement.',
        'Scope 1 and 2 automated emissions reporting for audit readiness.'
      ];
      const randName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const randOrg = sampleOrgs[Math.floor(Math.random() * sampleOrgs.length)];
      const randEmail = `${randName.toLowerCase().replace(' ', '.')}@${randOrg.toLowerCase().replace(/[^a-z]/g, '')}.com`;
      const randInquiry = sampleInquiries[Math.floor(Math.random() * sampleInquiries.length)];

      const sampleLead = {
        id: `UNIV-DEMO-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        name: randName,
        email: randEmail,
        organisation: randOrg,
        inquiry: randInquiry,
        status: 'NEW'
      };

      const leads = getLeads();
      leads.unshift(sampleLead);
      saveLeads(leads);
      if (window.UniversInteractive && window.UniversInteractive.playSound) {
        window.UniversInteractive.playSound('click');
      }
    });
  }

  if (hudOpenLeadsBtn) {
    hudOpenLeadsBtn.addEventListener('click', openLeadsModal);
  }

  // --- TRIGGER HOOKS ON SITE BUTTONS ---
  if (triggerNav) {
    triggerNav.addEventListener('click', (e) => {
      e.preventDefault();
      openDemoModal();
    });
  }

  if (triggerMobile) {
    triggerMobile.addEventListener('click', (e) => {
      e.preventDefault();
      const drawer = document.getElementById('mobile-nav-drawer');
      const backdrop = document.getElementById('nav-backdrop');
      if (drawer) drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      document.body.classList.remove('nav-open');
      openDemoModal();
    });
  }

  if (triggerCalc) {
    triggerCalc.addEventListener('click', (e) => {
      e.preventDefault();
      const sectorSelect = document.getElementById('calc-sector');
      const spendDisplay = document.getElementById('calc-spend-display');
      const resSavings = document.getElementById('res-savings');
      const resCarbon = document.getElementById('res-carbon');

      const sector = sectorSelect ? sectorSelect.value : 'Energy';
      const spend = spendDisplay ? spendDisplay.textContent : '$12,000,000 / yr';
      const savings = (resSavings && resSavings.dataset.tallyTarget) ? resSavings.dataset.tallyTarget : (resSavings ? resSavings.textContent : '$1,176,000');
      const carbon = (resCarbon && resCarbon.dataset.tallyTarget) ? resCarbon.dataset.tallyTarget : (resCarbon ? resCarbon.textContent : '5,040 Tons/yr');

      const prefillMsg = `We are exploring decarbonization for our ${sector.toUpperCase()} portfolio (${spend} spend). Interested in seeing how Univers EnOS delivers the estimated ${savings} net annual savings and ${carbon} abatement.`;
      openDemoModal(prefillMsg);
    });
  }

  if (triggerFinal) {
    triggerFinal.addEventListener('click', (e) => {
      e.preventDefault();
      openDemoModal();
    });
  }

  const triggerChapter = document.getElementById('chapter-cta-demo');
  if (triggerChapter) {
    triggerChapter.addEventListener('click', (e) => {
      e.preventDefault();
      openDemoModal();
    });
  }

  // Generic hook: any button marked data-open-demo opens the modal — used by
  // the always-visible mobile header CTA and page-level "Talk to us" buttons,
  // so the demo booking isn't only reachable by scrolling to the page bottom.
  document.querySelectorAll('[data-open-demo]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const drawer = document.getElementById('mobile-nav-drawer');
      const backdrop = document.getElementById('nav-backdrop');
      if (drawer) drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      document.body.classList.remove('nav-open');
      openDemoModal();
    });
  });

  // Export globally for cross-system bridges
  window.openDemoModal = openDemoModal;

  // Initial render of badges and leads
  const initialLeads = getLeads();
  updateLeadsCount(initialLeads.length);
}


/* ==========================================================================
   CHAPTER/SECTION PILLS: click sound feedback only
   ========================================================================== */
function initChapterNav() {
  const nav = document.getElementById('chapter-nav');
  if (!nav) return;

  // Each page hardcodes which pill is .active (aria-current="page") since
  // the pills now link across separate pages, not to anchors on one long
  // scrolling document — no scroll-spy or offset math needed any more.
  nav.querySelectorAll('.chapter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      if (window.UniversInteractive && window.UniversInteractive.playSound) {
        window.UniversInteractive.playSound('click');
      }
    });
  });
}


/* ==========================================================================
   ENOS™ PLATFORM ARCHITECTURE & STACK EXPLORER
   Interactive 4-layer architectural deep-dive with protocol specs, verified
   deployments, and cross-section bridges to the simulator and calculator.
   ========================================================================== */
function initEnOSStackExplorer() {
  const section = document.getElementById('enos-stack');
  if (!section) return;

  const layerButtons = section.querySelectorAll('.stack-layer-btn');
  const levelLabel = document.getElementById('stack-card-level');
  const titleEl = document.getElementById('stack-card-title');
  const descEl = document.getElementById('stack-card-desc');
  const modulesEl = document.getElementById('stack-card-modules');
  const proofEl = document.getElementById('stack-card-proof');
  const protocolsEl = document.getElementById('stack-card-protocols');
  const simBtn = document.getElementById('btn-stack-to-simulator');

  const stackData = {
    '4': {
      level: 'LAYER 04 OF 04 // ENTERPRISE OUTCOME LAYER',
      title: 'Agentic Control Tower & Multi-Layer Framework',
      desc: 'Transforms predictive intelligence into coordinated, closed-loop machine execution. Dispatches optimal chiller delta-T setpoints, throttles EV charging to protect substations, and updates the enterprise carbon accounting ledger in milliseconds.',
      modules: [
        'Multi-Layer Agent Framework for autonomous operations',
        'Closed-loop dispatch & governed setpoint execution',
        'EnOS Ark™ Scope 1, 2, and 3 enterprise carbon ledger',
        'Sub-second anomaly resolution (11ms lock frequency)'
      ],
      proof: '<strong>HDB Singapore &amp; DHL Fleet:</strong> 9 vendor BMS consolidated into 1 sovereign platform across 10,000+ assets; 60,000+ EV charging assets managed with €41M net annual EBIT impact.',
      protocols: ['Open REST APIs', 'GraphQL', 'Kafka Streaming', 'Webhooks', 'Python SDK', 'SAP / ESG Connectors'],
      simStep: '3',
      simBtnText: 'See Closed-Loop Execution in Simulator (Stage 3) ↓'
    },
    '3': {
      level: 'LAYER 03 OF 04 // PHYSICS-INFORMED AI ENGINE',
      title: 'Industrial Intelligence Hub & Domain AI',
      desc: 'Combines machine learning with fundamental thermodynamic, electrical, and mechanical principles. Generates real-time digital twins that compute efficiency degradation, predict battery thermal runaway, and optimize wind farm yaw alignment.',
      modules: [
        'Physics-Informed Neural Networks (PINNs) & thermodynamic twins',
        'Multi-agent predictive maintenance & degradation forecasting',
        'Cross-domain operational ontology & semantic graph reasoning',
        'Continuous self-calibration against real-time operational feedback'
      ],
      proof: '<strong>1,070 GW Global Managed Energy Assets (~20% of global installed renewable capacity) &amp; AESC Gigafactories:</strong> 15% improvement in wind turbine energy capture; sub-second battery cell thermal deviation forecasting across 10+ gigafactories.',
      protocols: ['ONNX Runtime', 'PyTorch / TensorFlow', 'EnOS Model Registry', 'Graph Neural Nets', 'Jupyter Workspace', 'SQL/Vector Hybrid Query'],
      simStep: '2',
      simBtnText: 'See Predictive Physics AI in Simulator (Stage 2) ↓'
    },
    '2': {
      level: 'LAYER 02 OF 04 // DISTRIBUTED OPERATIONAL FABRIC',
      title: 'Integrated Data Fabric & Multi-Modal Foundation',
      desc: 'The industrial data foundation that unifies heterogeneous operational telemetry. Ingests, normalizes, and indexes petabytes of high-frequency machine data with microsecond precision and zero data loss guarantee.',
      modules: [
        'Hybrid Time-Series, Spatial GIS, Relational & Vector storage engine',
        'High-throughput stream processing pipeline (<18ms global ingestion latency)',
        'Automated data quality cleansing, outlier rejection & deduplication',
        'Granular role-based access control & SOC 2 / ISO 27001 encryption at rest'
      ],
      proof: '<strong>PSA International &amp; Major Grid Operators:</strong> Managing tens of thousands of container telemetry streams and national grid substation nodes with 99.999% platform availability.',
      protocols: ['Apache Spark', 'Apache Kafka', 'Timescale TSDB', 'PostGIS', 'Apache Parquet', 'gRPC Streaming'],
      simStep: '2',
      simBtnText: 'See Ingestion & Intelligence in Simulator (Stage 2) ↓'
    },
    '1': {
      level: 'LAYER 01 OF 04 // OT PROTOCOL & DEVICE INGESTION',
      title: 'Physical Connectivity & Intelligent Edge',
      desc: 'Enables universal hardware agnosticism. Deploys lightweight EnOS Edge Loggers and soft-adapters to bridge legacy proprietary SCADA, smart meters, sensors, chillers, inverters, and battery management systems.',
      modules: [
        'Universal OT protocol translation library (200+ native industrial protocols)',
        'EnOS Edge Logger with store-and-forward edge cache for zero telemetry loss',
        'On-premise real-time inference & local safety override governance',
        'Plug-and-play secure onboarding with zero-touch hardware provisioning'
      ],
      proof: '<strong>450 Million+ Connected Sensors &amp; Devices Globally:</strong> Unifying 200+ equipment manufacturers (Siemens, Schneider, Honeywell, ABB, Daikin, Carrier) across 800+ global enterprises and energy parks.',
      protocols: ['Modbus TCP/RTU', 'OPC-UA', 'BACnet IP/MSTP', 'MQTT / Sparkplug B', 'IEC 61850', 'DNP3 / CANbus'],
      simStep: '1',
      simBtnText: 'See Edge Protocol Ingestion in Simulator (Stage 1) ↓'
    }
  };

  function selectLayer(layerNum) {
    const data = stackData[layerNum];
    if (!data) return;

    // Update buttons
    layerButtons.forEach(btn => {
      const isCurrent = btn.dataset.layer === layerNum;
      btn.classList.toggle('active', isCurrent);
      btn.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    });

    // Animate detail card
    const detailCard = document.getElementById('stack-detail-card');
    if (detailCard) {
      detailCard.style.opacity = '0.4';
      detailCard.style.transform = 'translateY(4px)';
      setTimeout(() => {
        detailCard.style.opacity = '1';
        detailCard.style.transform = 'translateY(0)';
      }, 140);
    }

    // Update details
    if (levelLabel) levelLabel.textContent = data.level;
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;

    if (modulesEl) {
      modulesEl.innerHTML = data.modules.map(mod => `<li>${mod}</li>`).join('');
    }

    if (proofEl) {
      proofEl.innerHTML = data.proof;
    }

    if (protocolsEl) {
      protocolsEl.innerHTML = data.protocols.map(p => `<span class="proto-tag">${p}</span>`).join('');
    }

    if (simBtn) {
      simBtn.dataset.simStep = data.simStep;
      const btnSpan = simBtn.querySelector('span');
      if (btnSpan) {
        btnSpan.textContent = data.simBtnText;
      }
    }
  }

  // Layer button click handler
  layerButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const layerNum = btn.dataset.layer;
      selectLayer(layerNum);
      if (window.UniversInteractive && window.UniversInteractive.playSound) {
        window.UniversInteractive.playSound('click');
      }
    });
  });

  // Cross-page bridge button to the simulator (now a separate page): jump
  // straight to the matching step via a query param, read on load below.
  if (simBtn) {
    simBtn.addEventListener('click', () => {
      const targetStep = simBtn.dataset.simStep || '3';
      window.location.href = `simulator.html?step=${targetStep}`;
    });
  }

  // Cross-section bridge bar links inside #enos-stack and #engine
  const crossLinks = document.querySelectorAll('.stack-bridge-bar a[href^="#"], .simulator-bridge-bar a[href^="#"], .hero-cta-group a[href^="#"]');
  crossLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const targetId = href.substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        const navOffset = 120;
        const pos = targetEl.getBoundingClientRect().top + window.pageYOffset - navOffset;
        window.scrollTo({ top: Math.max(0, pos), behavior: 'smooth' });
        if (window.UniversInteractive && window.UniversInteractive.playSound) {
          window.UniversInteractive.playSound('click');
        }
      }
    });
  });

  // Default select Layer 4
  selectLayer('4');
}
