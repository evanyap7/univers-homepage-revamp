/**
 * UNIVERS — ALL CONNECTED. INTERACTIVE HOMEPAGE ENGINE
 * Powers the live operational data stream, mobile navigation, scroll
 * reveals, interactive Edge -> Cloud -> Earth simulator, sector explorer,
 * and portfolio value calculator.
 */

function boot() {
  const systems = [
    ['initLangSwitcher', initLangSwitcher],
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
   0. INTERNATIONALIZATION (i18n)
   Client-side text swap driven by data-i18n attributes. Translation JSON
   lives in i18n/<lang>.json, one shared file per language covering every
   page (nav/footer keys are reused site-wide; page keys are namespaced,
   e.g. "home.hero.headline"). Selection persists to localStorage so it
   carries across page navigation on this static multi-page site.
   ========================================================================== */
const I18N_LANGS = ['en', 'zh', 'ja', 'de', 'nl', 'fr', 'no'];
const I18N_STORAGE_KEY = 'univers-lang';
const i18nCache = {};

function resolveI18nKey(dict, key) {
  return key.split('.').reduce((obj, part) => (obj && typeof obj === 'object' ? obj[part] : undefined), dict);
}

async function loadI18nDict(lang) {
  if (i18nCache[lang]) return i18nCache[lang];
  const res = await fetch(`i18n/${lang}.json`);
  if (!res.ok) throw new Error(`i18n fetch failed for ${lang}: ${res.status}`);
  const data = await res.json();
  i18nCache[lang] = data;
  return data;
}

function applyI18nDict(dict) {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = resolveI18nKey(dict, el.getAttribute('data-i18n'));
    if (typeof value === 'string') el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const value = resolveI18nKey(dict, el.getAttribute('data-i18n-html'));
    if (typeof value === 'string') el.innerHTML = value;
  });

  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.getAttribute('data-i18n-attr').split('|').forEach((pair) => {
      const [attr, key] = pair.split(':');
      const value = resolveI18nKey(dict, key);
      if (attr && typeof value === 'string') el.setAttribute(attr, value);
    });
  });

  // Word-reveal headings wrap their text in per-word spans (see
  // prepareWordReveal). Setting textContent above just wiped those spans
  // back to plain text, so re-wrap anything that had been prepared before.
  document.querySelectorAll('.word-reveal[data-i18n]').forEach((el) => {
    el.classList.remove('words-prepared');
  });
  prepareWordReveal();
}

async function setLanguage(lang) {
  if (!I18N_LANGS.includes(lang)) lang = 'en';
  try {
    localStorage.setItem(I18N_STORAGE_KEY, lang);
  } catch (err) {
    /* private-browsing / storage-blocked: language just won't persist */
  }
  document.documentElement.lang = lang;

  const trigger = document.getElementById('lang-switcher-trigger');
  const codeEl = document.getElementById('lang-switcher-code');
  if (codeEl) codeEl.textContent = lang.toUpperCase();
  document.querySelectorAll('#lang-switcher-menu [role="option"]').forEach((li) => {
    li.setAttribute('aria-selected', li.getAttribute('data-lang') === lang ? 'true' : 'false');
  });

  try {
    const dict = await loadI18nDict(lang);
    applyI18nDict(dict);
  } catch (err) {
    console.warn('[Univers] Failed to load language:', lang, err);
  }
}

function initLangSwitcher() {
  const root = document.getElementById('lang-switcher');
  const trigger = document.getElementById('lang-switcher-trigger');
  const menu = document.getElementById('lang-switcher-menu');
  if (!root || !trigger || !menu) return;

  const closeMenu = () => {
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  };

  trigger.addEventListener('click', () => {
    const isOpen = !menu.hidden;
    if (isOpen) {
      closeMenu();
    } else {
      menu.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
    }
  });

  menu.querySelectorAll('[data-lang]').forEach((li) => {
    const btn = li.querySelector('button');
    if (!btn) return;
    btn.addEventListener('click', () => {
      setLanguage(li.getAttribute('data-lang'));
      closeMenu();
    });
  });

  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) {
      closeMenu();
      trigger.focus();
    }
  });

  let initialLang = 'en';
  try {
    const saved = localStorage.getItem(I18N_STORAGE_KEY);
    if (saved && I18N_LANGS.includes(saved)) initialLang = saved;
  } catch (err) {
    /* private-browsing / storage-blocked: default to English */
  }
  if (initialLang !== 'en') setLanguage(initialLang);
}


/* ==========================================================================
   HERO ENTRANCE
   A single staggered fade/rise on load for the above-the-fold hero
   elements — the cinematic "curtain up" moment. Skips entirely for
   prefers-reduced-motion; elements are never hidden if JS fails to load.
   ========================================================================== */
function initHeroEntrance() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Trigger fluid Kage-style masked line rise on hero elements
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero-section .mask-line, .hero-section [data-rv]').forEach((el) => {
      el.classList.add('rv-in', 'revealed');
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

/* Wraps each word of a .word-reveal heading's plain text in nested
   .word-mask/.word spans for the per-word mask-reveal animation. Re-run
   after an i18n language swap (see applyI18nDict) since translated text
   replaces the wrapped spans with a fresh text node. CJK translations
   have no inter-word spaces, so they collapse to a single "word" and
   reveal as one unit instead of staggering — a fine simplification, since
   per-word stagger typography isn't meaningful for those scripts anyway. */
function prepareWordReveal(scope) {
  (scope || document).querySelectorAll('.word-reveal:not(.words-prepared)').forEach((el) => {
    el.classList.add('words-prepared');
    const nodes = Array.from(el.childNodes);
    if (nodes.length === 1 && nodes[0].nodeType === Node.TEXT_NODE) {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words
        .map((word, i) => `<span class="word-mask"><span class="word" style="--word-delay: ${i * 35}ms">${word}</span></span>`)
        .join(' ');
    }
  });
}

/* ==========================================================================
   SCROLL REVEAL
   Lightweight IntersectionObserver fade/slide-up on section entry.
   Skips entirely for prefers-reduced-motion.
   ========================================================================== */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-rv], .word-reveal, .mask-line').forEach((el) => {
      el.classList.add('revealed', 'rv-in');
    });
    return;
  }
  if (!('IntersectionObserver' in window)) return;

  // Prepare any word-reveal typography containers with masked spans (Kage typesetting)
  prepareWordReveal();

  const targets = document.querySelectorAll(
    '.section-header, .card-glass, .compare-card, .engine-step-tab, .flywheel-card, .compliance-category, .authority-stat, .sector-content-card, .statement-text, [data-rv], .word-reveal, .mask-line, .conduit-flow-connector'
  );
  if (!targets.length) return;

  targets.forEach((el) => {
    if (!el.hasAttribute('data-rv') && !el.classList.contains('word-reveal') && !el.classList.contains('mask-line') && !el.classList.contains('conduit-flow-connector')) {
      el.classList.add('reveal-on-scroll');
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed', 'rv-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
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
      console: '>> Fusing on-the-ground data with cloud intelligence into accurate, reliable, actionable operational data...',
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
  const quoteDotsEl = document.getElementById('quote-dots');

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
      quotes: [
        {
          quoteType: 'testimonial',
          quote: '“With Univers’ end-to-end solution and expertise, ORIX Renewable Energy Management can provide total customer support – from proposals to implementation to maintenance, which in turn helps our customers optimize energy use and reduce costs.”',
          avatar: 'KY',
          name: 'Kazuhisa Yurita',
          role: 'EVP & Chief Strategy Officer, ORIX Renewable Energy Management'
        },
        {
          quoteType: 'testimonial',
          quote: '“The clarity and consistency of data across different suppliers, and the ability to drill from site-level KPIs down to rack and cell data, are vital to our day-to-day operation.”',
          avatar: 'KS',
          name: 'Ked Shayer',
          role: 'Engineering Director, Harmony Energy'
        }
      ]
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
      quotes: [
        {
          quoteType: 'caseStudy',
          quote: 'HDB deployed Univers to unify 11,000 residential blocks, 36 shopping malls, and 2,000 car parks into one sovereign cloud platform, replacing 9 proprietary BMS vendors, slashing integration time by 50%, and generating S$7.0M in verified annual savings.',
          avatar: 'HDB',
          name: 'Housing & Development Board (HDB)',
          role: 'Singapore Sovereign Smart Nation Deployment'
        },
        {
          quoteType: 'caseStudy',
          quote: 'Côte Brasserie deployed Univers’ refrigeration energy optimization across its restaurant estate, achieving over 55% energy savings and a 22% reduction in operating costs, without disrupting service.',
          avatar: 'CB',
          name: 'Côte Brasserie',
          role: 'Restaurant & Hospitality Energy Optimization'
        }
      ]
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
      quotes: [
        {
          quoteType: 'caseStudy',
          quote: 'At PSA International (70+ terminals across 45 countries) and DHL Fleet (electrifying 2,100 heavy-duty trucks across 299 sites), Univers unlocks massive operational upside while guaranteeing grid resiliency under intensive megawatt charging demands.',
          avatar: 'PSA',
          name: 'PSA International & DHL Fleet',
          role: 'Global Trade & Logistics Electrification Case Studies'
        }
      ]
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
      quotes: [
        {
          quoteType: 'caseStudy',
          quote: 'AESC deployed Univers across 10+ battery gigafactories in 6 countries. By combining physical AI with real-time operational feedback, AESC achieved a 30%+ OEE uplift in 18 months, generating over $192M in annual net EBIT impact across its manufacturing fleet.',
          avatar: 'AESC',
          name: 'AESC Gigafactories',
          role: 'Global Battery Manufacturing: Core Factory Operations'
        }
      ]
    }
  };

  function renderQuote(quotes, idx) {
    const q = quotes[idx];
    if (!q) return;
    if (quoteLabelEl) quoteLabelEl.textContent = q.quoteType === 'testimonial' ? 'Customer Testimonial' : 'Customer Story';
    if (quoteTextEl) quoteTextEl.textContent = q.quote;
    if (quoteAvatarEl) quoteAvatarEl.textContent = q.avatar;
    if (quoteNameEl) quoteNameEl.textContent = q.name;
    if (quoteRoleEl) quoteRoleEl.textContent = q.role;

    if (quoteDotsEl) {
      quoteDotsEl.innerHTML = '';
      if (quotes.length > 1) {
        quotes.forEach((_, i) => {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'quote-dot' + (i === idx ? ' active' : '');
          dot.setAttribute('role', 'tab');
          dot.setAttribute('aria-selected', i === idx ? 'true' : 'false');
          dot.setAttribute('aria-label', `Customer story ${i + 1} of ${quotes.length}`);
          dot.addEventListener('click', () => renderQuote(quotes, i));
          quoteDotsEl.appendChild(dot);
        });
      }
    }
  }

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
      renderQuote(d.quotes, 0);
    });
  });

  const activePill = document.querySelector('.sector-pill.active') || pills[0];
  if (activePill) {
    const initialData = sectorData[activePill.getAttribute('data-sector')];
    if (initialData) renderQuote(initialData.quotes, 0);
  }
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
   NUMBER TWEEN: smooth, tear-proof live-value animation
   Interpolates a displayed number toward a target over `duration`, writing
   plain textContent every frame, no DOM rebuild ever. Calling it again
   mid-flight (e.g. while a slider is being dragged) just retargets the
   already-running loop from wherever it currently is, so rapid repeated
   calls glide smoothly instead of restarting or tearing.
   ========================================================================== */
const numberTweenState = new WeakMap();

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateNumberTo(el, targetValue, formatFn, duration = 450) {
  if (!el) return;

  let state = numberTweenState.get(el);
  if (!state) {
    state = { currentValue: 0, running: false };
    numberTweenState.set(el, state);
  }

  state.fromValue = state.currentValue;
  state.targetValue = targetValue;
  state.startTime = performance.now();
  state.duration = duration;

  if (state.running) return; // already ticking; it will pick up the new target next frame
  state.running = true;

  function tick(ts) {
    const elapsed = ts - state.startTime;
    const t = Math.min(1, elapsed / state.duration);
    const eased = easeOutCubic(t);
    state.currentValue = state.fromValue + (state.targetValue - state.fromValue) * eased;
    el.textContent = formatFn(state.currentValue);

    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      state.currentValue = state.targetValue;
      el.textContent = formatFn(state.targetValue);
      state.running = false;
    }
  }
  requestAnimationFrame(tick);
}

/* ==========================================================================
   5. PORTFOLIO VALUE REALIZATION CALCULATOR
   ========================================================================== */
function initValueCalculator() {
  const sectorSelect = document.getElementById('calc-sector');
  const sectorPills = document.querySelectorAll('.calc-sector-pill');
  const scaleSlider = document.getElementById('calc-scale-slider');
  const spendSlider = document.getElementById('calc-spend-slider');
  const presetChips = document.querySelectorAll('.calc-preset-chip');
  const spendChips = document.querySelectorAll('.calc-spend-chip');
  const scenarioBtns = document.querySelectorAll('.calc-scenario-btn');

  const scaleDisplay = document.getElementById('calc-scale-display');
  const spendDisplay = document.getElementById('calc-spend-display');
  const scaleMinLabel = document.getElementById('scale-min-label');
  const scaleMidLabel = document.getElementById('scale-mid-label');
  const scaleMaxLabel = document.getElementById('scale-max-label');

  const resSavings = document.getElementById('res-savings');
  const resSubtext = document.getElementById('res-subtext');
  const resPayback = document.getElementById('res-payback');
  const resCarbon = document.getElementById('res-carbon');
  const resCarbonEquiv = document.getElementById('res-carbon-equiv');
  const resDowntime = document.getElementById('res-downtime');
  const resYieldBadge = document.getElementById('res-yield-badge');

  // Breakdown elements
  const barSegEnergy = document.getElementById('bar-seg-energy');
  const barSegMaint = document.getElementById('bar-seg-maint');
  const barSegCarbon = document.getElementById('bar-seg-carbon');
  const resEnergySavings = document.getElementById('res-energy-savings');
  const resEnergyPct = document.getElementById('res-energy-pct');
  const resMaintSavings = document.getElementById('res-maint-savings');
  const resMaintPct = document.getElementById('res-maint-pct');
  const resCarbonSavings = document.getElementById('res-carbon-savings');
  const resCarbonPct = document.getElementById('res-carbon-pct');

  // 5-Year Chart elements
  const chart5yrTotal = document.getElementById('chart-5yr-total');
  const chartBreakevenText = document.getElementById('chart-breakeven-text');
  const breakevenLine = document.getElementById('breakeven-line');
  const breakevenBadgeBg = document.getElementById('breakeven-badge-bg');

  // Action buttons
  const btnShare = document.getElementById('btn-share-calc');
  const btnReset = document.getElementById('btn-reset-calc');
  const btnExport = document.getElementById('btn-export-calc');
  const calcToast = document.getElementById('calc-toast');

  let currentScenario = 'standard';

  // Sector metadata dictionary
  const SECTOR_DATA = {
    energy: {
      name: 'Renewable Energy & Utilities',
      savingsRate: 0.14,
      paybackMonths: 8,
      carbonMult: 650,
      downtimeMult: 4.8,
      energyPct: 0.58,
      maintPct: 0.28,
      carbonPct: 0.14,
      getScaleText: (v) => `${(v * 0.25).toFixed(2)} GW Capacity`,
      minLabel: '0.25 GW',
      midLabel: '1.25 GW',
      maxLabel: '2.50 GW'
    },
    buildings: {
      name: 'Commercial Built Environment',
      savingsRate: 0.098,
      paybackMonths: 10,
      carbonMult: 420,
      downtimeMult: 3.2,
      energyPct: 0.55,
      maintPct: 0.30,
      carbonPct: 0.15,
      getScaleText: (v) => `${(v * 1000000).toLocaleString('en-US')} sq ft`,
      minLabel: '1M sq ft',
      midLabel: '5M sq ft',
      maxLabel: '10M sq ft'
    },
    logistics: {
      name: 'Transportation & Ports',
      savingsRate: 0.105,
      paybackMonths: 11,
      carbonMult: 380,
      downtimeMult: 5.5,
      energyPct: 0.50,
      maintPct: 0.35,
      carbonPct: 0.15,
      getScaleText: (v) => `${(v * 1.5).toFixed(1)}M TEUs / Terminals`,
      minLabel: '1.5M TEUs',
      midLabel: '7.5M TEUs',
      maxLabel: '15.0M TEUs'
    },
    manufacturing: {
      name: 'Industrial Manufacturing',
      savingsRate: 0.155,
      paybackMonths: 9,
      carbonMult: 510,
      downtimeMult: 6.2,
      energyPct: 0.52,
      maintPct: 0.36,
      carbonPct: 0.12,
      getScaleText: (v) => `${v * 2} Industrial Plants`,
      minLabel: '2 Plants',
      midLabel: '10 Plants',
      maxLabel: '20 Plants'
    }
  };

  // Helper to activate sector pill
  function setSector(sectorKey, skipPresetReset = false) {
    if (!SECTOR_DATA[sectorKey]) sectorKey = 'buildings';
    if (sectorSelect) sectorSelect.value = sectorKey;
    sectorPills.forEach(p => {
      const match = p.getAttribute('data-sector') === sectorKey;
      p.classList.toggle('active', match);
      p.setAttribute('aria-selected', String(match));
    });
    if (!skipPresetReset) {
      presetChips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
      });
    }
    updateCalculator();
  }

  sectorPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const sec = pill.getAttribute('data-sector');
      setSector(sec);
      if (window.UniversInteractive && window.UniversInteractive.playSound) {
        window.UniversInteractive.playSound('click');
      }
    });
  });

  // Enterprise Presets
  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const presetSec = chip.getAttribute('data-preset');
      const presetScale = parseInt(chip.getAttribute('data-scale'), 10);
      const presetSpend = parseInt(chip.getAttribute('data-spend'), 10);

      presetChips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-pressed', 'true');

      if (scaleSlider && !isNaN(presetScale)) scaleSlider.value = presetScale;
      if (spendSlider && !isNaN(presetSpend)) spendSlider.value = presetSpend;

      setSector(presetSec, true);

      if (window.UniversInteractive && window.UniversInteractive.playSound) {
        window.UniversInteractive.playSound('click');
      }
    });
  });

  // Quick spend chips
  spendChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const spendVal = parseInt(chip.getAttribute('data-spend'), 10);
      if (spendSlider && !isNaN(spendVal)) {
        spendSlider.value = spendVal;
        spendChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        updateCalculator();
      }
    });
  });

  // Scenario toggle
  scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      scenarioBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      currentScenario = btn.getAttribute('data-scenario') || 'standard';
      updateCalculator();
      if (window.UniversInteractive && window.UniversInteractive.playSound) {
        window.UniversInteractive.playSound('click');
      }
    });
  });

  function updateCalculator() {
    if (!scaleSlider || !spendSlider || !sectorSelect) return;

    const sectorKey = sectorSelect.value || 'buildings';
    const data = SECTOR_DATA[sectorKey] || SECTOR_DATA.buildings;
    const scaleVal = parseInt(scaleSlider.value, 10);
    const spendVal = parseInt(spendSlider.value, 10); // Millions USD

    // Update scale labels
    if (scaleDisplay) scaleDisplay.textContent = data.getScaleText(scaleVal);
    if (scaleMinLabel) scaleMinLabel.textContent = data.minLabel;
    if (scaleMidLabel) scaleMidLabel.textContent = data.midLabel;
    if (scaleMaxLabel) scaleMaxLabel.textContent = data.maxLabel;

    // Update spend label
    if (spendDisplay) spendDisplay.textContent = `$${spendVal.toLocaleString('en-US')},000,000 / yr`;

    // Sync spend chips active state
    spendChips.forEach(chip => {
      const chipVal = parseInt(chip.getAttribute('data-spend'), 10);
      chip.classList.toggle('active', chipVal === spendVal);
    });

    // Multipliers & Scenario
    let scenarioMultiplier = currentScenario === 'advanced' ? 1.25 : 1.0;
    let baseRate = data.savingsRate;
    let effectiveRate = baseRate * scenarioMultiplier;
    let paybackMonths = currentScenario === 'advanced' ? Math.max(5, data.paybackMonths - 2) : data.paybackMonths;

    const netSavings = Math.round(spendVal * 1000000 * effectiveRate);
    const carbonTons = Math.round(spendVal * data.carbonMult * scenarioMultiplier);
    const carbonEquiv = Math.round(carbonTons / 4.6);
    const downtimeHours = (spendVal * data.downtimeMult * scenarioMultiplier).toFixed(1);

    // Yield Badge
    if (resYieldBadge) {
      const pctStr = (effectiveRate * 100).toFixed(1);
      resYieldBadge.textContent = `${pctStr}% Portfolio Yield${currentScenario === 'advanced' ? ' (Physical AI)' : ''}`;
    }

    // Hero Savings
    if (resSavings) {
      animateNumberTo(resSavings, netSavings, (v) => `$${Math.round(v).toLocaleString('en-US')}`);
      resSavings.dataset.tallyTarget = `$${netSavings.toLocaleString('en-US')}`;
    }

    // Subtext
    if (resSubtext) {
      resSubtext.textContent = `Illustrative estimate, modeled at a ${(effectiveRate * 100).toFixed(1)}% optimization rate from Univers' published sector benchmarks`;
    }

    // Core KPIs
    if (resPayback) {
      animateNumberTo(resPayback, paybackMonths, (v) => `< ${Math.round(v)} Months`);
    }
    if (resCarbon) {
      animateNumberTo(resCarbon, carbonTons, (v) => `${Math.round(v).toLocaleString('en-US')} Tons/yr`);
      resCarbon.dataset.tallyTarget = `${carbonTons.toLocaleString('en-US')} Tons/yr`;
    }
    if (resCarbonEquiv) {
      resCarbonEquiv.textContent = `≈ ${carbonEquiv.toLocaleString('en-US')} passenger vehicles / yr`;
    }
    if (resDowntime) {
      resDowntime.textContent = `≈ ${downtimeHours} Hours/yr`;
    }

    // Granular Breakdown
    const energySavings = Math.round(netSavings * data.energyPct);
    const maintSavings = Math.round(netSavings * data.maintPct);
    const carbonSavings = Math.round(netSavings * data.carbonPct);

    if (resEnergySavings) resEnergySavings.textContent = `$${energySavings.toLocaleString('en-US')}`;
    if (resEnergyPct) resEnergyPct.textContent = `${Math.round(data.energyPct * 100)}%`;
    if (resMaintSavings) resMaintSavings.textContent = `$${maintSavings.toLocaleString('en-US')}`;
    if (resMaintPct) resMaintPct.textContent = `${Math.round(data.maintPct * 100)}%`;
    if (resCarbonSavings) resCarbonSavings.textContent = `$${carbonSavings.toLocaleString('en-US')}`;
    if (resCarbonPct) resCarbonPct.textContent = `${Math.round(data.carbonPct * 100)}%`;

    if (barSegEnergy) barSegEnergy.style.width = `${Math.round(data.energyPct * 100)}%`;
    if (barSegMaint) barSegMaint.style.width = `${Math.round(data.maintPct * 100)}%`;
    if (barSegCarbon) barSegCarbon.style.width = `${Math.round(data.carbonPct * 100)}%`;

    // 5-Year Cumulative ROI Projections
    const deploymentCost = Math.round(netSavings * (paybackMonths / 12));
    const y1 = Math.max(0, Math.round(netSavings - deploymentCost));
    const y2 = Math.round(y1 + netSavings * 1.05);
    const y3 = Math.round(y2 + netSavings * 1.10);
    const y4 = Math.round(y3 + netSavings * 1.15);
    const y5 = Math.round(y4 + netSavings * 1.20);

    if (chart5yrTotal) {
      chart5yrTotal.textContent = `+$${y5.toLocaleString('en-US')}`;
    }

    if (chartBreakevenText) {
      chartBreakevenText.textContent = `★ Breakeven M${paybackMonths}`;
    }

    // Update SVG Bars and labels
    const years = [y1, y2, y3, y4, y5];
    const maxVal = Math.max(y5, 1);
    const chartBaseY = 130;
    const maxBarH = 105;

    years.forEach((val, idx) => {
      const yearNum = idx + 1;
      const barEl = document.getElementById(`bar-y${yearNum}`);
      const txtEl = document.getElementById(`bar-txt-y${yearNum}`);
      if (barEl) {
        const barH = Math.max(14, Math.round((val / maxVal) * maxBarH));
        const barY = chartBaseY - barH;
        barEl.setAttribute('y', String(barY));
        barEl.setAttribute('height', String(barH));
      }
      if (txtEl) {
        const barH = Math.max(14, Math.round((val / maxVal) * maxBarH));
        const txtY = chartBaseY - barH - 7;
        txtEl.setAttribute('y', String(txtY));
        txtEl.textContent = `$${(val / 1000000).toFixed(2)}M`;
      }
    });

    // Position Breakeven Marker Line cleanly in the gap between Year 1 and Year 2
    if (breakevenLine && breakevenBadgeBg) {
      const bx = Math.round(112 + Math.min(26, Math.max(0, ((paybackMonths - 5) / 7) * 26)));
      breakevenLine.setAttribute('x1', String(bx));
      breakevenLine.setAttribute('x2', String(bx));
      if (chartBreakevenText) chartBreakevenText.setAttribute('x', String(bx));
      breakevenBadgeBg.setAttribute('x', String(bx - 45));
    }
  }

  // Event Listeners for inputs
  if (scaleSlider) scaleSlider.addEventListener('input', updateCalculator);
  if (spendSlider) spendSlider.addEventListener('input', updateCalculator);

  // Share Configuration button
  if (btnShare) {
    btnShare.addEventListener('click', () => {
      const sector = sectorSelect ? sectorSelect.value : 'buildings';
      const scale = scaleSlider ? scaleSlider.value : '5';
      const spend = spendSlider ? spendSlider.value : '12';
      const scenario = currentScenario;

      const url = new URL(window.location.href);
      url.searchParams.set('sector', sector);
      url.searchParams.set('scale', scale);
      url.searchParams.set('spend', spend);
      url.searchParams.set('scenario', scenario);
      url.hash = 'calculator';

      navigator.clipboard.writeText(url.toString()).then(() => {
        if (calcToast) {
          calcToast.hidden = false;
          clearTimeout(calcToast._timer);
          calcToast._timer = setTimeout(() => {
            calcToast.hidden = true;
          }, 3500);
        }
      }).catch(() => {
        prompt('Copy this shareable link:', url.toString());
      });

      if (window.UniversInteractive && window.UniversInteractive.playSound) {
        window.UniversInteractive.playSound('ping');
      }
    });
  }

  // Reset defaults button
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (scaleSlider) scaleSlider.value = 5;
      if (spendSlider) spendSlider.value = 12;
      currentScenario = 'standard';
      scenarioBtns.forEach(b => {
        const isStd = b.getAttribute('data-scenario') === 'standard';
        b.classList.toggle('active', isStd);
        b.setAttribute('aria-checked', String(isStd));
      });
      setSector('buildings');
      if (window.UniversInteractive && window.UniversInteractive.playSound) {
        window.UniversInteractive.playSound('click');
      }
    });
  }

  // Export Executive PDF / Print
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      window.print();
    });
  }

  // URL Query / Hash Params Restoration on Load
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
    const pSector = urlParams.get('sector') || hashParams.get('sector');
    const pScale = urlParams.get('scale') || hashParams.get('scale');
    const pSpend = urlParams.get('spend') || hashParams.get('spend');
    const pScenario = urlParams.get('scenario') || hashParams.get('scenario');

    if (pScale && scaleSlider && !isNaN(parseInt(pScale, 10))) {
      scaleSlider.value = parseInt(pScale, 10);
    }
    if (pSpend && spendSlider && !isNaN(parseInt(pSpend, 10))) {
      spendSlider.value = parseInt(pSpend, 10);
    }
    if (pScenario) {
      currentScenario = pScenario === 'advanced' ? 'advanced' : 'standard';
      scenarioBtns.forEach(b => {
        const match = b.getAttribute('data-scenario') === currentScenario;
        b.classList.toggle('active', match);
        b.setAttribute('aria-checked', String(match));
      });
    }
    if (pSector && SECTOR_DATA[pSector]) {
      setSector(pSector);
    } else {
      updateCalculator();
    }
  } catch (err) {
    updateCalculator();
  }
}

/* ==========================================================================
   INTERACTIVE ENGINE: KINETIC BACKGROUND (WebGL / Three.js) & PHYSICS SIM
   Operational data mesh, floating OT telemetry nodes, mouse force-field,
   and drag-activated electric tethering. All physics below is unchanged
   from the original 2D canvas version; only the renderer is WebGL, for
   real per-node depth, glow, and camera parallax. Three.js loads lazily
   via a dynamic import from a CDN (no bundler, no node_modules) and the
   whole scene degrades to "no background" if that import fails, rather
   than throwing.
   ========================================================================== */
function initKineticCanvas() {
  const canvas = document.getElementById('kinetic-canvas');
  if (!canvas) return;

  window.UniversInteractive = window.UniversInteractive || {};
  window.UniversInteractive.bgMode = 'mesh'; // 'mesh' | 'matrix' | 'particles'
  window.UniversInteractive.cursorMode = 'plasma'; // 'plasma' | 'sparks'
  window.UniversInteractive.isSurging = false;
  window.UniversInteractive.soundEnabled = false;

  import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js')
    .then((THREE) => bootScene(THREE))
    .catch((err) => {
      console.warn('[Univers] Three.js failed to load; kinetic background disabled:', err);
    });

  function bootScene(THREE) {
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch (err) {
      console.warn('[Univers] WebGL unavailable; kinetic background disabled:', err);
      return;
    }

    const scene = new THREE.Scene();
    const FOV = 45;
    const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 4000);
    const cameraBase = new THREE.Vector3(0, 0, 800);

    let width = 0;
    let height = 0;
    let dpr = 1;

    // Real per-vertex size/color/alpha for soft circular sprites. Plain
    // THREE.PointsMaterial can't vary size or alpha per point, so a small
    // custom shader carries all three, with true alpha blending (not a
    // fake blend-toward-background hack).
    const pointVert = `
      attribute float aSize;
      attribute vec3 aColor;
      attribute float aAlpha;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = aColor;
        vAlpha = aAlpha;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * (420.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
    const pointFrag = `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float edge = smoothstep(0.5, 0.08, d);
        if (edge < 0.01) discard;
        gl_FragColor = vec4(vColor, edge * vAlpha);
      }
    `;
    const lineVert = `
      attribute vec3 aColor;
      attribute float aAlpha;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = aColor;
        vAlpha = aAlpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const lineFrag = `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        gl_FragColor = vec4(vColor, vAlpha);
      }
    `;

    function makePointMaterial() {
      return new THREE.ShaderMaterial({
        vertexShader: pointVert,
        fragmentShader: pointFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending
      });
    }
    function makeLineMaterial() {
      return new THREE.ShaderMaterial({
        vertexShader: lineVert,
        fragmentShader: lineFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending
      });
    }

    // ---- Ambient node field (the "mesh" of physical/OT nodes) ----
    const MAX_PARTICLES = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(MAX_PARTICLES * 3);
    const particleColor = new Float32Array(MAX_PARTICLES * 3);
    const particleAlpha = new Float32Array(MAX_PARTICLES);
    const particleSize = new Float32Array(MAX_PARTICLES);
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('aColor', new THREE.BufferAttribute(particleColor, 3));
    particleGeo.setAttribute('aAlpha', new THREE.BufferAttribute(particleAlpha, 1));
    particleGeo.setAttribute('aSize', new THREE.BufferAttribute(particleSize, 1));
    const particlePoints = new THREE.Points(particleGeo, makePointMaterial());
    scene.add(particlePoints);

    // ---- Mesh/matrix connection lines (rebuilt every frame, drawRange trims it) ----
    const MAX_LINE_VERTS = MAX_PARTICLES * MAX_PARTICLES * 4;
    const lineGeo = new THREE.BufferGeometry();
    const linePos = new Float32Array(MAX_LINE_VERTS * 3);
    const lineColor = new Float32Array(MAX_LINE_VERTS * 3);
    const lineAlphaAttr = new Float32Array(MAX_LINE_VERTS);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    lineGeo.setAttribute('aColor', new THREE.BufferAttribute(lineColor, 3));
    lineGeo.setAttribute('aAlpha', new THREE.BufferAttribute(lineAlphaAttr, 1));
    lineGeo.setDrawRange(0, 0);
    const meshLines = new THREE.LineSegments(lineGeo, makeLineMaterial());
    scene.add(meshLines);

    // ---- Harmonic energy ribbons (3 flowing sine waves) ----
    const RIBBON_COUNT = 3;
    const RIBBON_SEGMENTS = 90;
    const ribbonGeo = new THREE.BufferGeometry();
    const ribbonPos = new Float32Array(RIBBON_COUNT * RIBBON_SEGMENTS * 2 * 3);
    const ribbonColor = new Float32Array(RIBBON_COUNT * RIBBON_SEGMENTS * 2 * 3);
    const ribbonAlphaAttr = new Float32Array(RIBBON_COUNT * RIBBON_SEGMENTS * 2);
    ribbonGeo.setAttribute('position', new THREE.BufferAttribute(ribbonPos, 3));
    ribbonGeo.setAttribute('aColor', new THREE.BufferAttribute(ribbonColor, 3));
    ribbonGeo.setAttribute('aAlpha', new THREE.BufferAttribute(ribbonAlphaAttr, 1));
    const ribbonLines = new THREE.LineSegments(ribbonGeo, makeLineMaterial());
    scene.add(ribbonLines);

    // ---- Cursor tether arcs (drawn while dragging) ----
    const MAX_TETHERS = 4;
    const TETHER_SEGMENTS = 14;
    const tetherGeo = new THREE.BufferGeometry();
    const tetherPos = new Float32Array(MAX_TETHERS * TETHER_SEGMENTS * 2 * 3);
    const tetherColor = new Float32Array(MAX_TETHERS * TETHER_SEGMENTS * 2 * 3);
    const tetherAlphaAttr = new Float32Array(MAX_TETHERS * TETHER_SEGMENTS * 2);
    tetherGeo.setAttribute('position', new THREE.BufferAttribute(tetherPos, 3));
    tetherGeo.setAttribute('aColor', new THREE.BufferAttribute(tetherColor, 3));
    tetherGeo.setAttribute('aAlpha', new THREE.BufferAttribute(tetherAlphaAttr, 1));
    tetherGeo.setDrawRange(0, 0);
    const tetherLines = new THREE.LineSegments(tetherGeo, makeLineMaterial());
    scene.add(tetherLines);

    // ---- Drag trail ribbon ----
    const MAX_TRAIL = 26;
    const trailGeo = new THREE.BufferGeometry();
    const trailPos = new Float32Array(MAX_TRAIL * 3);
    const trailColor = new Float32Array(MAX_TRAIL * 3);
    const trailAlphaAttr = new Float32Array(MAX_TRAIL);
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
    trailGeo.setAttribute('aColor', new THREE.BufferAttribute(trailColor, 3));
    trailGeo.setAttribute('aAlpha', new THREE.BufferAttribute(trailAlphaAttr, 1));
    trailGeo.setDrawRange(0, 0);
    const trailLine = new THREE.Line(trailGeo, makeLineMaterial());
    scene.add(trailLine);

    // ---- Drag sparks (their own point cloud, independent of ambient nodes) ----
    const MAX_SPARKS = 140;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(MAX_SPARKS * 3);
    const sparkColor = new Float32Array(MAX_SPARKS * 3);
    const sparkAlpha = new Float32Array(MAX_SPARKS);
    const sparkSize = new Float32Array(MAX_SPARKS);
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    sparkGeo.setAttribute('aColor', new THREE.BufferAttribute(sparkColor, 3));
    sparkGeo.setAttribute('aAlpha', new THREE.BufferAttribute(sparkAlpha, 1));
    sparkGeo.setAttribute('aSize', new THREE.BufferAttribute(sparkSize, 1));
    const sparkPoints = new THREE.Points(sparkGeo, makePointMaterial());
    scene.add(sparkPoints);

    // ---- Radar pings: short-lived ring outlines, pooled ----
    const radarPool = [];
    function acquireRadarMesh() {
      const geo = new THREE.RingGeometry(0.97, 1, 64);
      const mat = new THREE.MeshBasicMaterial({ color: 0x7A42EA, transparent: true, opacity: 0, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
      return mesh;
    }

    function hexToRgb(hex) {
      const c = new THREE.Color(hex);
      return [c.r, c.g, c.b];
    }
    const PALETTE = ['#7A42EA', '#00E599', '#00D2FF', '#A984F1', '#14142B'].map(hexToRgb);
    const SPARK_PALETTE = ['#7A42EA', '#00E599', '#00D2FF', '#FFFFFF', '#A984F1'].map(hexToRgb);
    const SURGE_COLOR = hexToRgb('#7A42EA');
    const BRIDGE_COLOR = hexToRgb('#00E599');

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
    let normMouseX = 0; // -1..1, for camera parallax
    let normMouseY = 0;

    let currentScrollProgress = 0;
    let targetScrollProgress = 0;
    let lastScrollY = window.scrollY || 0;
    let scrollVelocity = 0;
    let smoothScrollVelocity = 0;

    function updateScrollProgress() {
      const currentY = window.scrollY || 0;
      const deltaY = currentY - lastScrollY;
      scrollVelocity = deltaY;
      lastScrollY = currentY;

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        targetScrollProgress = Math.max(0, Math.min(1, currentY / totalHeight));
      }
    }
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    // Lab-page-only ambient telemetry glyphs render as a DOM overlay (a font
    // renderer in WebGL is a lot of machinery for a handful of faint labels
    // that only ever appear on one page).
    const isLabPage = !!document.getElementById('cyber-hud-panel');
    let glyphLayer = null;
    if (isLabPage) {
      glyphLayer = document.createElement('div');
      glyphLayer.id = 'kinetic-glyph-layer';
      glyphLayer.setAttribute('aria-hidden', 'true');
      Object.assign(glyphLayer.style, {
        position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '1', overflow: 'hidden'
      });
      document.body.appendChild(glyphLayer);
    }

    function fitCamera() {
      camera.aspect = width / height;
      camera.fov = FOV;
      cameraBase.z = (height / 2) / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
      camera.updateProjectionMatrix();
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, true);
      fitCamera();
      initParticles();
    }

    // Same sparse pool sizing/coloring as before, plus a static depth (z)
    // per particle. That is the one new field the WebGL port adds; every
    // other property and every physics rule below is unchanged.
    function initParticles() {
      particles.length = 0;
      const count = Math.min(Math.floor(Math.min(width, 1600) / 42), MAX_PARTICLES);

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: (Math.random() - 0.5) * 260,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: 1.5 + Math.random() * 2.2,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          baseAlpha: 0.12 + Math.random() * 0.22,
          alpha: 0.15,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          pulseOffset: Math.random() * Math.PI * 2,
          highlightTime: 0,
          clusterId: i % 3
        });
      }
      particleGeo.setDrawRange(0, count);

      if (isLabPage) {
        floatingGlyphs.length = 0;
        if (glyphLayer) glyphLayer.innerHTML = '';
        const glyphLabels = [
          'OT-NODE // 400kV', 'IEC 61850 STREAM', 'EnOS™ CLOUD SYNC', '1,070 GW MANAGED',
          'SUBSTATION ALPHA', 'BERTH-04 AGV', 'ALL CONNECTED', 'BESS 2.4 MWh'
        ];
        const glyphCount = Math.max(1, Math.floor(width / 700));
        for (let g = 0; g < glyphCount; g++) {
          const el = document.createElement('div');
          el.className = 'kinetic-glyph';
          el.textContent = glyphLabels[g % glyphLabels.length];
          if (glyphLayer) glyphLayer.appendChild(el);
          floatingGlyphs.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.2,
            vy: -0.15 - Math.random() * 0.25,
            alpha: 0.16 + Math.random() * 0.14,
            size: 14 + Math.random() * 12,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.004,
            el
          });
        }
      }
    }

    window.addEventListener('mousemove', (e) => {
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      normMouseX = (e.clientX / width) * 2 - 1;
      normMouseY = (e.clientY / height) * 2 - 1;

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

    window.addEventListener('click', (e) => {
      if (e.target.closest('button, a, input, select, textarea, .cyber-hud')) return;
      triggerRadarPing(e.clientX, e.clientY);
    });

    function triggerRadarPing(x, y) {
      const mesh = acquireRadarMesh();
      radarRings.push({
        x, y, mesh,
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

    function addDragSparks(x, y, speed) {
      const sparkCount = Math.min(Math.floor(speed * 0.4) + 1, 5);

      dragTrail.push({ x, y, life: 1.0, decay: 0.04 });
      if (dragTrail.length > MAX_TRAIL) dragTrail.shift();

      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 1.5 + Math.random() * 4.5;
        dragSparks.push({
          x, y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          size: 2 + Math.random() * 3.5,
          color: SPARK_PALETTE[Math.floor(Math.random() * SPARK_PALETTE.length)],
          life: 1.0,
          decay: 0.035 + Math.random() * 0.04
        });
      }
      if (dragSparks.length > MAX_SPARKS) dragSparks.splice(0, dragSparks.length - MAX_SPARKS);

      if (window.UniversInteractive.soundEnabled && window.UniversInteractive.playSound) {
        window.UniversInteractive.playSound('drag');
      }
    }

    function toWorldX(x) { return x - width / 2; }
    function toWorldY(y) { return -(y - height / 2); }

    function writePoint(posArr, colorArr, alphaArr, sizeArr, idx, x, y, z, color, alpha, size) {
      posArr[idx * 3] = toWorldX(x);
      posArr[idx * 3 + 1] = toWorldY(y);
      posArr[idx * 3 + 2] = z;
      colorArr[idx * 3] = color[0];
      colorArr[idx * 3 + 1] = color[1];
      colorArr[idx * 3 + 2] = color[2];
      alphaArr[idx] = alpha;
      sizeArr[idx] = size;
    }

    function writeLineVert(posArr, colorArr, alphaArr, idx, x, y, z, color, alpha) {
      posArr[idx * 3] = toWorldX(x);
      posArr[idx * 3 + 1] = toWorldY(y);
      posArr[idx * 3 + 2] = z;
      colorArr[idx * 3] = color[0];
      colorArr[idx * 3 + 1] = color[1];
      colorArr[idx * 3 + 2] = color[2];
      alphaArr[idx] = alpha;
    }

    let lastTime = performance.now();

    function animate(now) {
      requestAnimationFrame(animate);
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const isSurging = window.UniversInteractive.isSurging;
      const mode = window.UniversInteractive.bgMode;
      const baseSpeed = isSurging ? 2.8 : 1.0;

      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.08;
      smoothScrollVelocity += (scrollVelocity - smoothScrollVelocity) * 0.12;
      scrollVelocity *= 0.88;
      const velocityFactor = Math.min(Math.abs(smoothScrollVelocity) * 0.025, 2.0);
      const speedMult = baseSpeed + velocityFactor;

      // Subtle camera parallax against the cursor: the actual "real depth"
      // payoff. Nodes at different z now visibly shift against each other
      // as the camera pans, instead of a flat, static mesh.
      camera.position.x += ((normMouseX || 0) * 40 - camera.position.x) * 0.04;
      camera.position.y += ((-normMouseY || 0) * 24 - camera.position.y) * 0.04;
      camera.position.z = cameraBase.z;
      camera.lookAt(camera.position.x * 0.3, camera.position.y * 0.3, 0);

      // ---- Harmonic energy ribbons ----
      const ribbonTime = now * 0.0005;
      let ribbonVertIdx = 0;
      for (let r = 0; r < RIBBON_COUNT; r++) {
        const yOffset = height * (0.24 + r * 0.26);
        const waveFreq = 0.0011 + r * 0.0005;
        const waveAmp = (24 + r * 14) * (1 + velocityFactor * 0.6);
        const speedPhase = ribbonTime * (1.1 + r * 0.65);
        const ribbonAlpha = (0.04 - r * 0.008) * (isSurging ? 2.0 : 1);
        const color = r === 1 ? BRIDGE_COLOR : SURGE_COLOR;
        const alphaMult = r === 1 ? 1.25 : 1;

        let prevX = null;
        let prevY = null;
        const step = width / RIBBON_SEGMENTS;
        for (let s = 0; s <= RIBBON_SEGMENTS; s++) {
          const x = s * step;
          const y = yOffset +
            Math.sin(x * waveFreq + speedPhase) * waveAmp +
            Math.cos(x * waveFreq * 1.7 - speedPhase * 0.5) * (waveAmp * 0.35);

          if (prevX !== null && ribbonVertIdx + 1 < RIBBON_COUNT * RIBBON_SEGMENTS * 2) {
            writeLineVert(ribbonPos, ribbonColor, ribbonAlphaAttr, ribbonVertIdx++, prevX, prevY, -40, color, ribbonAlpha * alphaMult);
            writeLineVert(ribbonPos, ribbonColor, ribbonAlphaAttr, ribbonVertIdx++, x, y, -40, color, ribbonAlpha * alphaMult);
          }
          prevX = x;
          prevY = y;
        }
      }
      ribbonGeo.setDrawRange(0, ribbonVertIdx);
      ribbonGeo.attributes.position.needsUpdate = true;
      ribbonGeo.attributes.aColor.needsUpdate = true;
      ribbonGeo.attributes.aAlpha.needsUpdate = true;

      // ---- Floating glyphs (lab page only), DOM-positioned ----
      if (isLabPage) {
        for (let g = 0; g < floatingGlyphs.length; g++) {
          const gl = floatingGlyphs[g];
          gl.y += gl.vy * speedMult;
          gl.x += gl.vx * speedMult;
          gl.rot += gl.rotSpeed;
          if (gl.y < -40) gl.y = height + 40;
          if (gl.x < -40) gl.x = width + 40;
          if (gl.x > width + 40) gl.x = -40;

          const alpha = isSurging ? 0.5 : gl.alpha;
          const color = isSurging ? '#7A42EA' : '#52525F';
          gl.el.style.cssText =
            `position:absolute;left:0;top:0;font:9px "JetBrains Mono",monospace;` +
            `color:${color};opacity:${alpha};white-space:nowrap;` +
            `transform:translate3d(${gl.x}px,${gl.y}px,0) rotate(${gl.rot}rad);`;
        }
      }

      // ---- Ambient particle physics (unchanged from the 2D version) ----
      const isStage2 = currentScrollProgress >= 0.16 && currentScrollProgress < 0.36;
      const isStage3 = currentScrollProgress >= 0.36 && currentScrollProgress < 0.56;
      const isStage5 = currentScrollProgress >= 0.78;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (isStage2) {
          const clusterCenters = [
            { x: width * 0.22, y: height * 0.35 },
            { x: width * 0.78, y: height * 0.35 },
            { x: width * 0.50, y: height * 0.70 }
          ];
          const target = clusterCenters[p.clusterId];
          p.vx += (target.x - p.x) * 0.0006;
          p.vy += (target.y - p.y) * 0.0006;
        } else if (isStage3) {
          p.vx += (width * 0.5 - p.x) * 0.00025;
          p.vy += (height * 0.5 - p.y) * 0.00025;
        }

        p.x += p.vx * speedMult;
        p.y += p.vy * speedMult;

        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > height) { p.y = height; p.vy *= -1; }

        if (mouseX > 0 && mouseY > 0) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.hypot(dx, dy);
          if (dist < 160) {
            const force = (1 - dist / 160) * (isDragging ? 3.2 : 1.5);
            p.vx += (dx / dist) * force * 0.75;
            p.vy += (dy / dist) * force * 0.75;
            p.vx += (-dy / dist) * force * 0.35;
            p.vy += (dx / dist) * force * 0.35;
            p.highlightTime = 0.45;
          }
        }

        p.vx *= 0.98;
        p.vy *= 0.98;

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

        const color = isSurging ? SURGE_COLOR : p.color;
        const renderRadius = p.radius * (isSurging ? 1.5 : 1);
        writePoint(particlePos, particleColor, particleAlpha, particleSize, i, p.x, p.y, p.z, color, p.alpha, renderRadius * 3.2);
      }
      particleGeo.attributes.position.needsUpdate = true;
      particleGeo.attributes.aColor.needsUpdate = true;
      particleGeo.attributes.aAlpha.needsUpdate = true;
      particleGeo.attributes.aSize.needsUpdate = true;

      // ---- Connecting mesh/matrix lines ----
      let lineVertIdx = 0;
      if (mode === 'mesh' || mode === 'matrix') {
        let maxDist = 115;
        if (isStage2) maxDist = 85;
        else if (isStage3) maxDist = 135;
        else if (isStage5) maxDist = 80;

        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            if (isStage2 && p1.clusterId !== p2.clusterId) continue;

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.hypot(dx, dy);
            if (dist >= maxDist) continue;

            let alpha = (1 - dist / maxDist) * 0.18 * (isSurging ? 2.5 : 1);
            if (isStage5) alpha *= 0.25;

            const isBridge = isStage3 && p1.clusterId !== p2.clusterId;
            const color = isBridge ? BRIDGE_COLOR : SURGE_COLOR;
            const finalAlpha = isBridge ? alpha * 1.5 : (isSurging ? alpha : alpha * 0.75);

            if (lineVertIdx + 4 > MAX_LINE_VERTS) continue;

            if (mode === 'matrix') {
              const midZ = (p1.z + p2.z) / 2;
              writeLineVert(linePos, lineColor, lineAlphaAttr, lineVertIdx++, p1.x, p1.y, p1.z, color, finalAlpha);
              writeLineVert(linePos, lineColor, lineAlphaAttr, lineVertIdx++, p2.x, p1.y, midZ, color, finalAlpha);
              writeLineVert(linePos, lineColor, lineAlphaAttr, lineVertIdx++, p2.x, p1.y, midZ, color, finalAlpha);
              writeLineVert(linePos, lineColor, lineAlphaAttr, lineVertIdx++, p2.x, p2.y, p2.z, color, finalAlpha);
            } else {
              writeLineVert(linePos, lineColor, lineAlphaAttr, lineVertIdx++, p1.x, p1.y, p1.z, color, finalAlpha);
              writeLineVert(linePos, lineColor, lineAlphaAttr, lineVertIdx++, p2.x, p2.y, p2.z, color, finalAlpha);
            }
          }
        }
      }
      lineGeo.setDrawRange(0, lineVertIdx);
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.aColor.needsUpdate = true;
      lineGeo.attributes.aAlpha.needsUpdate = true;

      // ---- Mouse tether arcs while dragging ----
      let tetherVertIdx = 0;
      if (isDragging && mouseX > 0) {
        let connectedCount = 0;
        for (let i = 0; i < particles.length && connectedCount < MAX_TETHERS; i++) {
          const p = particles[i];
          const dist = Math.hypot(p.x - mouseX, p.y - mouseY);
          if (dist >= 190) continue;
          connectedCount++;
          const arcAlpha = (1 - dist / 190) * 0.7;
          const cx = (mouseX + p.x) / 2 + (Math.random() - 0.5) * 20;
          const cy = (mouseY + p.y) / 2 + (Math.random() - 0.5) * 20;

          let prevX = mouseX;
          let prevY = mouseY;
          for (let s = 1; s <= TETHER_SEGMENTS; s++) {
            const t = s / TETHER_SEGMENTS;
            const x = (1 - t) * (1 - t) * mouseX + 2 * (1 - t) * t * cx + t * t * p.x;
            const y = (1 - t) * (1 - t) * mouseY + 2 * (1 - t) * t * cy + t * t * p.y;
            if (tetherVertIdx + 1 >= MAX_TETHERS * TETHER_SEGMENTS * 2) break;
            writeLineVert(tetherPos, tetherColor, tetherAlphaAttr, tetherVertIdx++, prevX, prevY, 0, [0.52, 0.47, 1], arcAlpha);
            writeLineVert(tetherPos, tetherColor, tetherAlphaAttr, tetherVertIdx++, x, y, 0, [0.52, 0.47, 1], arcAlpha);
            prevX = x;
            prevY = y;
          }
        }
      }
      tetherGeo.setDrawRange(0, tetherVertIdx);
      tetherGeo.attributes.position.needsUpdate = true;
      tetherGeo.attributes.aColor.needsUpdate = true;
      tetherGeo.attributes.aAlpha.needsUpdate = true;

      // ---- Drag trail ribbon ----
      let trailVertIdx = 0;
      if (dragTrail.length > 1) {
        for (let t = 0; t < dragTrail.length; t++) {
          const pt = dragTrail[t];
          writeLineVert(trailPos, trailColor, trailAlphaAttr, trailVertIdx++, pt.x, pt.y, 2, SURGE_COLOR, 0.45 * pt.life);
          pt.life -= pt.decay;
        }
        while (dragTrail.length > 0 && dragTrail[0].life <= 0) dragTrail.shift();
      }
      trailGeo.setDrawRange(0, trailVertIdx);
      trailGeo.attributes.position.needsUpdate = true;
      trailGeo.attributes.aColor.needsUpdate = true;
      trailGeo.attributes.aAlpha.needsUpdate = true;

      // ---- Drag sparks ----
      for (let s = dragSparks.length - 1; s >= 0; s--) {
        const sp = dragSparks[s];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.94;
        sp.vy *= 0.94;
        sp.life -= sp.decay;
        if (sp.life <= 0) dragSparks.splice(s, 1);
      }
      for (let s = 0; s < MAX_SPARKS; s++) {
        if (s < dragSparks.length) {
          const sp = dragSparks[s];
          writePoint(sparkPos, sparkColor, sparkAlpha, sparkSize, s, sp.x, sp.y, 4, sp.color, sp.life, sp.size * sp.life * 3.4);
        } else {
          sparkAlpha[s] = 0;
        }
      }
      sparkGeo.setDrawRange(0, Math.max(dragSparks.length, 0));
      sparkGeo.attributes.position.needsUpdate = true;
      sparkGeo.attributes.aColor.needsUpdate = true;
      sparkGeo.attributes.aAlpha.needsUpdate = true;
      sparkGeo.attributes.aSize.needsUpdate = true;

      // ---- Radar pings ----
      for (let r = radarRings.length - 1; r >= 0; r--) {
        const ring = radarRings[r];
        ring.radius += ring.speed;
        ring.alpha = Math.max(0, 1 - ring.radius / ring.maxRadius);

        if (ring.radius >= ring.maxRadius) {
          scene.remove(ring.mesh);
          ring.mesh.geometry.dispose();
          ring.mesh.material.dispose();
          radarRings.splice(r, 1);
          continue;
        }

        ring.mesh.position.set(toWorldX(ring.x), toWorldY(ring.y), 6);
        ring.mesh.scale.setScalar(ring.radius);
        ring.mesh.material.opacity = ring.alpha * 0.85;

        for (let p = 0; p < particles.length; p++) {
          const pt = particles[p];
          const dist = Math.hypot(pt.x - ring.x, pt.y - ring.y);
          if (Math.abs(dist - ring.radius) < ring.speed * 1.5) {
            pt.highlightTime = 0.9;
          }
        }
      }

      renderer.render(scene, camera);
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(animate);
  }
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
    // Purple family only — matches the standardized cursor dot instead of
    // mixing in green/cyan accents from elsewhere in the palette.
    const colors = ['#7A42EA', '#5F34B7', '#A984F1'];

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

  // Find all statistics on page. The calculator's #res-* fields are
  // deliberately excluded: they update live on every slider tick, and this
  // odometer's rebuild-the-DOM-then-roll approach tears/corrupts mid-digit
  // when retriggered faster than its own animation finishes. They use
  // animateNumberTo() instead (see initValueCalculator), a textContent-only
  // tween that retargets smoothly with no rebuild, so it can't tear.
  const targetSelectors = [
    '.authority-stat .stat-number',
    '.stat-number',
    '.market-signal-grid .kpi-metric',
    '.sector-kpis .kpi-metric'
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
        showError(inquiryInput, inquiryError, 'Please describe your inquiry or project requirements.');
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

      const prefillMsg = `We are exploring operational impact for our ${sector.toUpperCase()} portfolio (${spend} spend). Interested in seeing how Univers EnOS delivers the estimated ${savings} net annual savings and ${carbon} abatement.`;
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
