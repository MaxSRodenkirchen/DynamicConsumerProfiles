// Frontend-Logik für Konsumentenprofile & IPS-Reizbewertung (MVP)

// 1. Die 6 Wahrnehmungsmodule
const MODULES = [
  { id: 1, name: '1. Reinheit und Sicherheit' },
  { id: 2, name: '2. Authentizität und Vertrauen in Organisationen' },
  { id: 3, name: '3. Geschmack und Sensorischer Beleg' },
  { id: 4, name: '4. Formatvertrautheit und Verpackung' },
  { id: 5, name: '5. Prestige und Exklusivität' },
  { id: 6, name: '6. Informationsbewertung und Alltagshürden' }
];

// 2. Kontext-Fragen mit sinnvoller Zuordnung zu den 6 Wahrnehmungsmodulen
// Skala: -1 (Barriere), 0 (Neutral - vorausgewählt), +1 (Treiber)
const CONTEXT_QUESTIONS = [
  {
    id: 'foodNeophobia',
    category: 'Psychologische Veranlagung',
    title: 'Allgemeine Food-Neophobie',
    question: 'Wie probierfreudig sind Sie bei völlig unbekannten Lebensmitteln?',
    modules: [3, 4],
    labels: {
      '-1': '-1: Skeptisch / meide Neues (Barriere)',
      '0': '0: Neutral',
      '1': '+1: Neugierig / sehr probierfreudig (Treiber)'
    }
  },
  {
    id: 'foodTechNeophobia',
    category: 'Psychologische Veranlagung',
    title: 'Food-Technology-Neophobie',
    question: 'Wie stehen Sie zu dem Einsatz neuer Technologien und wissenschaftlicher Verfahren bei der Lebensmittelherstellung?',
    modules: [1, 6],
    labels: {
      '-1': '-1: Skeptisch / ablehnend (Barriere)',
      '0': '0: Neutral',
      '1': '+1: Aufgeschlossen / befürwortend (Treiber)'
    }
  },
  {
    id: 'disgustSensitivity',
    category: 'Psychologische Veranlagung',
    title: 'Ekel-Sensibilität',
    question: 'Wie schnell empfinden Sie Ekel bei Lebensmitteln, die auf ungewohnte oder künstliche Weise erzeugt wurden?',
    modules: [1, 3],
    labels: {
      '-1': '-1: Empfindlich / schneller Ekel (Barriere)',
      '0': '0: Neutral',
      '1': '+1: Unempfindlich / kein Ekel (Treiber)'
    }
  },
  {
    id: 'generalInnovativeness',
    category: 'Psychologische Veranlagung',
    title: 'Generelle Innovationsfreude',
    question: 'Wie würden Sie Ihre Einstellung zu technologischen und gesellschaftlichen Innovationen im Allgemeinen beschreiben?',
    modules: [5],
    labels: {
      '-1': '-1: Konservativ / abwartend (Barriere)',
      '0': '0: Neutral',
      '1': '+1: Aufgeschlossen / Early Adopter (Treiber)'
    }
  },
  {
    id: 'priorFamiliarity',
    category: 'Wissen und Bekanntheit',
    title: 'Vorab-Vertrautheit',
    question: 'Haben Sie vor heute schon einmal von kultiviertem Fleisch (Lab-grown / Cell-based Meat) gehört oder gelesen?',
    modules: [6],
    labels: {
      '-1': '-1: Noch nie gehört / unsicher (Barriere)',
      '0': '0: Schon mal gehört / Neutral',
      '1': '+1: Gut informiert / Experte (Treiber)'
    }
  },
  {
    id: 'alreadyTried',
    category: 'Wissen und Bekanntheit',
    title: 'Produkt bereits probiert?',
    question: 'Haben Sie in der Vergangenheit bereits kultiviertes Fleisch probiert oder konkrete Geschmackserfahrung?',
    modules: [3],
    labels: {
      '-1': '-1: Nein, bisher bewusst gemieden (Barriere)',
      '0': '0: Nein / Neutral',
      '1': '+1: Ja, bereits positiv probiert (Treiber)'
    }
  },
  {
    id: 'technicalUnderstanding',
    category: 'Wissen und Bekanntheit',
    title: 'Technisches Verständnis',
    question: 'Wie gut ist Ihr technisches oder biologisches Verständnis für die Zellzüchtung in Bioreaktoren?',
    modules: [6, 1],
    labels: {
      '-1': '-1: Keine Vorkenntnisse / fremdartig (Barriere)',
      '0': '0: Durchschnittlich / Neutral',
      '1': '+1: Gutes Verständnis / Expertenwissen (Treiber)'
    }
  },
  {
    id: 'naturalnessPreference',
    category: 'Bisherige Überzeugungen & Weltbilder',
    title: 'Einstellung zur Natürlichkeit',
    question: 'Ist es für Sie entscheidend, dass Lebensmittel „natürlich“ sind und nicht im Labor hergestellt werden?',
    modules: [1, 4],
    labels: {
      '-1': '-1: Sehr wichtig – Labor gilt als unnatürlich (Barriere)',
      '0': '0: Neutral / Egal',
      '1': '+1: Unwichtig – Qualität & Ergebnis zählen (Treiber)'
    }
  },
  {
    id: 'valueAlignment',
    category: 'Bisherige Überzeugungen & Weltbilder',
    title: 'Leitmotiv & gesellschaftliche Orientierung (Tierwohl / Klima / Tradition)',
    question: 'Überwiegt bei Ihrer Ernährung der Wunsch nach Wandel (Tierwohl, Klimaschutz) oder das Festhalten an traditioneller Fleischproduktion?',
    modules: [5, 6],
    labels: {
      '-1': '-1: Traditionell / bewahrend (Barriere)',
      '0': '0: Neutral',
      '1': '+1: Starkes Motiv für Tierwohl / Klimaschutz (Treiber)'
    }
  },
  {
    id: 'trustScience',
    category: 'Vertrauensbereitschaft',
    title: 'Vertrauen in Wissenschaft & Technologie',
    question: 'In welchem Maße vertrauen Sie wissenschaftlichen und technologischen Fortschritten zur Lösung globaler Probleme?',
    modules: [2, 6],
    labels: {
      '-1': '-1: Starkes Misstrauen / skeptisch (Barriere)',
      '0': '0: Neutral',
      '1': '+1: Hohes Vertrauen in Wissenschaft (Treiber)'
    }
  },
  {
    id: 'trustRegulators',
    category: 'Vertrauensbereitschaft',
    title: 'Vertrauen in Regulierungsbehörden (z. B. EFSA / FDA)',
    question: 'Wenn eine offizielle Lebensmittelbehörde bestätigt, dass ein neues Produkt sicher ist – vertrauen Sie dieser Einschätzung?',
    modules: [1, 2],
    labels: {
      '-1': '-1: Misstrauen gegenüber Behörden (Barriere)',
      '0': '0: Neutral',
      '1': '+1: Hohes Vertrauen in Behördenprüfung (Treiber)'
    }
  },
  {
    id: 'trustIndustry',
    category: 'Vertrauensbereitschaft',
    title: 'Vertrauen in Lebensmittelproduzenten & Food-Tech',
    question: 'Wie hoch ist Ihr Grundvertrauen in Lebensmittelhersteller und neue Food-Tech-Unternehmen?',
    modules: [2],
    labels: {
      '-1': '-1: Geringes Vertrauen (Barriere)',
      '0': '0: Neutral',
      '1': '+1: Hohes Grundvertrauen (Treiber)'
    }
  }
];

// State
let profiles = [];
let stimuli = [];
let currentProfileId = null;
let currentStimulusId = null;

/**
 * pendingModuleActions speichert die aktuelle (noch nicht abgeschickte) Bewertung für den aktuellen Reiz pro Modul:
 * {
 *   [moduleId]: {
 *     legitimizedBarrierIds: string[], // Welche konkreten Barrieren in diesem Modul werden legitimiert (0)?
 *     addBarrier: boolean,             // Fügt dieser Reiz eine neue Barriere (-1) hinzu?
 *     addDriver: boolean               // Fügt dieser Reiz einen neuen Treiber (+1) hinzu?
 *   }
 * }
 */
let pendingModuleActions = {};

function getPendingAction(modId) {
  if (!pendingModuleActions[modId]) {
    pendingModuleActions[modId] = {
      legitimizedBarrierIds: [],
      addBarrier: false,
      addDriver: false
    };
  }
  return pendingModuleActions[modId];
}

function resetPendingActions() {
  pendingModuleActions = {};
}

function hasAnyPendingActions() {
  return Object.values(pendingModuleActions).some(
    act => act.addBarrier || act.addDriver || (act.legitimizedBarrierIds && act.legitimizedBarrierIds.length > 0)
  );
}

// Avatar State
let currentAvatarData = null;
let currentAvatarUrl = null;
let avatarDeleted = false;

// Navigation Elements
const navBtnProfiles = document.getElementById('nav-btn-profiles');
const navBtnEvaluation = document.getElementById('nav-btn-evaluation');
const viewProfiles = document.getElementById('view-profiles');
const viewEvaluation = document.getElementById('view-evaluation');
const btnJumpToEval = document.getElementById('btn-jump-to-eval');

// Profile View Elements
const listRealEl = document.getElementById('list-real');
const listFictionalEl = document.getElementById('list-fictional');
const countRealEl = document.getElementById('count-real');
const countFictionalEl = document.getElementById('count-fictional');
const displayDatatypeEl = document.getElementById('display-datatype');

const profileForm = document.getElementById('profile-form');
const formTitleEl = document.getElementById('form-title');
const btnNew = document.getElementById('btn-new');
const btnDelete = document.getElementById('btn-delete');
const btnReset = document.getElementById('btn-reset');
const statusMessageEl = document.getElementById('status-message');
const fieldId = document.getElementById('field-id');
const idHint = document.getElementById('id-hint');
const contextQuestionsContainer = document.getElementById('context-questions-container');
const profileModulesSummary = document.getElementById('profile-modules-summary');

// Avatar DOM Elemente
const avatarPreview = document.getElementById('avatar-preview');
const avatarPlaceholder = document.getElementById('avatar-placeholder');
const btnAvatarTpde = document.getElementById('btn-avatar-tpde');
const btnAvatarWebcam = document.getElementById('btn-avatar-webcam');
const btnAvatarRemove = document.getElementById('btn-avatar-remove');
const avatarStatus = document.getElementById('avatar-status');

// Webcam Modal Elemente
const modalWebcam = document.getElementById('modal-webcam');
const webcamVideo = document.getElementById('webcam-video');
const webcamCanvas = document.getElementById('webcam-canvas');
const webcamError = document.getElementById('webcam-error');
const btnWebcamCapture = document.getElementById('btn-webcam-capture');
const btnWebcamClose = document.getElementById('btn-webcam-close');
let webcamStream = null;

// Pop-Up Modal Elemente
const modalDatatype = document.getElementById('modal-datatype');
const btnChooseReal = document.getElementById('btn-choose-real');
const btnChooseFictional = document.getElementById('btn-choose-fictional');
const btnCancelModal = document.getElementById('btn-cancel-modal');

// Evaluation View Elements
const evalProfileSelect = document.getElementById('eval-profile-select');
const evalAcceptanceSelect = document.getElementById('eval-acceptance-select');
const evalStimulusSelect = document.getElementById('eval-stimulus-select');
const btnEvalRecommend = document.getElementById('btn-eval-recommend');
const evalAlgoReason = document.getElementById('eval-algo-reason');

const stimIdEl = document.getElementById('stim-id');
const stimCategoryEl = document.getElementById('stim-category');
const stimNameEl = document.getElementById('stim-name');
const stimContentEl = document.getElementById('stim-content');
const stimFunctionEl = document.getElementById('stim-function');

const evalHistoryCount = document.getElementById('eval-history-count');
const evalHistoryList = document.getElementById('eval-history-list');
const btnClearHistory = document.getElementById('btn-clear-history');

const evalModulesGrid = document.getElementById('eval-modules-grid');
const btnSubmitEvaluation = document.getElementById('btn-submit-evaluation');
const evalStatusMsg = document.getElementById('eval-status-msg');

// Alle Proxy-Formularfelder
const fieldNames = [
  'firstName',
  'lastName',
  'gender',
  'age',
  'nationality',
  'religion',
  'maritalStatus',
  'countryOfResidence',
  'livingEnvironment',
  'livingSituation',
  'dietaryHabits'
];

// ==========================================
// HILFSFUNKTIONEN & ALGORITHMUS
// ==========================================

/**
 * Berechnet für ein Profil (oder Formular-Entwurf) detailliert die Werte und konkreten Barrieren der 6 Wahrnehmungsmodule:
 * - barrierItems: Liste aller Barrieren ({ id, sourceType, label, detail, legitimizedBy })
 * - activeBarrierItems: Noch nicht legitimierte Barrieren
 * - legitimizedBarrierItems: Bereits durch eine Legitimation (0) ausgeglichene Barrieren
 * - driverItems: Liste aller Treiber ({ id, sourceType, label })
 * - barriers: Gesamtanzahl Barrieren (-1)
 * - legitimations: Anzahl angewandter Legitimationen (0)
 * - drivers: Anzahl Treiber (+1)
 * - activeBarriers: Anzahl noch offener, aktiver Barrieren
 */
function computeModuleStats(profile) {
  const stats = {};
  MODULES.forEach(m => {
    stats[m.id] = {
      id: m.id,
      name: m.name,
      barrierItems: [],
      activeBarrierItems: [],
      legitimizedBarrierItems: [],
      driverItems: [],
      barriers: 0,
      legitimations: 0,
      drivers: 0,
      activeBarriers: 0
    };
  });

  if (!profile) return stats;

  // 1. Kontext-Fragen einrechnen (-1 = konkrete Barriere, +1 = konkreter Treiber)
  const answers = profile.contextAnswers || {};
  CONTEXT_QUESTIONS.forEach(q => {
    const val = Number(answers[q.id] ?? 0);
    if (val === -1) {
      q.modules.forEach(modId => {
        if (stats[modId]) {
          stats[modId].barrierItems.push({
            id: `ctx:${q.id}:m${modId}`,
            sourceType: 'context',
            label: q.title,
            detail: q.labels['-1'],
            legitimizedBy: null
          });
        }
      });
    } else if (val === 1) {
      q.modules.forEach(modId => {
        if (stats[modId]) {
          stats[modId].driverItems.push({
            id: `ctx:${q.id}:m${modId}`,
            sourceType: 'context',
            label: q.title
          });
        }
      });
    }
  });

  // 2. Bisherige Reizbewertungen chronologisch anwenden
  const evals = Array.isArray(profile.stimulusEvaluations) ? profile.stimulusEvaluations : [];
  evals.forEach((ev, evalIdx) => {
    if (!ev) return;
    const stim = stimuli.find(s => s.id === ev.stimulusId);
    const stimLabel = stim ? `${stim.id} (${stim.name})` : (ev.stimulusId || `Reiz #${evalIdx + 1}`);

    // Neues detailliertes Format: ev.moduleActions[modId] = { legitimizedBarrierIds, addBarrier, addDriver }
    if (ev.moduleActions && typeof ev.moduleActions === 'object') {
      Object.entries(ev.moduleActions).forEach(([modIdStr, act]) => {
        const modId = Number(modIdStr);
        const modStat = stats[modId];
        if (!modStat || !act) return;

        // A) Spezifische Barrieren legitimieren (0)
        if (Array.isArray(act.legitimizedBarrierIds)) {
          act.legitimizedBarrierIds.forEach(barrierId => {
            const targetBarrier = modStat.barrierItems.find(b => b.id === barrierId && !b.legitimizedBy);
            if (targetBarrier) {
              targetBarrier.legitimizedBy = {
                stimulusId: ev.stimulusId,
                stimulusLabel: stimLabel
              };
            } else {
              // Fallback: falls ID sich geändert hat, erste offene Barriere legitimieren
              const firstOpen = modStat.barrierItems.find(b => !b.legitimizedBy);
              if (firstOpen) {
                firstOpen.legitimizedBy = {
                  stimulusId: ev.stimulusId,
                  stimulusLabel: stimLabel
                };
              }
            }
          });
        }

        // B) Neue Barriere durch diesen Reiz (-1)
        if (act.addBarrier) {
          modStat.barrierItems.push({
            id: `eval:${evalIdx}:${ev.stimulusId}:m${modId}`,
            sourceType: 'stimulus',
            label: `Reiz ${stimLabel}`,
            detail: 'Durch Reiz ausgelöste Barriere (-1)',
            legitimizedBy: null
          });
        }

        // C) Neuer Treiber durch diesen Reiz (+1)
        if (act.addDriver) {
          modStat.driverItems.push({
            id: `eval:${evalIdx}:${ev.stimulusId}:m${modId}`,
            sourceType: 'stimulus',
            label: `Reiz ${stimLabel}`
          });
        }
      });
    } else if (ev.ratings && typeof ev.ratings === 'object') {
      // Abwärtskompatibilität für einfaches ev.ratings Format
      Object.entries(ev.ratings).forEach(([modIdStr, ratingVal]) => {
        const modId = Number(modIdStr);
        const val = Number(ratingVal);
        const modStat = stats[modId];
        if (!modStat) return;

        if (val === -1) {
          modStat.barrierItems.push({
            id: `eval:${evalIdx}:${ev.stimulusId}:m${modId}`,
            sourceType: 'stimulus',
            label: `Reiz ${stimLabel}`,
            detail: 'Durch Reiz ausgelöste Barriere (-1)',
            legitimizedBy: null
          });
        } else if (val === 0) {
          const firstOpen = modStat.barrierItems.find(b => !b.legitimizedBy);
          if (firstOpen) {
            firstOpen.legitimizedBy = {
              stimulusId: ev.stimulusId,
              stimulusLabel: stimLabel
            };
          }
        } else if (val === 1) {
          modStat.driverItems.push({
            id: `eval:${evalIdx}:${ev.stimulusId}:m${modId}`,
            sourceType: 'stimulus',
            label: `Reiz ${stimLabel}`
          });
        }
      });
    }
  });

  // 3. Summen pro Modul berechnen
  MODULES.forEach(m => {
    const s = stats[m.id];
    s.activeBarrierItems = s.barrierItems.filter(b => !b.legitimizedBy);
    s.legitimizedBarrierItems = s.barrierItems.filter(b => Boolean(b.legitimizedBy));
    s.barriers = s.barrierItems.length;
    s.legitimations = s.legitimizedBarrierItems.length;
    s.activeBarriers = s.activeBarrierItems.length;
    s.drivers = s.driverItems.length;
  });

  return stats;
}

/**
 * Algorithmus zur Vorhersage des nächsten Reizes nach den Regeln in plan.md:
 * Regel 1: Wenn es eine aktive Barriere in einem Modul gibt, muss ein Reiz gezeigt werden,
 *          der auf das Modul abzielt und die primäre Funktion "legitimierend" hat.
 * Regel 2: Wenn es keine Barrieren mehr gibt, kann in den Modulen, wo noch kein Treiber
 *          bewertet wurde, ein "wert-schaffend" Reiz aus dem Modul gespielt werden.
 */
function recommendNextStimulus(profile) {
  if (!stimuli.length) {
    return { stimulus: null, reason: 'Keine Reize in stimuli.json vorhanden.' };
  }
  if (!profile) {
    return { stimulus: stimuli[0], reason: 'Kein Profil ausgewählt.' };
  }

  const stats = computeModuleStats(profile);
  const evaluatedIds = new Set(
    (profile.stimulusEvaluations || []).map(ev => ev.stimulusId)
  );

  // Hilfsfunktion: bevorzugt noch nicht bewertete Reize
  const pickStimulus = (candidates) => {
    if (!candidates.length) return null;
    const unseen = candidates.filter(s => !evaluatedIds.has(s.id));
    return unseen.length > 0 ? unseen[0] : candidates[0];
  };

  // REGEL 1: Module mit aktiven Barrieren suchen (sortiert nach höchster aktiver Barrierenzahl, dann Modul 1..6)
  const modulesWithBarriers = MODULES
    .map(m => stats[m.id])
    .filter(s => s.activeBarriers > 0)
    .sort((a, b) => b.activeBarriers - a.activeBarriers || a.id - b.id);

  if (modulesWithBarriers.length > 0) {
    for (const targetMod of modulesWithBarriers) {
      const legitimizingForMod = stimuli.filter(
        s => s.primaryFunction === 'legitimierend' && Array.isArray(s.primaryModules) && s.primaryModules.includes(targetMod.id)
      );
      const chosen = pickStimulus(legitimizingForMod);
      if (chosen) {
        const barrierNames = targetMod.activeBarrierItems.map(b => b.label).join(', ');
        return {
          stimulus: chosen,
          reason: `Regel 1 (Barriere vorhanden): Modul "${targetMod.name}" hat ${targetMod.activeBarriers} aktive Barriere(n) [${barrierNames}]. Es wird ein legitimierender Reiz für dieses Modul vorgeschlagen.`
        };
      }
    }
  }

  // REGEL 2: Keine aktiven Barrieren mehr -> Module ohne Treiber (drivers === 0) suchen
  const modulesWithoutDrivers = MODULES
    .map(m => stats[m.id])
    .filter(s => s.drivers === 0);

  if (modulesWithoutDrivers.length > 0) {
    for (const targetMod of modulesWithoutDrivers) {
      const valueCreatingForMod = stimuli.filter(
        s => s.primaryFunction === 'wert-schaffend' && Array.isArray(s.primaryModules) && s.primaryModules.includes(targetMod.id)
      );
      const chosen = pickStimulus(valueCreatingForMod);
      if (chosen) {
        return {
          stimulus: chosen,
          reason: `Regel 2 (Keine aktiven Barrieren mehr): Modul "${targetMod.name}" hat noch keinen Treiber (0). Es wird ein wert-schaffender Reiz für dieses Modul vorgeschlagen.`
        };
      }
    }
  }

  // FALLBACK: Alle Barrieren sind legitimiert und alle Module haben mindestens einen Treiber
  const allValueCreating = stimuli.filter(s => s.primaryFunction === 'wert-schaffend');
  const fallbackChosen = pickStimulus(allValueCreating) || stimuli[0];
  return {
    stimulus: fallbackChosen,
    reason: 'Alle aktiven Barrieren wurden legitimiert und in allen 6 Modulen sind bereits Treiber vorhanden! Weiterführender wert-schaffender Reiz zur Festigung der Akzeptanz.'
  };
}

// ==========================================
// NAVIGATION ZWISCHEN DEN SEITEN
// ==========================================

function switchView(viewName) {
  if (viewName === 'evaluation') {
    viewProfiles.style.display = 'none';
    viewEvaluation.style.display = 'block';
    navBtnProfiles.classList.remove('active');
    navBtnEvaluation.classList.add('active');
    renderEvaluationView();
  } else {
    viewEvaluation.style.display = 'none';
    viewProfiles.style.display = 'flex';
    navBtnEvaluation.classList.remove('active');
    navBtnProfiles.classList.add('active');
    if (currentProfileId) {
      selectProfile(currentProfileId);
    } else {
      updateProfileModulesSummaryFromForm();
    }
  }
}

navBtnProfiles.addEventListener('click', () => switchView('profiles'));
navBtnEvaluation.addEventListener('click', () => switchView('evaluation'));
btnJumpToEval.addEventListener('click', () => switchView('evaluation'));

// ==========================================
// PROFILSEITE: KONTEXT-FRAGEN & MODULE
// ==========================================

function renderContextQuestionsForm() {
  contextQuestionsContainer.innerHTML = '';

  CONTEXT_QUESTIONS.forEach(q => {
    const item = document.createElement('div');
    item.className = 'context-question-item';

    const modLabels = q.modules
      .map(id => `M${id}`)
      .join(', ');

    const header = document.createElement('div');
    header.className = 'context-question-header';
    header.innerHTML = `
      <span class="context-question-title">${q.title} <small style="font-weight:normal; color:#666;">(${q.category})</small></span>
      <span class="context-question-modules" title="Zahlt auf diese Wahrnehmungsmodule ein">Wirkt auf: ${modLabels}</span>
    `;

    const p = document.createElement('p');
    p.className = 'context-question-text';
    p.textContent = q.question;

    const optionsRow = document.createElement('div');
    optionsRow.className = 'context-options-row';

    [-1, 0, 1].forEach(val => {
      const label = document.createElement('label');
      label.className = 'context-option-label';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `ctx_${q.id}`;
      input.value = String(val);
      if (val === 0) input.checked = true; // 0 ist vorausgewählt!

      input.addEventListener('change', () => {
        updateProfileModulesSummaryFromForm();
      });

      const span = document.createElement('span');
      span.textContent = q.labels[String(val)];

      label.appendChild(input);
      label.appendChild(span);
      optionsRow.appendChild(label);
    });

    item.appendChild(header);
    item.appendChild(p);
    item.appendChild(optionsRow);
    contextQuestionsContainer.appendChild(item);
  });
}

function getContextAnswersFromForm() {
  const answers = {};
  CONTEXT_QUESTIONS.forEach(q => {
    const checked = profileForm.querySelector(`input[name="ctx_${q.id}"]:checked`);
    answers[q.id] = checked ? Number(checked.value) : 0;
  });
  return answers;
}

function setContextAnswersInForm(contextAnswers = {}) {
  CONTEXT_QUESTIONS.forEach(q => {
    const val = contextAnswers[q.id] !== undefined ? Number(contextAnswers[q.id]) : 0;
    const radio = profileForm.querySelector(`input[name="ctx_${q.id}"][value="${val}"]`);
    if (radio) {
      radio.checked = true;
    } else {
      const defaultRadio = profileForm.querySelector(`input[name="ctx_${q.id}"][value="0"]`);
      if (defaultRadio) defaultRadio.checked = true;
    }
  });
}

function getAcceptanceFromForm() {
  const checked = profileForm.querySelector('input[name="acceptance"]:checked');
  return checked ? checked.value : '';
}

function setAcceptanceInForm(acceptanceVal = '') {
  const radios = profileForm.querySelectorAll('input[name="acceptance"]');
  let matched = false;
  radios.forEach(r => {
    if (r.value === (acceptanceVal || '')) {
      r.checked = true;
      matched = true;
    }
  });
  if (!matched && radios.length > 0) {
    radios[0].checked = true;
  }
}

function updateProfileModulesSummaryFromForm() {
  const existingProfile = profiles.find(p => p.id === currentProfileId);
  const draftProfile = {
    contextAnswers: getContextAnswersFromForm(),
    stimulusEvaluations: existingProfile ? existingProfile.stimulusEvaluations : []
  };

  const stats = computeModuleStats(draftProfile);
  profileModulesSummary.innerHTML = '';

  MODULES.forEach(m => {
    const s = stats[m.id];
    const card = document.createElement('div');
    card.className = 'module-summary-card';

    let barriersHtml = '';
    if (s.barrierItems.length > 0) {
      const itemsHtml = s.barrierItems
        .map(b => {
          if (b.legitimizedBy) {
            return `<li class="legitimized" title="Legitimiert durch ${b.legitimizedBy.stimulusLabel}">${b.label} (Legitimiert durch ${b.legitimizedBy.stimulusId})</li>`;
          }
          return `<li><strong>Offene Barriere:</strong> ${b.label}</li>`;
        })
        .join('');
      barriersHtml = `<ul class="module-summary-barriers-list">${itemsHtml}</ul>`;
    } else {
      barriersHtml = `<div style="font-size:0.78rem; color:#666; margin-top:4px;">Keine Barrieren vorhanden</div>`;
    }

    card.innerHTML = `
      <strong>${m.name}</strong>
      <div class="module-counts">
        <span class="badge-count ${s.activeBarriers > 0 ? 'badge-barrier-active' : ''}">
          Aktive Barrieren (-1): ${s.activeBarriers} (Gesamt: ${s.barriers})
        </span>
        <span class="badge-count">
          Legitimationen (0): ${s.legitimations}
        </span>
        <span class="badge-count ${s.drivers > 0 ? 'badge-driver-active' : ''}">
          Treiber (+1): ${s.drivers}
        </span>
      </div>
      ${barriersHtml}
    `;
    profileModulesSummary.appendChild(card);
  });
}

// ==========================================
// AVATAR & WEBCAM FUNKTIONEN
// ==========================================

function showStatus(message, isError = false) {
  statusMessageEl.textContent = message;
  statusMessageEl.className = isError ? 'error' : 'success';
  statusMessageEl.style.display = 'block';
  setTimeout(() => {
    statusMessageEl.style.display = 'none';
  }, 4000);
}

function updateAvatarDisplay(src) {
  if (src) {
    avatarPreview.src = src;
    avatarPreview.style.display = 'block';
    avatarPlaceholder.style.display = 'none';
    btnAvatarRemove.style.display = 'inline-block';
  } else {
    avatarPreview.src = '';
    avatarPreview.style.display = 'none';
    avatarPlaceholder.style.display = 'block';
    btnAvatarRemove.style.display = 'none';
  }
}

async function fetchTpdeAvatar() {
  try {
    avatarStatus.textContent = 'Ziehe neues KI-Porträt von thispersondoesnotexist.com...';
    btnAvatarTpde.disabled = true;

    const res = await fetch('/api/avatar/random-tpde');
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.details || 'Fehler beim Laden von thispersondoesnotexist.com');
    }

    const data = await res.json();
    currentAvatarData = data.dataUrl;
    avatarDeleted = false;
    updateAvatarDisplay(data.dataUrl);
    avatarStatus.textContent = 'Neues KI-Porträt geladen (wird beim Speichern gesichert).';
  } catch (err) {
    avatarStatus.textContent = 'Fehler: ' + err.message;
  } finally {
    btnAvatarTpde.disabled = false;
  }
}

async function openWebcam() {
  webcamError.textContent = '';
  try {
    webcamStream = await navigator.mediaDevices.getUserMedia({
      video: { width: 320, height: 240, facingMode: 'user' }
    });
    webcamVideo.srcObject = webcamStream;
    modalWebcam.showModal();
  } catch (err) {
    alert('Webcam konnte nicht gestartet werden: ' + err.message + '\nBitte prüfe die Berechtigungen im Browser.');
  }
}

function closeWebcam() {
  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
    webcamStream = null;
  }
  if (modalWebcam.open) {
    modalWebcam.close();
  }
}

function captureWebcamPhoto() {
  if (!webcamVideo.videoWidth) return;
  const ctx = webcamCanvas.getContext('2d');
  webcamCanvas.width = webcamVideo.videoWidth;
  webcamCanvas.height = webcamVideo.videoHeight;
  ctx.drawImage(webcamVideo, 0, 0, webcamCanvas.width, webcamCanvas.height);

  const dataUrl = webcamCanvas.toDataURL('image/jpeg', 0.9);
  currentAvatarData = dataUrl;
  avatarDeleted = false;
  updateAvatarDisplay(dataUrl);
  avatarStatus.textContent = 'Webcam-Foto aufgenommen (wird beim Speichern gesichert).';
  closeWebcam();
}

function removeAvatar() {
  currentAvatarData = null;
  currentAvatarUrl = null;
  avatarDeleted = true;
  updateAvatarDisplay(null);
  avatarStatus.textContent = 'Bild entfernt (beim Speichern wird das Bild gelöscht).';
}

// ==========================================
// PROFILE LADEN, AUSWÄHLEN & SPEICHERN
// ==========================================

async function loadInitialData() {
  try {
    renderContextQuestionsForm();
    const [profRes, stimRes] = await Promise.all([
      fetch('/api/profiles'),
      fetch('/api/stimuli')
    ]);
    if (!profRes.ok) throw new Error('Konnte Profile nicht laden');
    if (!stimRes.ok) throw new Error('Konnte Reize nicht laden');

    profiles = await profRes.json();
    stimuli = await stimRes.json();

    renderSidebar();

    if (profiles.length > 0) {
      const firstReal = profiles.find(p => p.dataType === 'real');
      selectProfile(firstReal ? firstReal.id : profiles[0].id);
    } else {
      startNewProfile();
    }
  } catch (err) {
    showStatus('Fehler beim Laden: ' + err.message, true);
  }
}

async function fetchProfiles() {
  const res = await fetch('/api/profiles');
  if (!res.ok) throw new Error('Konnte Profile nicht laden');
  profiles = await res.json();
  renderSidebar();
}

function renderSidebar() {
  const realProfiles = profiles.filter(p => p.dataType === 'real');
  const fictionalProfiles = profiles.filter(p => p.dataType !== 'real');

  if (countRealEl) countRealEl.textContent = realProfiles.length;
  if (countFictionalEl) countFictionalEl.textContent = fictionalProfiles.length;

  listRealEl.innerHTML = '';
  listFictionalEl.innerHTML = '';

  const renderItem = (profile, container) => {
    const li = document.createElement('li');
    if (profile.id === currentProfileId) {
      li.classList.add('active');
    }

    const a = document.createElement('a');
    a.href = `#${profile.id}`;

    if (profile.avatarUrl) {
      const img = document.createElement('img');
      img.src = profile.avatarUrl;
      img.alt = '';
      img.className = 'sidebar-thumb';
      a.appendChild(img);
    }

    const spanText = document.createElement('span');
    const accLabel = profile.acceptance ? ` [${profile.acceptance}]` : '';
    spanText.textContent = `${profile.id}: ${profile.firstName} ${profile.lastName}${accLabel}`;
    a.appendChild(spanText);

    a.addEventListener('click', (e) => {
      e.preventDefault();
      selectProfile(profile.id);
    });

    li.appendChild(a);
    container.appendChild(li);
  };

  realProfiles.forEach(p => renderItem(p, listRealEl));
  if (realProfiles.length === 0) {
    const emptyLi = document.createElement('li');
    emptyLi.textContent = 'Keine realen Profile';
    emptyLi.style.color = '#777';
    emptyLi.style.fontSize = '0.85rem';
    listRealEl.appendChild(emptyLi);
  }

  fictionalProfiles.forEach(p => renderItem(p, listFictionalEl));
  if (fictionalProfiles.length === 0) {
    const emptyLi = document.createElement('li');
    emptyLi.textContent = 'Keine fiktiven Profile';
    emptyLi.style.color = '#777';
    emptyLi.style.fontSize = '0.85rem';
    listFictionalEl.appendChild(emptyLi);
  }
}

function setFieldValue(field, val) {
  const el = document.getElementById(`field-${field}`);
  if (!el) return;

  if (el.tagName === 'SELECT') {
    el.querySelectorAll('option[data-dynamic="true"]').forEach(opt => opt.remove());

    if (val === undefined || val === null || val === '') {
      el.value = '';
      return;
    }

    const valStr = String(val).trim();
    const options = Array.from(el.options);

    let match = options.find(o => o.value && o.value === valStr);
    if (!match) {
      match = options.find(o => o.value && o.value.toLowerCase() === valStr.toLowerCase());
    }
    if (!match) {
      match = options.find(o => {
        if (!o.value) return false;
        const oVal = o.value.toLowerCase();
        const v = valStr.toLowerCase();
        return oVal.includes(v) || v.includes(oVal);
      });
    }

    if (match) {
      el.value = match.value;
    } else {
      const customOpt = document.createElement('option');
      customOpt.value = valStr;
      customOpt.textContent = valStr;
      customOpt.dataset.dynamic = 'true';
      el.appendChild(customOpt);
      el.value = valStr;
    }
  } else {
    el.value = val !== undefined && val !== null ? val : '';
  }
}

function selectProfile(id) {
  const profile = profiles.find(p => p.id === id);
  if (!profile) return;

  currentProfileId = id;
  renderSidebar();

  const isReal = profile.dataType === 'real';
  formTitleEl.textContent = `Profil bearbeiten (${profile.id}: ${profile.firstName} ${profile.lastName})`;
  
  if (displayDatatypeEl) {
    displayDatatypeEl.textContent = isReal ? 'Reale Daten' : 'Fiktive Daten';
  }

  fieldId.value = profile.id;
  fieldId.readOnly = true;
  idHint.textContent = 'ID kann bei bestehendem Profil nicht geändert werden.';

  currentAvatarData = null;
  currentAvatarUrl = profile.avatarUrl || null;
  avatarDeleted = false;
  avatarStatus.textContent = '';
  updateAvatarDisplay(currentAvatarUrl);

  fieldNames.forEach(field => {
    setFieldValue(field, profile[field]);
  });

  setContextAnswersInForm(profile.contextAnswers || {});
  setAcceptanceInForm(profile.acceptance || '');
  updateProfileModulesSummaryFromForm();

  btnDelete.style.display = 'inline-block';
  btnJumpToEval.style.display = 'inline-block';
}

function startNewProfile() {
  currentProfileId = null;
  renderSidebar();

  formTitleEl.textContent = 'Neues Profil anlegen';
  if (displayDatatypeEl) {
    displayDatatypeEl.textContent = 'Wird beim Speichern festgelegt (Abfrage per Pop-Up)';
  }

  profileForm.reset();
  profileForm.querySelectorAll('option[data-dynamic="true"]').forEach(opt => opt.remove());

  currentAvatarData = null;
  currentAvatarUrl = null;
  avatarDeleted = false;
  avatarStatus.textContent = '';
  updateAvatarDisplay(null);

  fieldId.value = '';
  fieldId.readOnly = false;
  idHint.textContent = 'Leer lassen für automatische ID oder eigene ID eintragen.';

  setContextAnswersInForm({}); // setzt alle auf 0
  setAcceptanceInForm('');
  updateProfileModulesSummaryFromForm();

  btnDelete.style.display = 'none';
  btnJumpToEval.style.display = 'none';
  document.getElementById('field-firstName').focus();
}

function askDataType() {
  return new Promise((resolve) => {
    let resolved = false;

    const cleanup = () => {
      btnChooseReal.removeEventListener('click', onReal);
      btnChooseFictional.removeEventListener('click', onFictional);
      btnCancelModal.removeEventListener('click', onCancel);
      modalDatatype.removeEventListener('close', onCancel);
    };

    const onReal = () => {
      if (resolved) return;
      resolved = true;
      cleanup();
      modalDatatype.close();
      resolve('real');
    };

    const onFictional = () => {
      if (resolved) return;
      resolved = true;
      cleanup();
      modalDatatype.close();
      resolve('fiktiv');
    };

    const onCancel = () => {
      if (resolved) return;
      resolved = true;
      cleanup();
      if (modalDatatype.open) {
        modalDatatype.close();
      }
      resolve(null);
    };

    btnChooseReal.addEventListener('click', onReal);
    btnChooseFictional.addEventListener('click', onFictional);
    btnCancelModal.addEventListener('click', onCancel);
    modalDatatype.addEventListener('close', onCancel);

    modalDatatype.showModal();
  });
}

async function handleFormSubmit(e) {
  e.preventDefault();

  if (!profileForm.checkValidity()) {
    profileForm.reportValidity();
    return;
  }

  const chosenDataType = await askDataType();
  if (!chosenDataType) {
    return;
  }

  const formData = new FormData(profileForm);
  const existingProfile = profiles.find(p => p.id === currentProfileId);

  const data = {
    dataType: chosenDataType,
    contextAnswers: getContextAnswersFromForm(),
    acceptance: getAcceptanceFromForm(),
    stimulusEvaluations: existingProfile ? existingProfile.stimulusEvaluations : []
  };

  if (currentAvatarData) {
    data.avatarData = currentAvatarData;
  } else if (avatarDeleted) {
    data.avatarUrl = null;
  }

  if (!currentProfileId && formData.get('id')?.trim()) {
    data.id = formData.get('id').trim();
  }

  fieldNames.forEach(field => {
    const val = formData.get(field);
    if (field === 'age') {
      data[field] = val !== '' ? Number(val) : null;
    } else {
      data[field] = typeof val === 'string' ? val.trim() : val;
    }
  });

  try {
    let res;
    if (currentProfileId) {
      res = await fetch(`/api/profiles/${encodeURIComponent(currentProfileId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Fehler beim Speichern');
    }

    const saved = await res.json();
    const typeLabel = saved.dataType === 'real' ? 'Reale Daten' : 'Fiktive Daten';
    showStatus(`Profil ${saved.id} als "${typeLabel}" erfolgreich gespeichert.`);
    currentProfileId = saved.id;
    await fetchProfiles();
    selectProfile(saved.id);
  } catch (err) {
    showStatus(err.message, true);
  }
}

async function handleDelete() {
  if (!currentProfileId) return;

  const confirmed = window.confirm(`Möchtest du das Profil ${currentProfileId} wirklich löschen?`);
  if (!confirmed) return;

  try {
    const res = await fetch(`/api/profiles/${encodeURIComponent(currentProfileId)}`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Fehler beim Löschen');
    }

    showStatus(`Profil ${currentProfileId} gelöscht.`);
    currentProfileId = null;
    await fetchProfiles();
    if (profiles.length > 0) {
      selectProfile(profiles[0].id);
    } else {
      startNewProfile();
    }
  } catch (err) {
    showStatus(err.message, true);
  }
}

function handleReset() {
  if (currentProfileId) {
    selectProfile(currentProfileId);
  } else {
    startNewProfile();
  }
}

// ==========================================
// SEITE 2: REIZBEWERTUNGSSEITE
// ==========================================

function renderEvaluationView(keepCurrentStimulus = false) {
  // 1. Profil-Dropdown befüllen
  evalProfileSelect.innerHTML = '';
  profiles.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.id}: ${p.firstName} ${p.lastName} (${p.dataType === 'real' ? 'Real' : 'Fiktiv'})`;
    evalProfileSelect.appendChild(opt);
  });

  if (!currentProfileId && profiles.length > 0) {
    currentProfileId = profiles[0].id;
  }
  if (currentProfileId) {
    evalProfileSelect.value = currentProfileId;
  }

  const activeProfile = profiles.find(p => p.id === currentProfileId);

  // 2. Akzeptanz-Dropdown synchronisieren
  evalAcceptanceSelect.value = activeProfile?.acceptance || '';

  // 3. Reiz-Auswahl Dropdown befüllen
  evalStimulusSelect.innerHTML = '';
  stimuli.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `${s.id}: ${s.name} [${s.primaryFunction}]`;
    evalStimulusSelect.appendChild(opt);
  });

  // 4. Algorithmus-Empfehlung bestimmen (falls nicht manuell ein bestimmter Reiz gehalten wird)
  const recommendation = recommendNextStimulus(activeProfile);
  if (!keepCurrentStimulus || !currentStimulusId) {
    currentStimulusId = recommendation.stimulus ? recommendation.stimulus.id : (stimuli[0]?.id || null);
    evalAlgoReason.innerHTML = `<strong>Algorithmus-Entscheidung:</strong> ${recommendation.reason}`;
  }

  if (currentStimulusId) {
    evalStimulusSelect.value = currentStimulusId;
  }

  renderCurrentStimulusCard();
  renderEvaluationModulesGrid(activeProfile);
  renderEvaluationHistory(activeProfile);
}

function renderCurrentStimulusCard() {
  const stim = stimuli.find(s => s.id === currentStimulusId);
  if (!stim) {
    stimIdEl.textContent = '-';
    stimCategoryEl.textContent = '';
    stimNameEl.textContent = 'Kein Reiz verfügbar';
    stimContentEl.textContent = '';
    stimFunctionEl.textContent = '-';
    return;
  }

  stimIdEl.textContent = stim.id;
  stimCategoryEl.textContent = stim.category || '';
  stimNameEl.textContent = stim.name;
  stimContentEl.textContent = stim.content;
  stimFunctionEl.textContent = stim.primaryFunction;
  // Hinweis laut plan.md: Primäres Modul soll hier nicht sichtbar sein, sondern dient dem Algorithmus als Stütze.
}

function renderEvaluationModulesGrid(activeProfile) {
  evalModulesGrid.innerHTML = '';
  const stats = computeModuleStats(activeProfile);

  MODULES.forEach(m => {
    const s = stats[m.id];
    const action = getPendingAction(m.id);

    // Gültigkeit der ausgewählten Legitimationen sicherstellen (nur für aktuell offene Barrieren dieses Moduls)
    const activeIdsSet = new Set(s.activeBarrierItems.map(b => b.id));
    action.legitimizedBarrierIds = action.legitimizedBarrierIds.filter(id => activeIdsSet.has(id));

    const card = document.createElement('div');
    card.className = 'module-eval-card';

    // 1. Kopfbereich mit Modulname und Zählern
    const topDiv = document.createElement('div');
    topDiv.innerHTML = `
      <div class="module-eval-title">${m.name}</div>
      <div class="module-eval-state">
        <span class="badge-count ${s.activeBarriers > 0 ? 'badge-barrier-active' : ''}">
          Aktive Barrieren: ${s.activeBarriers}
        </span>
        <span class="badge-count">
          Legitimationen: ${s.legitimations}
        </span>
        <span class="badge-count ${s.drivers > 0 ? 'badge-driver-active' : ''}">
          Treiber: ${s.drivers}
        </span>
      </div>
    `;

    // 2. Liste aller vorhandenen Barrieren im Modul (jede aktive Barriere bekommt ihren eigenen "0 / Legitimation"-Button)
    const barriersContainer = document.createElement('div');
    barriersContainer.className = 'module-barriers-list';

    if (s.barrierItems.length === 0) {
      const emptyEl = document.createElement('div');
      emptyEl.className = 'module-barriers-empty';
      emptyEl.textContent = 'Keine Barrieren in diesem Modul vorhanden.';
      barriersContainer.appendChild(emptyEl);
    } else {
      // Zuerst alle aktiven (noch offenen) Barrieren anzeigen – jede einzeln legitimierbar!
      s.activeBarrierItems.forEach((barrier, idx) => {
        const isSelectedForLegit = action.legitimizedBarrierIds.includes(barrier.id);

        const row = document.createElement('div');
        row.className = 'barrier-row';

        const infoDiv = document.createElement('div');
        infoDiv.className = 'barrier-info';
        infoDiv.innerHTML = `
          <span class="barrier-source-tag">Barriere #${idx + 1}: ${barrier.label}</span>
          <span>${barrier.detail}</span>
        `;

        const btnLegit = document.createElement('button');
        btnLegit.type = 'button';
        btnLegit.className = `btn-legitimize-barrier ${isSelectedForLegit ? 'selected-legitimation' : ''}`;
        btnLegit.textContent = isSelectedForLegit
          ? '✓ 0 / Legitimation ausgewählt'
          : '0 / Legitimation auf diese Barriere';

        btnLegit.addEventListener('click', () => {
          const pos = action.legitimizedBarrierIds.indexOf(barrier.id);
          if (pos >= 0) {
            action.legitimizedBarrierIds.splice(pos, 1);
          } else {
            action.legitimizedBarrierIds.push(barrier.id);
          }
          renderEvaluationModulesGrid(activeProfile);
        });

        row.appendChild(infoDiv);
        row.appendChild(btnLegit);
        barriersContainer.appendChild(row);
      });

      // Bereits legitimierte Barrieren zur Nachvollziehbarkeit anzeigen
      s.legitimizedBarrierItems.forEach(barrier => {
        const row = document.createElement('div');
        row.className = 'barrier-row is-legitimized';
        row.innerHTML = `
          <div class="barrier-info">
            <span class="barrier-source-tag">✓ Legitimierte Barriere: ${barrier.label}</span>
            <span class="barrier-legit-note">Ausgeglichen (0) durch ${barrier.legitimizedBy.stimulusLabel}</span>
          </div>
        `;
        barriersContainer.appendChild(row);
      });
    }

    // 3. Modul-Buttons für neue Barriere (-1) oder Treiber (+1) durch diesen Reiz
    const btnContainer = document.createElement('div');
    btnContainer.className = 'module-eval-buttons';

    // Button -1: Neue Barriere durch diesen Reiz
    const btnBarrier = document.createElement('button');
    btnBarrier.type = 'button';
    btnBarrier.className = `btn-rate ${action.addBarrier ? 'selected-barrier' : ''}`;
    btnBarrier.textContent = action.addBarrier ? '✓ -1 / Neue Barriere' : '-1 / Barriere';
    btnBarrier.addEventListener('click', () => {
      action.addBarrier = !action.addBarrier;
      renderEvaluationModulesGrid(activeProfile);
    });
    btnContainer.appendChild(btnBarrier);

    // Button +1: Neuer Treiber durch diesen Reiz
    const btnDriver = document.createElement('button');
    btnDriver.type = 'button';
    btnDriver.className = `btn-rate ${action.addDriver ? 'selected-driver' : ''}`;
    btnDriver.textContent = action.addDriver ? '✓ +1 / Treiber' : '+1 / Treiber';
    btnDriver.addEventListener('click', () => {
      action.addDriver = !action.addDriver;
      renderEvaluationModulesGrid(activeProfile);
    });
    btnContainer.appendChild(btnDriver);

    card.appendChild(topDiv);
    card.appendChild(barriersContainer);
    card.appendChild(btnContainer);
    evalModulesGrid.appendChild(card);
  });
}

function renderEvaluationHistory(activeProfile) {
  const evals = activeProfile?.stimulusEvaluations || [];
  evalHistoryCount.textContent = evals.length;
  evalHistoryList.innerHTML = '';

  if (evals.length === 0) {
    const li = document.createElement('li');
    li.style.color = '#666';
    li.textContent = 'Noch keine Reize für dieses Profil bewertet.';
    evalHistoryList.appendChild(li);
    return;
  }

  evals.forEach((ev, idx) => {
    const stim = stimuli.find(s => s.id === ev.stimulusId);
    const stimTitle = stim ? `${stim.id} (${stim.name})` : ev.stimulusId;
    const summaryParts = [];

    if (ev.moduleActions && typeof ev.moduleActions === 'object') {
      Object.entries(ev.moduleActions).forEach(([modId, act]) => {
        const items = [];
        if (act.legitimizedBarrierIds?.length) {
          items.push(`${act.legitimizedBarrierIds.length}x Legitimation (0)`);
        }
        if (act.addBarrier) items.push('-1 Barriere');
        if (act.addDriver) items.push('+1 Treiber');
        if (items.length > 0) {
          summaryParts.push(`Modul ${modId}: ${items.join(' & ')}`);
        }
      });
    } else if (ev.ratings) {
      Object.entries(ev.ratings).forEach(([modId, val]) => {
        const label = val === -1 ? '-1 Barriere' : val === 0 ? '0 Legitimation' : '+1 Treiber';
        summaryParts.push(`Modul ${modId}: ${label}`);
      });
    }

    const li = document.createElement('li');
    li.textContent = `${idx + 1}. ${stimTitle} -> ${summaryParts.join(' | ') || 'Keine Modul-Wertung'}`;
    evalHistoryList.appendChild(li);
  });
}

// Event Listener auf der Reizbewertungsseite
evalProfileSelect.addEventListener('change', () => {
  currentProfileId = evalProfileSelect.value;
  resetPendingActions();
  renderEvaluationView(false);
});

evalAcceptanceSelect.addEventListener('change', async () => {
  const activeProfile = profiles.find(p => p.id === currentProfileId);
  if (!activeProfile) return;

  try {
    const res = await fetch(`/api/profiles/${encodeURIComponent(activeProfile.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...activeProfile,
        acceptance: evalAcceptanceSelect.value
      })
    });
    if (res.ok) {
      await fetchProfiles();
      evalStatusMsg.textContent = 'Akzeptanz aktualisiert.';
      setTimeout(() => { evalStatusMsg.textContent = ''; }, 2500);
    }
  } catch (err) {
    alert('Fehler beim Speichern der Akzeptanz: ' + err.message);
  }
});

evalStimulusSelect.addEventListener('change', () => {
  currentStimulusId = evalStimulusSelect.value;
  resetPendingActions();
  evalAlgoReason.innerHTML = '<strong>Manuelle Auswahl (Testmodus):</strong> Reiz wurde manuell über das Dropdown gewechselt.';
  renderCurrentStimulusCard();
  const activeProfile = profiles.find(p => p.id === currentProfileId);
  renderEvaluationModulesGrid(activeProfile);
});

btnEvalRecommend.addEventListener('click', () => {
  resetPendingActions();
  renderEvaluationView(false);
});

btnSubmitEvaluation.addEventListener('click', async () => {
  const activeProfile = profiles.find(p => p.id === currentProfileId);
  if (!activeProfile || !currentStimulusId) return;

  if (!hasAnyPendingActions()) {
    const proceedEmpty = window.confirm('Du hast in keinem Modul eine Bewertung (-1, 0 Legitimation auf eine Barriere, +1) ausgewählt. Trotzdem als neutral gesehen speichern und zum nächsten Reiz wechseln?');
    if (!proceedEmpty) return;
  }

  // Nur Module speichern, in denen tatsächlich eine Aktion ausgewählt wurde
  const cleanedModuleActions = {};
  Object.entries(pendingModuleActions).forEach(([modId, act]) => {
    if (act.addBarrier || act.addDriver || (act.legitimizedBarrierIds && act.legitimizedBarrierIds.length > 0)) {
      cleanedModuleActions[modId] = {
        legitimizedBarrierIds: [...(act.legitimizedBarrierIds || [])],
        addBarrier: Boolean(act.addBarrier),
        addDriver: Boolean(act.addDriver)
      };
    }
  });

  const newEvalEntry = {
    stimulusId: currentStimulusId,
    timestamp: new Date().toISOString(),
    moduleActions: cleanedModuleActions
  };

  const updatedEvaluations = [...(activeProfile.stimulusEvaluations || []), newEvalEntry];

  try {
    btnSubmitEvaluation.disabled = true;
    const res = await fetch(`/api/profiles/${encodeURIComponent(activeProfile.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...activeProfile,
        stimulusEvaluations: updatedEvaluations
      })
    });

    if (!res.ok) {
      throw new Error('Fehler beim Speichern der Reizbewertung');
    }

    resetPendingActions();
    await fetchProfiles();
    renderEvaluationView(false); // Lädt automatisch den nächsten vom Algorithmus empfohlenen Reiz!

    evalStatusMsg.textContent = '✓ Bewertung gespeichert & nächster optimaler Reiz geladen!';
    setTimeout(() => {
      evalStatusMsg.textContent = '';
    }, 3500);
  } catch (err) {
    alert(err.message);
  } finally {
    btnSubmitEvaluation.disabled = false;
  }
});

btnClearHistory.addEventListener('click', async () => {
  const activeProfile = profiles.find(p => p.id === currentProfileId);
  if (!activeProfile) return;

  if (!window.confirm(`Alle bisherigen Reizbewertungen für ${activeProfile.firstName} ${activeProfile.lastName} zurücksetzen?`)) {
    return;
  }

  try {
    const res = await fetch(`/api/profiles/${encodeURIComponent(activeProfile.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...activeProfile,
        stimulusEvaluations: []
      })
    });
    if (res.ok) {
      resetPendingActions();
      await fetchProfiles();
      renderEvaluationView(false);
    }
  } catch (err) {
    alert('Fehler beim Zurücksetzen: ' + err.message);
  }
});

// Event Listeners Profil-Formular & Aktionen
profileForm.addEventListener('submit', handleFormSubmit);
btnNew.addEventListener('click', startNewProfile);
btnDelete.addEventListener('click', handleDelete);
btnReset.addEventListener('click', handleReset);

// Avatar Event Listeners
btnAvatarTpde.addEventListener('click', fetchTpdeAvatar);
btnAvatarWebcam.addEventListener('click', openWebcam);
btnAvatarRemove.addEventListener('click', removeAvatar);

// Webcam Event Listeners
btnWebcamCapture.addEventListener('click', captureWebcamPhoto);
btnWebcamClose.addEventListener('click', closeWebcam);
modalWebcam.addEventListener('close', closeWebcam);

// Initial laden
loadInitialData();
