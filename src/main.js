// Frontend-Logik für Konsumentenprofile & IPS-Reizbewertung (MVP)
import { getDecisionTreeContentForStimulus } from './decisionTreeData.js';
import { ICONS, icon } from './icons.js';

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
let allEvaluations = [];
let currentProfileId = null;
let currentStimulusId = null;
let editingStimulusId = null;

let activeFunctionFilter = 'all';
let activeModuleFilter = 'all';
let activeMvpFilter = false;
let activeStimuliViewMode = 'grid'; // 'grid' | 'details'

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
const navBtnHome = document.getElementById('nav-btn-home');
const navBtnProfiles = document.getElementById('nav-btn-profiles');
const navBtnEvaluation = document.getElementById('nav-btn-evaluation');
const navBtnDecisionTree = document.getElementById('nav-btn-decision-tree');
const navBtnStimuli = document.getElementById('nav-btn-stimuli');
const viewHome = document.getElementById('view-home');
const homeBentoGrid = document.getElementById('home-bento-grid');
const viewProfiles = document.getElementById('view-profiles');
const viewEvaluation = document.getElementById('view-evaluation');
const viewDecisionTree = document.getElementById('view-decision-tree');
const viewStimuli = document.getElementById('view-stimuli');

// Decision Tree Prototype Elements
const btnDtRestart = document.getElementById('btn-dt-restart');
const dtChapterLabel = document.getElementById('dt-chapter-label');
const dtStimName = document.getElementById('dt-stim-name');
const dtStimCategory = document.getElementById('dt-stim-category');
const dtStimFunction = document.getElementById('dt-stim-function');
const dtStimModulesDisplay = document.getElementById('dt-stim-modules-display');
const dtStimAlgoReason = document.getElementById('dt-stim-algo-reason');
const dtStoryNarrative = document.getElementById('dt-story-narrative');
const dtStimMediaContainer = document.getElementById('dt-stim-media-container');
const dtStimContent = document.getElementById('dt-stim-content');
const dtHistoryBox = document.getElementById('dt-history-box');
const btnToggleDtHistory = document.getElementById('btn-toggle-dt-history');
const dtHistoryCount = document.getElementById('dt-history-count');
const dtHistoryList = document.getElementById('dt-history-list');
const dtModulesSummaryGrid = document.getElementById('dt-modules-summary-grid');
const dtAcceptanceButtons = document.querySelectorAll('#dt-acceptance-group .btn-acceptance');
const dtChoicesContainer = document.getElementById('dt-choices-container');

// Decision Tree Sandbox State (unabhängig von gespeicherten Profilen!)
let dtSessionProfile = null;
let dtStorySteps = [];
let dtCurrentStimulusId = null;
let dtCurrentAlgoReason = '';

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
const contextQuestionsContainer = document.getElementById('context-questions-container');
const profileEvalModulesSummary = document.getElementById('profile-eval-modules-summary');
const profileTabButtons = document.querySelectorAll('.profile-tab-btn');
const profileTabPanels = document.querySelectorAll('.profile-tab-panel');
const btnToggleProxyDetails = document.getElementById('btn-toggle-proxy-details');
const textProxyToggle = document.getElementById('text-proxy-toggle');
const proxyDetailsContainer = document.getElementById('proxy-details-container');
const steckbriefContainer = document.getElementById('steckbrief-container');

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

// Header Profile Selector Elements
const headerAvatarImg = document.getElementById('header-avatar-img');
const headerAvatarInitials = document.getElementById('header-avatar-initials');
const headerProfileName = document.getElementById('header-profile-name');
const headerProfileSelect = document.getElementById('header-profile-select');

// Evaluation View Elements
const stimCategoryEl = document.getElementById('stim-category');
const stimNameEl = document.getElementById('stim-name');
const stimMediaContainerEl = document.getElementById('stim-media-container');
const stimContentEl = document.getElementById('stim-content');
const stimFunctionEl = document.getElementById('stim-function');
const stimModulesDisplay = document.getElementById('stim-modules-display');
const stimAlgoReason = document.getElementById('stim-algo-reason');

const evalHistoryBox = document.getElementById('eval-history-box');
const btnToggleHistory = document.getElementById('btn-toggle-history');
const evalHistoryCount = document.getElementById('eval-history-count');
const evalHistoryList = document.getElementById('eval-history-list');
const btnClearHistory = document.getElementById('btn-clear-history');

const evalPromptBlock = document.getElementById('eval-prompt-block');
const evalPromptHeading = document.getElementById('eval-prompt-heading');
const btnRevealModules = document.getElementById('btn-reveal-modules');
const evalModulesWrapper = document.getElementById('eval-modules-wrapper');
const evalModulesGrid = document.getElementById('eval-modules-grid');
const evalAcceptanceGroup = document.getElementById('eval-acceptance-group');
const evalAcceptanceButtons = document.querySelectorAll('#eval-acceptance-group .btn-acceptance');
const btnSubmitEvaluation = document.getElementById('btn-submit-evaluation');
const evalStatusMsg = document.getElementById('eval-status-msg');

let currentEvaluationAcceptance = '';
let initialEvalAcceptance = '';
let currentStimulusAlgoReason = '';

// Stimuli Collection View Elements (1-Spalten Galerie + Pop-Up Modal)
const countStimuliEl = document.getElementById('count-stimuli');
const stimuliCardsGridEl = document.getElementById('stimuli-cards-grid');
const modalStimulusDetail = document.getElementById('modal-stimulus-detail');
const btnCloseStimulusModal = document.getElementById('btn-close-stimulus-modal');
const btnNewStimulus = document.getElementById('btn-new-stimulus');
const stimulusForm = document.getElementById('stimulus-form');
const stimFieldName = document.getElementById('stim-field-name');
const stimFieldMediatype = document.getElementById('stim-field-mediatype');
const stimFieldImage = document.getElementById('stim-field-image');
const stimFieldIframe = document.getElementById('stim-field-iframe');
const stimFieldContent = document.getElementById('stim-field-content');
const stimMediaSlot = document.getElementById('stim-media-slot');
const stimModulesCheckboxes = document.getElementById('stim-modules-checkboxes');
const stimFormPreview = document.getElementById('stim-form-preview');
const btnDeleteStimulus = document.getElementById('btn-delete-stimulus');
const btnResetStimulus = document.getElementById('btn-reset-stimulus');
const stimulusStatusMessageEl = document.getElementById('stimulus-status-message');

const stimFilterFunctionGroup = document.getElementById('stim-filter-function-group');
const stimFilterModuleGroup = document.getElementById('stim-filter-module-group');
const btnFilterMvp = document.getElementById('btn-filter-mvp');
const stimViewModeGroup = document.getElementById('stim-view-mode-group');
const stimEvalContainer = document.getElementById('stim-eval-container');
const stimEvalSummaryBadge = document.getElementById('stim-eval-summary-badge');

// Alle Proxy-Formularfelder
const fieldNames = [
  'firstName',
  'lastName',
  'bio',
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
    const stimLabel = stim ? stim.name : 'Reiz';

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
            label: stimLabel,
            detail: 'Durch Reiz ausgelöste Barriere (-1)',
            legitimizedBy: null
          });
        }

        // C) Neuer Treiber durch diesen Reiz (+1)
        if (act.addDriver) {
          modStat.driverItems.push({
            id: `eval:${evalIdx}:${ev.stimulusId}:m${modId}`,
            sourceType: 'stimulus',
            label: stimLabel
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
            label: stimLabel,
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
            label: stimLabel
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
 * - Ein Reiz wird IMMER nur einmal pro Profil bewertet (bereits bewertete Reize kommen NIE erneut).
 * - Regel 1: Wenn es eine aktive Barriere in einem Modul gibt, muss ein noch unbewerteter Reiz gezeigt werden,
 *            der auf das Modul abzielt und die primäre Funktion "legitimierend" (bzw. "widerstands-mindernd") hat.
 * - Regel 2: Wenn es keine Barrieren mehr gibt, wird in den Modulen, wo noch kein Treiber
 *            bewertet wurde, ein noch unbewerteter "wert-schaffend" Reiz aus dem Modul gespielt.
 */
function stimulusMatchesFunction(s, fn) {
  if (!s) return false;
  if (Array.isArray(s.functions) && s.functions.includes(fn)) return true;
  return s.primaryFunction === fn;
}

function getStimulusFunctionsDisplay(s) {
  if (!s) return '-';
  if (Array.isArray(s.functions) && s.functions.length > 0) {
    return s.functions.join(', ');
  }
  return s.primaryFunction || '-';
}

function getSelectedStimulusFunctions() {
  const checked = Array.from(document.querySelectorAll('input[name="stim_function"]:checked')).map(cb => cb.value);
  return checked.length > 0 ? checked : ['legitimierend'];
}

function setSelectedStimulusFunctions(funcs) {
  const set = new Set(Array.isArray(funcs) && funcs.length > 0 ? funcs : (funcs ? [funcs] : ['legitimierend']));
  document.querySelectorAll('input[name="stim_function"]').forEach(cb => {
    cb.checked = set.has(cb.value);
  });
}

function recommendNextStimulus(profile, extraExcludeIds = []) {
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
  extraExcludeIds.forEach(id => {
    if (id) evaluatedIds.add(id);
  });

  // Strikt nur Reize zulassen, die für dieses Profil noch NIE bewertet wurden
  const unseenStimuli = stimuli.filter(s => !evaluatedIds.has(s.id));
  if (unseenStimuli.length === 0) {
    return {
      stimulus: null,
      reason: 'Alle verfügbaren Reize wurden für dieses Profil bereits einmal bewertet.'
    };
  }

  // REGEL 1: Module mit aktiven Barrieren suchen (sortiert nach höchster aktiver Barrierenzahl, dann Modul 1..6)
  const modulesWithBarriers = MODULES
    .map(m => stats[m.id])
    .filter(s => s.activeBarriers > 0)
    .sort((a, b) => b.activeBarriers - a.activeBarriers || a.id - b.id);

  if (modulesWithBarriers.length > 0) {
    for (const targetMod of modulesWithBarriers) {
      const legitimizingForMod = unseenStimuli.filter(
        s => (stimulusMatchesFunction(s, 'legitimierend') || stimulusMatchesFunction(s, 'widerstands-mindernd')) &&
             Array.isArray(s.primaryModules) && s.primaryModules.includes(targetMod.id)
      );
      const chosen = legitimizingForMod.find(s => stimulusMatchesFunction(s, 'legitimierend')) || legitimizingForMod[0];
      if (chosen) {
        const barrierNames = targetMod.activeBarrierItems.map(b => b.label).join(', ');
        return {
          stimulus: chosen,
          reason: `Regel 1 (Barriere vorhanden): Modul "${targetMod.name}" hat ${targetMod.activeBarriers} aktive Barriere(n) [${barrierNames}]. Es wird ein unbewerteter ${getStimulusFunctionsDisplay(chosen)}er Reiz für dieses Modul vorgeschlagen.`
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
      const valueCreatingForMod = unseenStimuli.filter(
        s => stimulusMatchesFunction(s, 'wert-schaffend') && Array.isArray(s.primaryModules) && s.primaryModules.includes(targetMod.id)
      );
      if (valueCreatingForMod.length > 0) {
        return {
          stimulus: valueCreatingForMod[0],
          reason: `Regel 2 (Keine aktiven Barrieren): Modul "${targetMod.name}" hat noch keinen Treiber (0). Es wird ein unbewerteter wert-schaffender Reiz für dieses Modul vorgeschlagen.`
        };
      }
    }
  }

  // FALLBACK: Nur aus den noch NICHT bewerteten Reizen wählen!
  const unseenValueCreating = unseenStimuli.filter(s => stimulusMatchesFunction(s, 'wert-schaffend'));
  const fallbackChosen = unseenValueCreating[0] || unseenStimuli[0];
  return {
    stimulus: fallbackChosen,
    reason: 'Weiterführender noch unbewerteter Reiz zur Vertiefung der Konsumentenwahrnehmung.'
  };
}

// ==========================================
// NAVIGATION ZWISCHEN DEN SEITEN
// ==========================================

function renderHomeDashboard() {
  if (!homeBentoGrid) return;
  homeBentoGrid.innerHTML = '';

  const totalEvaluations = allEvaluations.length;
  const totalProfiles = profiles.length;
  const realProfilesCount = profiles.filter(p => p.dataType === 'real').length;
  const fictionalProfilesCount = totalProfiles - realProfilesCount;

  const evaluatedProfileIds = new Set(allEvaluations.map(ev => ev.profileId));
  const evaluatedPeopleCount = evaluatedProfileIds.size;
  const evaluatedRealCount = profiles.filter(p => p.dataType === 'real' && evaluatedProfileIds.has(p.id)).length;
  const evaluatedFictionalCount = evaluatedPeopleCount - evaluatedRealCount;

  const uniqueStimuliEvaluated = new Set(allEvaluations.map(ev => ev.stimulusId)).size;
  const totalStimuli = stimuli.length;

  const avgPerPerson = evaluatedPeopleCount > 0
    ? (totalEvaluations / evaluatedPeopleCount).toFixed(1)
    : '0.0';

  let totalLegit = 0;
  let totalDrivers = 0;
  let totalBarriers = 0;
  let acceptanceChanges = 0;

  const moduleActivity = {};
  MODULES.forEach(m => {
    moduleActivity[m.id] = { legit: 0, driver: 0, barrier: 0, total: 0 };
  });

  allEvaluations.forEach(ev => {
    if (ev.acceptanceChanged) acceptanceChanges += 1;
    Object.entries(ev.moduleActions || {}).forEach(([modIdStr, act]) => {
      const mId = Number(modIdStr);
      if (!moduleActivity[mId] || !act) return;
      const lCount = Array.isArray(act.legitimizedBarrierIds) ? act.legitimizedBarrierIds.length : 0;
      if (lCount > 0) {
        totalLegit += lCount;
        moduleActivity[mId].legit += lCount;
        moduleActivity[mId].total += lCount;
      }
      if (act.addDriver) {
        totalDrivers += 1;
        moduleActivity[mId].driver += 1;
        moduleActivity[mId].total += 1;
      }
      if (act.addBarrier) {
        totalBarriers += 1;
        moduleActivity[mId].barrier += 1;
        moduleActivity[mId].total += 1;
      }
    });
  });

  const totalReactions = totalLegit + totalDrivers + totalBarriers;
  const legitPct = totalReactions > 0 ? Math.round((totalLegit / totalReactions) * 100) : 0;
  const driverPct = totalReactions > 0 ? Math.round((totalDrivers / totalReactions) * 100) : 0;
  const barrierPct = totalReactions > 0 ? Math.max(0, 100 - legitPct - driverPct) : 0;

  // 1. BENTO-MODUL: DATEN-ÜBERSICHT (Aufgeräumt, Details hinter Hover-Icons)
  const coveragePct = totalStimuli > 0 ? Math.round((uniqueStimuliEvaluated / totalStimuli) * 100) : 0;
  const dataCard = document.createElement('section');
  dataCard.className = 'bento-card bento-span-2';
  dataCard.innerHTML = `
    <div class="bento-card-header">
      <span class="caption-label">DATEN &amp; ERHEBUNGS-ÜBERSICHT</span>
      <span class="info-hover" tabindex="0">
        ${ICONS.informationSm}
        <span class="info-popover">
          <div>Katalog: ${totalStimuli} Reize (${coveragePct}% abgedeckt)</div>
          <div>Reaktionen gesamt: ${totalReactions} Aktionen</div>
          <div>Akzeptanz-Wechsel: ${acceptanceChanges}x</div>
        </span>
      </span>
    </div>
    <div class="bento-kpi-grid">
      <div class="bento-kpi-box">
        <div class="bento-kpi-top">
          <span class="caption-label">REIZE BEWERTET</span>
          <span class="info-hover" tabindex="0">
            ${ICONS.informationSm}
            <span class="info-popover">${uniqueStimuliEvaluated} von ${totalStimuli} verschiedenen Reizen getestet (${coveragePct}% Abdeckung)</span>
          </span>
        </div>
        <div class="bento-kpi-value">${totalEvaluations}</div>
      </div>
      <div class="bento-kpi-box">
        <div class="bento-kpi-top">
          <span class="caption-label">AKTIVE PERSONEN</span>
          <span class="info-hover" tabindex="0">
            ${ICONS.informationSm}
            <span class="info-popover">${evaluatedPeopleCount} von ${totalProfiles} Profilen aktiv (${evaluatedRealCount} real · ${evaluatedFictionalCount} fiktiv)</span>
          </span>
        </div>
        <div class="bento-kpi-value">${evaluatedPeopleCount}</div>
      </div>
      <div class="bento-kpi-box">
        <div class="bento-kpi-top">
          <span class="caption-label">Ø PRO PERSON</span>
          <span class="info-hover" tabindex="0">
            ${ICONS.informationSm}
            <span class="info-popover">Durchschnittlich bewertete Reize bei aktiven Testpersonen</span>
          </span>
        </div>
        <div class="bento-kpi-value">${avgPerPerson}</div>
      </div>
      <div class="bento-kpi-box">
        <div class="bento-kpi-top">
          <span class="caption-label">PROFILE GESAMT</span>
          <span class="info-hover" tabindex="0">
            ${ICONS.informationSm}
            <span class="info-popover">${realProfilesCount} reale Profile · ${fictionalProfilesCount} fiktive Profile angelegt</span>
          </span>
        </div>
        <div class="bento-kpi-value">${totalProfiles}</div>
      </div>
    </div>
  `;

  // 2. BENTO-MODUL: WIRKUNGSVERTEILUNG & AKZEPTANZ
  const tryCount = profiles.filter(p => (p.acceptance || '').includes('Try')).length;
  const buyCount = profiles.filter(p => (p.acceptance || '').includes('Buy')).length;
  const adoptCount = profiles.filter(p => (p.acceptance || '').includes('Adopt')).length;
  const noneCount = totalProfiles - tryCount - buyCount - adoptCount;

  const impactCard = document.createElement('section');
  impactCard.className = 'bento-card';
  impactCard.innerHTML = `
    <div class="bento-card-header">
      <span class="caption-label">REAKTIONEN &amp; AKZEPTANZ</span>
      <span class="info-hover" tabindex="0">
        ${ICONS.informationSm}
        <span class="info-popover">
          <div>Legitimation (0): ${totalLegit}x (${legitPct}%)</div>
          <div>Treiber (+1): ${totalDrivers}x (${driverPct}%)</div>
          <div>Barriere (-1): ${totalBarriers}x (${barrierPct}%)</div>
          <div style="margin-top:4px;">Ohne Akzeptanz-Auswahl: ${noneCount}</div>
        </span>
      </span>
    </div>
    <div>
      <div class="bento-bar-track">
        <div class="bento-bar-seg-legit" style="width:${legitPct}%" title="Legitimation: ${totalLegit}"></div>
        <div class="bento-bar-seg-driver" style="width:${driverPct}%" title="Treiber: ${totalDrivers}"></div>
        <div class="bento-bar-seg-barrier" style="width:${barrierPct}%" title="Barrieren: ${totalBarriers}"></div>
      </div>
    </div>
    <div class="bento-stat-list">
      <div class="bento-stat-row">
        <span>Legitimationen</span>
        <strong>${totalLegit}</strong>
      </div>
      <div class="bento-stat-row">
        <span>Treiber</span>
        <strong>${totalDrivers}</strong>
      </div>
      <div class="bento-stat-row">
        <span>Barrieren</span>
        <strong>${totalBarriers}</strong>
      </div>
    </div>
    <div class="bento-acceptance-pills">
      <span class="caption-tag">TRY: ${tryCount}</span>
      <span class="caption-tag">BUY: ${buyCount}</span>
      <span class="caption-tag">ADOPT: ${adoptCount}</span>
    </div>
  `;

  // 3. BENTO-MODUL: BEWERTUNGSAKTIVITÄT PRO PERSON
  const peopleActivityRows = profiles.map(p => {
    const count = (p.stimulusEvaluations || []).length;
    const acc = formatAcceptanceShort(p.acceptance) || 'Keine Auswahl';
    const typeLabel = p.dataType === 'real' ? 'Reales Profil' : 'Fiktives Profil';
    return `
      <div class="bento-stat-row">
        <span>${p.firstName} ${p.lastName}</span>
        <span class="bento-row-right">
          <strong>${count}</strong>
          <span class="info-hover" tabindex="0">
            ${ICONS.informationSm}
            <span class="info-popover">${typeLabel} · Akzeptanz: ${acc}${p.personaRole ? ` · ${p.personaRole}` : ''}</span>
          </span>
        </span>
      </div>
    `;
  }).join('');

  const peopleCard = document.createElement('section');
  peopleCard.className = 'bento-card';
  peopleCard.innerHTML = `
    <div class="bento-card-header">
      <span class="caption-label">BEWERTUNGEN PRO PERSON</span>
    </div>
    <div class="bento-stat-list">
      ${peopleActivityRows || '<span class="caption-text">Noch keine Profile vorhanden.</span>'}
    </div>
  `;

  // 4. BENTO-MODUL: MODUL-AKTIVITÄT (1–6)
  const moduleRows = MODULES.map(m => {
    const act = moduleActivity[m.id];
    return `
      <div class="bento-stat-row">
        <span>${m.name}</span>
        <span class="bento-row-right">
          <strong>${act.total}</strong>
          <span class="info-hover" tabindex="0">
            ${ICONS.informationSm}
            <span class="info-popover">${act.legit}x Legitimation · ${act.driver}x Treiber · ${act.barrier}x Barriere</span>
          </span>
        </span>
      </div>
    `;
  }).join('');

  const modulesCard = document.createElement('section');
  modulesCard.className = 'bento-card bento-span-2';
  modulesCard.innerHTML = `
    <div class="bento-card-header">
      <span class="caption-label">WAHRNEHMUNGSMODULE (1–6)</span>
    </div>
    <div class="bento-stat-list">
      ${moduleRows}
    </div>
  `;

  homeBentoGrid.appendChild(dataCard);
  homeBentoGrid.appendChild(impactCard);
  homeBentoGrid.appendChild(peopleCard);
  homeBentoGrid.appendChild(modulesCard);
}

function switchView(viewName) {
  if (viewHome) viewHome.style.display = 'none';
  viewProfiles.style.display = 'none';
  viewEvaluation.style.display = 'none';
  if (viewDecisionTree) viewDecisionTree.style.display = 'none';
  viewStimuli.style.display = 'none';
  if (navBtnHome) navBtnHome.classList.remove('active');
  navBtnProfiles.classList.remove('active');
  navBtnEvaluation.classList.remove('active');
  if (navBtnDecisionTree) navBtnDecisionTree.classList.remove('active');
  navBtnStimuli.classList.remove('active');

  if (viewName === 'home') {
    if (viewHome) viewHome.style.display = 'block';
    if (navBtnHome) navBtnHome.classList.add('active');
    renderHomeDashboard();
  } else if (viewName === 'evaluation') {
    viewEvaluation.style.display = 'block';
    navBtnEvaluation.classList.add('active');
    renderEvaluationView();
  } else if (viewName === 'decision-tree') {
    if (viewDecisionTree) viewDecisionTree.style.display = 'block';
    if (navBtnDecisionTree) navBtnDecisionTree.classList.add('active');
    initDecisionTreeSession(false);
    renderDecisionTreeView();
  } else if (viewName === 'stimuli') {
    viewStimuli.style.display = 'block';
    navBtnStimuli.classList.add('active');
    renderStimuliSidebar();
  } else {
    viewProfiles.style.display = 'flex';
    navBtnProfiles.classList.add('active');
    if (currentProfileId) {
      selectProfile(currentProfileId);
    } else {
      updateProfileModulesSummaryFromForm();
    }
  }
}

if (navBtnHome) navBtnHome.addEventListener('click', () => switchView('home'));
navBtnProfiles.addEventListener('click', () => switchView('profiles'));
navBtnEvaluation.addEventListener('click', () => switchView('evaluation'));
if (navBtnDecisionTree) navBtnDecisionTree.addEventListener('click', () => switchView('decision-tree'));
navBtnStimuli.addEventListener('click', () => switchView('stimuli'));

// ==========================================
// PROFILSEITE: KONTEXT-FRAGEN & MODULE
// ==========================================

function renderContextQuestionsForm() {
  contextQuestionsContainer.innerHTML = '';

  CONTEXT_QUESTIONS.forEach(q => {
    const item = document.createElement('div');
    item.className = 'context-question-item';

    const modLabels = q.modules
      .map(id => `Modul ${id}`)
      .join(', ');

    // Fragetext mit Hover-Tooltip für Titel, Kategorie & Wirkungsmodule
    const questionWrapper = document.createElement('div');
    questionWrapper.className = 'context-question-wrapper';
    questionWrapper.setAttribute('tabindex', '0');
    questionWrapper.innerHTML = `
      <span class="context-question-text">${q.question}</span>
      <span class="context-question-tooltip">
        <strong>${q.title}</strong>
        <span class="context-question-sub">${q.category} · Wirkt auf: ${modLabels}</span>
      </span>
    `;

    // 3 Icons rechts: Negativ (-), Neutral (), Positiv (+)
    const actionsRow = document.createElement('div');
    actionsRow.className = 'context-question-actions';

    const choiceDefs = [
      {
        val: -1,
        cls: 'choice-neg',
        title: q.labels['-1'],
        iconSvg: `<svg class="carbon-icon" viewBox="0 0 32 32" aria-hidden="true"><path d="M16,4c6.6,0,12,5.4,12,12s-5.4,12-12,12S4,22.6,4,16S9.4,4,16,4 M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14S23.7,2,16,2z"/><path d="M8 15H24V17H8z"/></svg>`
      },
      {
        val: 0,
        cls: 'choice-neu',
        title: q.labels['0'],
        iconSvg: `<svg class="carbon-icon" viewBox="0 0 32 32" aria-hidden="true"><path d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,26A12,12,0,1,1,28,16,12,12,0,0,1,16,28Z"/></svg>`
      },
      {
        val: 1,
        cls: 'choice-pos',
        title: q.labels['1'],
        iconSvg: `<svg class="carbon-icon" viewBox="0 0 32 32" aria-hidden="true"><path d="M16,4c6.6,0,12,5.4,12,12s-5.4,12-12,12S4,22.6,4,16S9.4,4,16,4 M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14S23.7,2,16,2z"/><path d="M24 15 17 15 17 8 15 8 15 15 8 15 8 17 15 17 15 24 17 24 17 17 24 17z"/></svg>`
      }
    ];

    choiceDefs.forEach(def => {
      const label = document.createElement('label');
      label.className = `context-icon-choice ${def.cls}`;
      label.title = def.title;
      label.setAttribute('aria-label', def.title);

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `ctx_${q.id}`;
      input.value = String(def.val);
      input.className = 'sr-only';
      if (def.val === 0) input.checked = true;

      input.addEventListener('change', () => {
        actionsRow.querySelectorAll('.context-icon-choice').forEach(c => c.classList.remove('active'));
        label.classList.add('active');
        updateProfileModulesSummaryFromForm();
      });

      label.appendChild(input);
      label.insertAdjacentHTML('beforeend', def.iconSvg);
      if (def.val === 0) label.classList.add('active');

      actionsRow.appendChild(label);
    });

    item.appendChild(questionWrapper);
    item.appendChild(actionsRow);
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

  // Aktive Klassen für Labels synchronisieren
  if (contextQuestionsContainer) {
    contextQuestionsContainer.querySelectorAll('.context-question-item').forEach(item => {
      const checkedRadio = item.querySelector('input[type="radio"]:checked');
      item.querySelectorAll('.context-icon-choice').forEach(c => c.classList.remove('active'));
      if (checkedRadio) {
        const parentLabel = checkedRadio.closest('.context-icon-choice');
        if (parentLabel) parentLabel.classList.add('active');
      }
    });
  }
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

function createBarrierTokenElement({ barrier, isAlreadyLegitimized, isSelectedNow, currentStimLabel, onToggleLegit }) {
  const isLifted = isAlreadyLegitimized || isSelectedNow;
  const wrap = document.createElement('div');
  wrap.className = `barrier-token-wrapper ${isLifted ? 'has-legitimation' : ''}`;

  const barrierCircle = document.createElement('button');
  barrierCircle.type = 'button';
  barrierCircle.className = `barrier-circle ${isAlreadyLegitimized || !onToggleLegit ? 'readonly' : ''}`;
  barrierCircle.setAttribute('aria-label', `Barriere: ${barrier.label}`);

  const barrierHover = document.createElement('span');
  barrierHover.className = 'token-hover-label';
  barrierHover.textContent = `Barriere: ${barrier.label}`;
  barrierCircle.appendChild(barrierHover);

  wrap.appendChild(barrierCircle);

  if (isLifted) {
    const legitCircle = document.createElement('button');
    legitCircle.type = 'button';
    legitCircle.className = `barrier-legit-circle ${isAlreadyLegitimized || !onToggleLegit ? 'readonly' : ''}`;

    const legitTitle = isSelectedNow
      ? `Legitimation: ${currentStimLabel}`
      : `Legitimation: ${barrier.legitimizedBy?.stimulusLabel || 'Ausgeglichen'}`;

    legitCircle.setAttribute('aria-label', legitTitle);

    const legitHover = document.createElement('span');
    legitHover.className = 'token-hover-label';
    legitHover.textContent = legitTitle;
    legitCircle.appendChild(legitHover);

    if (!isAlreadyLegitimized && onToggleLegit) {
      legitCircle.addEventListener('click', onToggleLegit);
    }
    wrap.appendChild(legitCircle);
  }

  if (!isAlreadyLegitimized && onToggleLegit) {
    barrierCircle.addEventListener('click', onToggleLegit);
  }

  return wrap;
}

function createDriverTokenElement({ label, isPending, onTogglePending }) {
  const wrap = document.createElement('div');
  wrap.className = 'driver-token-wrapper';

  const driverCircle = document.createElement('button');
  driverCircle.type = 'button';
  driverCircle.className = `driver-circle ${!onTogglePending ? 'readonly' : ''}`;
  driverCircle.setAttribute('aria-label', `Treiber: ${label}`);

  const hoverLabel = document.createElement('span');
  hoverLabel.className = 'token-hover-label';
  hoverLabel.textContent = `Treiber: ${label}`;
  driverCircle.appendChild(hoverLabel);

  if (onTogglePending) {
    driverCircle.addEventListener('click', onTogglePending);
  }

  wrap.appendChild(driverCircle);
  return wrap;
}

function createPendingBarrierTokenElement({ currentStimLabel, onTogglePending }) {
  const wrap = document.createElement('div');
  wrap.className = 'barrier-token-wrapper';

  const barrierCircle = document.createElement('button');
  barrierCircle.type = 'button';
  barrierCircle.className = 'barrier-circle';
  barrierCircle.setAttribute('aria-label', `Barriere: ${currentStimLabel}`);

  const barrierHover = document.createElement('span');
  barrierHover.className = 'token-hover-label';
  barrierHover.textContent = `Barriere: ${currentStimLabel}`;
  barrierCircle.appendChild(barrierHover);

  if (onTogglePending) {
    barrierCircle.addEventListener('click', onTogglePending);
  }

  wrap.appendChild(barrierCircle);
  return wrap;
}

function renderModuleCardsIntoContainer(container, stats) {
  if (!container) return;
  container.innerHTML = '';

  MODULES.forEach(m => {
    const s = stats[m.id];
    const card = document.createElement('div');
    card.className = 'module-visual-card';
    card.style.minHeight = '104px';
    card.style.paddingBottom = '12px';

    const titleEl = document.createElement('div');
    titleEl.className = 'module-visual-title';
    titleEl.textContent = m.name;

    const tokensArea = document.createElement('div');
    tokensArea.className = 'module-tokens-area';

    // Vorhandene Barrieren als rote Kreise (und falls bereits legitimiert mit versetztem Kreis darüber)
    s.barrierItems.forEach(barrier => {
      const token = createBarrierTokenElement({
        barrier,
        isAlreadyLegitimized: Boolean(barrier.legitimizedBy),
        isSelectedNow: false,
        currentStimLabel: '',
        onToggleLegit: null
      });
      tokensArea.appendChild(token);
    });

    // Vorhandene Treiber als grüne Kreise mit Hover-Label
    s.driverItems.forEach(driver => {
      const token = createDriverTokenElement({
        label: driver.label,
        isPending: false,
        onTogglePending: null
      });
      tokensArea.appendChild(token);
    });

    card.appendChild(titleEl);
    card.appendChild(tokensArea);
    container.appendChild(card);
  });
}

function updateProfileModulesSummaryFromForm() {
  const existingProfile = profiles.find(p => p.id === currentProfileId);
  const draftProfile = {
    contextAnswers: getContextAnswersFromForm(),
    stimulusEvaluations: existingProfile ? existingProfile.stimulusEvaluations : []
  };

  const stats = computeModuleStats(draftProfile);
  renderModuleCardsIntoContainer(profileEvalModulesSummary, stats);
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
    btnAvatarRemove.style.display = 'inline-flex';
  } else {
    avatarPreview.src = '';
    avatarPreview.style.display = 'none';
    avatarPlaceholder.style.display = 'flex';
    btnAvatarRemove.style.display = 'none';
  }
  updateHeaderProfileDisplay();
}

function updateDatatypeSymbol(dataType) {
  if (!displayDatatypeEl) return;
  if (dataType === 'real') {
    displayDatatypeEl.className = 'datatype-symbol is-real';
    displayDatatypeEl.title = 'Reale Daten';
    displayDatatypeEl.setAttribute('aria-label', 'Reale Daten');
    displayDatatypeEl.innerHTML = `
      <svg class="carbon-icon" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16,4a5,5,0,1,1-5,5,5,5,0,0,1,5-5m0-2a7,7,0,1,0,7,7A7,7,0,0,0,16,2Z"/>
        <path d="M26,30H24V25a5,5,0,0,0-5-5H13a5,5,0,0,0-5,5v5H6V25a7,7,0,0,1,7-7h6a7,7,0,0,1,7,7Z"/>
      </svg>
      <span class="datatype-tooltip">Reale Daten</span>
    `;
  } else if (dataType === 'fictional') {
    displayDatatypeEl.className = 'datatype-symbol is-fictional';
    displayDatatypeEl.title = 'Fiktive Daten';
    displayDatatypeEl.setAttribute('aria-label', 'Fiktive Daten');
    displayDatatypeEl.innerHTML = `
      <svg class="carbon-icon" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M25.232 12.866H29.232V14.866H25.232z" transform="rotate(30 27.232 13.866)"/>
        <path d="M26 8H30V10H26z"/>
        <path d="M2.768 12.866H6.768V14.866H2.768z" transform="rotate(150 4.768 13.866)"/>
        <path d="M26,30H24V25a5.0059,5.0059,0,0,0-5-5H13a5.0059,5.0059,0,0,0-5,5v5H6V25a7.0082,7.0082,0,0,1,7-7h6a7.0082,7.0082,0,0,1,7,7Z"/>
        <path d="M16,4a5,5,0,1,1-5,5,5,5,0,0,1,5-5m0-2a7,7,0,1,0,7,7A7,7,0,0,0,16,2Z"/>
        <path d="M25.232 3.134H29.232V5.134H25.232z" transform="rotate(-30 27.232 4.134)"/>
        <path d="M2 8H6V10H2z"/>
        <path d="M2.768 3.134H6.768V5.134H2.768z" transform="rotate(210 4.768 4.134)"/>
      </svg>
      <span class="datatype-tooltip">Fiktive Daten</span>
    `;
  } else {
    displayDatatypeEl.className = 'datatype-symbol is-new';
    displayDatatypeEl.title = 'Wird beim Speichern festgelegt';
    displayDatatypeEl.setAttribute('aria-label', 'Wird beim Speichern festgelegt');
    displayDatatypeEl.innerHTML = `
      <svg class="carbon-icon" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16,4a5,5,0,1,1-5,5,5,5,0,0,1,5-5m0-2a7,7,0,1,0,7,7A7,7,0,0,0,16,2Z"/>
        <path d="M26,30H24V25a5,5,0,0,0-5-5H13a5,5,0,0,0-5,5v5H6V25a7,7,0,0,1,7-7h6a7,7,0,0,1,7,7Z"/>
      </svg>
      <span class="datatype-tooltip">Wird beim Speichern festgelegt</span>
    `;
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
    renderStimulusModuleCheckboxes();
    const [profRes, stimRes, evalRes] = await Promise.all([
      fetch('/api/profiles'),
      fetch('/api/stimuli'),
      fetch('/api/evaluations')
    ]);
    if (!profRes.ok) throw new Error('Konnte Profile nicht laden');
    if (!stimRes.ok) throw new Error('Konnte Reize nicht laden');

    profiles = await profRes.json();
    stimuli = await stimRes.json();
    allEvaluations = evalRes && evalRes.ok ? await evalRes.json() : [];

    renderSidebar();
    renderStimuliSidebar();
    renderHomeDashboard();

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

async function fetchEvaluations() {
  try {
    const res = await fetch('/api/evaluations');
    if (res.ok) {
      allEvaluations = await res.json();
      renderHomeDashboard();
      renderStimuliSidebar();
    }
  } catch (err) {
    console.error('Fehler beim Abrufen der Reizbewertungen:', err);
  }
}

async function fetchProfiles() {
  const res = await fetch('/api/profiles');
  if (!res.ok) throw new Error('Konnte Profile nicht laden');
  profiles = await res.json();
  renderSidebar();
  renderHomeDashboard();
}

async function fetchStimuli() {
  const res = await fetch('/api/stimuli');
  if (!res.ok) throw new Error('Konnte Reize nicht laden');
  stimuli = await res.json();
  renderStimuliSidebar();
  renderHomeDashboard();
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
    a.href = '#';

    if (profile.avatarUrl) {
      const img = document.createElement('img');
      img.src = profile.avatarUrl;
      img.alt = `${profile.firstName} ${profile.lastName}`;
      img.className = 'sidebar-thumb';
      a.appendChild(img);
    } else {
      const ph = document.createElement('span');
      ph.className = 'sidebar-avatar-placeholder';
      ph.textContent = `${profile.firstName?.charAt(0) || ''}${profile.lastName?.charAt(0) || ''}`.trim() || '?';
      a.appendChild(ph);
    }

    const nameCol = document.createElement('div');
    nameCol.style.display = 'flex';
    nameCol.style.alignItems = 'center';
    nameCol.style.justifyContent = 'space-between';
    nameCol.style.gap = '6px';
    nameCol.style.flex = '1';
    nameCol.style.minWidth = '0';

    const spanText = document.createElement('span');
    spanText.style.fontWeight = '500';
    spanText.style.whiteSpace = 'nowrap';
    spanText.style.overflow = 'hidden';
    spanText.style.textOverflow = 'ellipsis';
    spanText.textContent = `${profile.firstName} ${profile.lastName}`;
    nameCol.appendChild(spanText);

    if (profile.personaRole || profile.acceptance) {
      const infoDetails = [
        profile.personaRole,
        profile.acceptance ? `Akzeptanz: ${profile.acceptance}` : null
      ].filter(Boolean).join(' · ');

      const infoSpan = document.createElement('span');
      infoSpan.className = 'info-hover';
      infoSpan.tabIndex = 0;
      infoSpan.innerHTML = `
        ${ICONS.informationSm}
        <span class="info-popover">${infoDetails}</span>
      `;
      nameCol.appendChild(infoSpan);
    }

    a.appendChild(nameCol);

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
    emptyLi.className = 'caption-text';
    listRealEl.appendChild(emptyLi);
  }

  fictionalProfiles.forEach(p => renderItem(p, listFictionalEl));
  if (fictionalProfiles.length === 0) {
    const emptyLi = document.createElement('li');
    emptyLi.textContent = 'Keine fiktiven Profile';
    emptyLi.className = 'caption-text';
    listFictionalEl.appendChild(emptyLi);
  }

  updateHeaderProfileDisplay();
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

function switchProfileTab(tabName) {
  profileTabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  profileTabPanels.forEach(panel => {
    panel.style.display = (panel.id === `profile-tab-${tabName}`) ? 'block' : 'none';
  });

  const activeProfile = profiles.find(p => p.id === currentProfileId);
  if (tabName === 'reizbewertungen') {
    renderEvaluationHistory(activeProfile);
    updateProfileModulesSummaryFromForm();
  } else if (tabName === 'steckbrief') {
    renderProfileSteckbrief(activeProfile);
  }
}

function renderProfileSteckbrief(profile) {
  if (!steckbriefContainer) return;
  steckbriefContainer.innerHTML = '';

  if (!profile) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'caption-text';
    emptyMsg.style.margin = '20px 0';
    emptyMsg.textContent = 'Kein Profil ausgewählt. Wähle ein Profil aus der Seitenleiste oder lege ein neues an.';
    steckbriefContainer.appendChild(emptyMsg);
    return;
  }

  // Steckbrief: Linke Spalte (Bild + Proxydaten in Caption-Größe) | Rechte Spalte (Name & Beschreibung)
  const card = document.createElement('div');
  card.className = 'steckbrief-card';

  // Linke Spalte
  const leftCol = document.createElement('div');
  leftCol.className = 'steckbrief-left-col';

  // Bild (groß und rund)
  const avatarBox = document.createElement('div');
  avatarBox.className = 'steckbrief-avatar';
  if (profile.avatarUrl) {
    const img = document.createElement('img');
    img.src = profile.avatarUrl;
    img.alt = `${profile.firstName} ${profile.lastName}`;
    avatarBox.appendChild(img);
  } else {
    const initials = document.createElement('span');
    initials.className = 'steckbrief-avatar-initials';
    initials.textContent = `${profile.firstName?.charAt(0) || ''}${profile.lastName?.charAt(0) || ''}`.trim() || '?';
    avatarBox.appendChild(initials);
  }
  leftCol.appendChild(avatarBox);

  // Proxydaten in Caption-Größe unter dem Bild
  const proxyFields = [
    { label: 'Datentyp', value: (profile.dataType === 'real' || profile.dataType === 'reale') ? 'Reale Daten' : (profile.dataType ? 'Fiktive Daten' : null) },
    { label: 'Alter', value: profile.age ? `${profile.age} Jahre` : null },
    { label: 'Geschlecht', value: profile.gender },
    { label: 'Herkunft', value: profile.nationality },
    { label: 'Wohnort', value: profile.countryOfResidence },
    { label: 'Umfeld', value: profile.livingEnvironment },
    { label: 'Wohnform', value: profile.livingSituation },
    { label: 'Familienstand', value: profile.maritalStatus },
    { label: 'Religion', value: profile.religion },
    { label: 'Ernährung', value: profile.dietaryHabits }
  ].filter(item => item.value != null && String(item.value).trim() !== '');

  if (proxyFields.length > 0) {
    const proxyBox = document.createElement('div');
    proxyBox.className = 'steckbrief-proxy-data';
    proxyFields.forEach(item => {
      const row = document.createElement('div');
      row.className = 'steckbrief-proxy-item';
      const labelEl = document.createElement('span');
      labelEl.className = 'steckbrief-proxy-label';
      labelEl.textContent = item.label;
      const valEl = document.createElement('span');
      valEl.className = 'steckbrief-proxy-val';
      valEl.textContent = item.value;
      row.appendChild(labelEl);
      row.appendChild(valEl);
      proxyBox.appendChild(row);
    });
    leftCol.appendChild(proxyBox);
  }

  card.appendChild(leftCol);

  // Rechte Spalte: Name, Rolle & Beschreibung
  const content = document.createElement('div');
  content.className = 'steckbrief-content';

  const nameRow = document.createElement('div');
  nameRow.className = 'steckbrief-header-row';

  const nameTitle = document.createElement('h3');
  nameTitle.className = 'steckbrief-name';
  nameTitle.textContent = `${profile.firstName} ${profile.lastName}`;
  nameRow.appendChild(nameTitle);

  content.appendChild(nameRow);

  if (profile.personaRole) {
    const roleBadge = document.createElement('span');
    roleBadge.className = 'steckbrief-role';
    roleBadge.textContent = profile.personaRole;
    content.appendChild(roleBadge);
  }

  const bio = document.createElement('p');
  bio.className = 'steckbrief-bio';
  if (profile.bio && profile.bio.trim()) {
    bio.textContent = profile.bio;
  } else {
    bio.textContent = 'Keine Beschreibung hinterlegt.';
    bio.style.fontStyle = 'italic';
  }
  content.appendChild(bio);

  card.appendChild(content);
  steckbriefContainer.appendChild(card);
}

function setProxyDetailsCollapsed(collapsed) {
  if (!proxyDetailsContainer || !btnToggleProxyDetails) return;
  proxyDetailsContainer.style.display = collapsed ? 'none' : 'block';
  btnToggleProxyDetails.setAttribute('aria-expanded', String(!collapsed));
  if (textProxyToggle) {
    textProxyToggle.textContent = collapsed
      ? 'Weitere Proxydaten anzeigen'
      : 'Weitere Proxydaten ausblenden';
  }
}

function selectProfile(id) {
  const profile = profiles.find(p => p.id === id);
  if (!profile) return;

  currentProfileId = id;
  renderSidebar();

  const isReal = profile.dataType === 'real';
  formTitleEl.textContent = `${profile.firstName} ${profile.lastName}`;
  
  updateDatatypeSymbol(profile.dataType);

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
  renderEvaluationHistory(profile);
  renderProfileSteckbrief(profile);
  setProxyDetailsCollapsed(true);

  btnDelete.style.display = 'inline-flex';
}

function startNewProfile() {
  currentProfileId = null;
  renderSidebar();

  formTitleEl.textContent = 'Neues Profil';
  updateDatatypeSymbol(null);

  profileForm.reset();
  profileForm.querySelectorAll('option[data-dynamic="true"]').forEach(opt => opt.remove());

  currentAvatarData = null;
  currentAvatarUrl = null;
  avatarDeleted = false;
  avatarStatus.textContent = '';
  updateAvatarDisplay(null);

  setContextAnswersInForm({});
  setAcceptanceInForm('');
  updateProfileModulesSummaryFromForm();
  renderEvaluationHistory(null);
  renderProfileSteckbrief(null);
  switchProfileTab('personendaten');
  setProxyDetailsCollapsed(true);

  btnDelete.style.display = 'none';
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
    showStatus(`Profil "${saved.firstName} ${saved.lastName}" (${typeLabel}) erfolgreich gespeichert.`);
    currentProfileId = saved.id;
    await fetchProfiles();
    selectProfile(saved.id);
  } catch (err) {
    showStatus(err.message, true);
  }
}

async function handleDelete() {
  if (!currentProfileId) return;
  const activeProfile = profiles.find(p => p.id === currentProfileId);
  const nameLabel = activeProfile ? `${activeProfile.firstName} ${activeProfile.lastName}` : 'dieses Profil';

  const confirmed = window.confirm(`Möchtest du das Profil "${nameLabel}" wirklich löschen?`);
  if (!confirmed) return;

  try {
    const res = await fetch(`/api/profiles/${encodeURIComponent(currentProfileId)}`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Fehler beim Löschen');
    }

    showStatus(`Profil "${nameLabel}" gelöscht.`);
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

function extractIframeSrc(rawInput) {
  if (!rawInput) return '';
  const trimmed = rawInput.trim();
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    return srcMatch[1];
  }
  return trimmed;
}

function renderStimulusMediaInto(containerEl, stim) {
  containerEl.innerHTML = '';
  if (!stim) return;

  const imageUrl = (stim.imageUrl || '').trim();
  const iframeSrc = extractIframeSrc(stim.iframeUrl || '');

  if (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = stim.name || '';
    img.className = 'stim-media-image';
    containerEl.appendChild(img);
  }

  if (iframeSrc) {
    const iframe = document.createElement('iframe');
    iframe.src = iframeSrc;
    iframe.className = 'stim-media-iframe';
    iframe.loading = 'lazy';
    iframe.setAttribute('allowfullscreen', '');
    containerEl.appendChild(iframe);
  }
}

function formatAcceptanceShort(level) {
  if (!level) return '';
  if (level.includes('Try')) return 'TRY';
  if (level.includes('Buy')) return 'BUY';
  if (level.includes('Adopt')) return 'ADOPT';
  return level;
}

function updateHeaderProfileDisplay() {
  if (!headerProfileSelect) return;
  const activeProfile = profiles.find(p => p.id === currentProfileId) || profiles[0];

  headerProfileSelect.innerHTML = '';
  profiles.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.firstName} ${p.lastName} (${p.dataType === 'real' ? 'Real' : 'Fiktiv'})`;
    headerProfileSelect.appendChild(opt);
  });

  if (activeProfile) {
    headerProfileSelect.value = activeProfile.id;
    if (headerProfileName) {
      headerProfileName.textContent = `${activeProfile.firstName} ${activeProfile.lastName}`;
    }
    if (activeProfile.avatarUrl) {
      if (headerAvatarImg) {
        headerAvatarImg.src = activeProfile.avatarUrl;
        headerAvatarImg.style.display = 'block';
      }
      if (headerAvatarInitials) {
        headerAvatarInitials.style.display = 'none';
      }
    } else {
      if (headerAvatarImg) {
        headerAvatarImg.style.display = 'none';
      }
      if (headerAvatarInitials) {
        const initials = ((activeProfile.firstName?.[0] || '') + (activeProfile.lastName?.[0] || '')).toUpperCase() || '--';
        headerAvatarInitials.textContent = initials;
        headerAvatarInitials.style.display = 'inline';
      }
    }
  } else {
    if (headerProfileName) headerProfileName.textContent = 'Kein Profil';
    if (headerAvatarImg) headerAvatarImg.style.display = 'none';
    if (headerAvatarInitials) {
      headerAvatarInitials.textContent = '--';
      headerAvatarInitials.style.display = 'inline';
    }
  }
}

function updateAcceptanceButtonsUI() {
  evalAcceptanceButtons.forEach(btn => {
    if (btn.dataset.level === currentEvaluationAcceptance) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function hideEvaluationModules() {
  if (evalModulesWrapper) evalModulesWrapper.style.display = 'none';
  if (btnRevealModules) {
    const hasStimulus = Boolean(stimuli.find(s => s.id === currentStimulusId));
    btnRevealModules.style.display = hasStimulus ? 'inline-flex' : 'none';
  }
}

function showEvaluationModules() {
  if (evalModulesWrapper) evalModulesWrapper.style.display = 'block';
  if (btnRevealModules) btnRevealModules.style.display = 'none';
}

function renderEvaluationView(keepCurrentStimulus = false) {
  if (!currentProfileId && profiles.length > 0) {
    currentProfileId = profiles[0].id;
  }

  const activeProfile = profiles.find(p => p.id === currentProfileId) || profiles[0];
  if (activeProfile) {
    currentProfileId = activeProfile.id;
    currentEvaluationAcceptance = activeProfile.acceptance || '';
    initialEvalAcceptance = activeProfile.acceptance || '';
    updateAcceptanceButtonsUI();
  }

  updateHeaderProfileDisplay();

  // Algorithmus-Empfehlung bestimmen
  const recommendation = recommendNextStimulus(activeProfile);
  if (!keepCurrentStimulus || !currentStimulusId) {
    currentStimulusId = recommendation.stimulus ? recommendation.stimulus.id : (stimuli[0]?.id || null);
    currentStimulusAlgoReason = recommendation.reason;
  }

  // Eingangs immer Module ausblenden & nur Aufforderung mit Einordnen-Button zeigen
  hideEvaluationModules();

  renderCurrentStimulusCard();
  renderEvaluationModulesGrid(activeProfile);
  renderEvaluationHistory(activeProfile);
}

function renderCurrentStimulusCard() {
  const stim = stimuli.find(s => s.id === currentStimulusId);
  if (!stim) {
    stimCategoryEl.textContent = '-';
    stimNameEl.textContent = 'Alle Reize bewertet';
    stimMediaContainerEl.innerHTML = '';
    stimContentEl.textContent = 'Für dieses Profil wurden bereits alle vorhandenen Reize einmal bewertet.';
    stimContentEl.style.display = 'block';
    stimFunctionEl.textContent = '-';
    if (stimModulesDisplay) stimModulesDisplay.textContent = '-';
    if (stimAlgoReason) stimAlgoReason.textContent = currentStimulusAlgoReason || 'Keine weiteren Reize offen.';
    if (btnSubmitEvaluation) btnSubmitEvaluation.disabled = true;
    if (btnRevealModules) btnRevealModules.style.display = 'none';
    if (evalModulesWrapper) evalModulesWrapper.style.display = 'none';
    return;
  }

  if (btnSubmitEvaluation) btnSubmitEvaluation.disabled = false;

  if (stimCategoryEl) stimCategoryEl.textContent = stim.category || '';
  stimNameEl.textContent = stim.name;
  stimFunctionEl.textContent = getStimulusFunctionsDisplay(stim);

  if (stimModulesDisplay) {
    const modNames = (stim.primaryModules || [])
      .map(mId => MODULES.find(m => m.id === mId)?.name || `Modul ${mId}`)
      .join(', ');
    stimModulesDisplay.textContent = modNames || 'Keine Angabe';
  }

  if (stimAlgoReason) {
    stimAlgoReason.textContent = currentStimulusAlgoReason || 'Automatische Auswahl nach IPS-Regeln';
  }

  renderStimulusMediaInto(stimMediaContainerEl, stim);

  if (stim.content) {
    stimContentEl.textContent = stim.content;
    stimContentEl.style.display = 'block';
  } else {
    stimContentEl.textContent = '';
    stimContentEl.style.display = 'none';
  }
}

/**
 * Rendert die 6 Bewertungsmodule minimalistisch & visuell:
 * - Kleiner Modultitel (Caption)
 * - Vorhandene & angeklickte Barrieren als rote Kreise im Modul (Hover zeigt Bezeichnung)
 * - Vorhandene & angeklickte Legitimierungen als leicht versetzter, transparenter Kreis darüber (Hover zeigt Bezeichnung)
 * - Vorhandene & angeklickte Treiber als grüne Kreise im Modul (Hover zeigt Bezeichnung)
 * - Unten links: roter Kreis zum Auswählen einer Barriere (-1)
 * - Unten rechts: grüner Kreis zum Auswählen eines Treibers (+1)
 */
function renderEvaluationModulesGrid(activeProfile) {
  evalModulesGrid.innerHTML = '';
  const stats = computeModuleStats(activeProfile);
  const currentStim = stimuli.find(s => s.id === currentStimulusId);
  const currentStimLabel = currentStim ? currentStim.name : 'Aktueller Reiz';

  const refreshGridAndOutlook = () => {
    renderEvaluationModulesGrid(activeProfile);
    renderEvaluationHistory(activeProfile);
  };

  MODULES.forEach(m => {
    const s = stats[m.id];
    const action = getPendingAction(m.id);

    // Gültigkeit der ausgewählten Legitimationen sicherstellen
    const activeIdsSet = new Set(s.activeBarrierItems.map(b => b.id));
    action.legitimizedBarrierIds = action.legitimizedBarrierIds.filter(id => activeIdsSet.has(id));

    const card = document.createElement('div');
    card.className = 'module-visual-card';

    // 1. Kleiner Modultitel
    const titleEl = document.createElement('div');
    titleEl.className = 'module-visual-title';
    titleEl.textContent = m.name;

    // 2. Bereich für Token im Modul: Barrieren, Legitimierungen und Treiber
    const tokensArea = document.createElement('div');
    tokensArea.className = 'module-tokens-area';

    // A) Vorhandene Barrieren im Modul (inkl. vorhandener oder aktuell angeklickter Legitimationen)
    s.barrierItems.forEach(barrier => {
      const isAlreadyLegitimized = Boolean(barrier.legitimizedBy);
      const isSelectedNow = action.legitimizedBarrierIds.includes(barrier.id);

      const token = createBarrierTokenElement({
        barrier,
        isAlreadyLegitimized,
        isSelectedNow,
        currentStimLabel,
        onToggleLegit: () => {
          const pos = action.legitimizedBarrierIds.indexOf(barrier.id);
          if (pos >= 0) {
            action.legitimizedBarrierIds.splice(pos, 1);
          } else {
            action.legitimizedBarrierIds.push(barrier.id);
          }
          refreshGridAndOutlook();
        }
      });
      tokensArea.appendChild(token);
    });

    // B) Aktuell angeklickte neue Barriere durch diesen Reiz
    if (action.addBarrier) {
      const pendingBarrierToken = createPendingBarrierTokenElement({
        currentStimLabel,
        onTogglePending: () => {
          action.addBarrier = false;
          refreshGridAndOutlook();
        }
      });
      tokensArea.appendChild(pendingBarrierToken);
    }

    // C) Bereits vorhandene Treiber im Modul
    s.driverItems.forEach(driver => {
      const token = createDriverTokenElement({
        label: driver.label,
        isPending: false,
        onTogglePending: null
      });
      tokensArea.appendChild(token);
    });

    // D) Aktuell angeklickter neuer Treiber durch diesen Reiz
    if (action.addDriver) {
      const pendingDriverToken = createDriverTokenElement({
        label: currentStimLabel,
        isPending: true,
        onTogglePending: () => {
          action.addDriver = false;
          refreshGridAndOutlook();
        }
      });
      tokensArea.appendChild(pendingDriverToken);
    }

    // 3. Unten links: roter Kreis zum Auswählen für eine Barriere
    const btnSelectBarrier = document.createElement('button');
    btnSelectBarrier.type = 'button';
    btnSelectBarrier.className = `module-corner-select select-barrier ${action.addBarrier ? 'active' : ''}`;
    btnSelectBarrier.setAttribute('aria-label', 'Barriere auswählen');
    btnSelectBarrier.addEventListener('click', () => {
      action.addBarrier = !action.addBarrier;
      refreshGridAndOutlook();
    });

    // 4. Unten rechts: grüner Kreis zum Auswählen eines Treibers
    const btnSelectDriver = document.createElement('button');
    btnSelectDriver.type = 'button';
    btnSelectDriver.className = `module-corner-select select-driver ${action.addDriver ? 'active' : ''}`;
    btnSelectDriver.setAttribute('aria-label', 'Treiber auswählen');
    btnSelectDriver.addEventListener('click', () => {
      action.addDriver = !action.addDriver;
      refreshGridAndOutlook();
    });

    card.appendChild(titleEl);
    card.appendChild(tokensArea);
    card.appendChild(btnSelectBarrier);
    card.appendChild(btnSelectDriver);
    evalModulesGrid.appendChild(card);
  });
}

function renderEvaluationHistory(activeProfile) {
  const evals = activeProfile?.stimulusEvaluations || [];
  if (evalHistoryCount) evalHistoryCount.textContent = evals.length;
  if (!evalHistoryList) return;
  evalHistoryList.innerHTML = '';

  if (!activeProfile || evals.length === 0) {
    const li = document.createElement('li');
    li.textContent = activeProfile
      ? 'Noch keine abgeschlossenen Reizbewertungen für dieses Profil.'
      : 'Kein Profil ausgewählt.';
    evalHistoryList.appendChild(li);
    return;
  }
    evals.forEach((ev, idx) => {
      const stim = stimuli.find(s => s.id === ev.stimulusId);
      const stimTitle = stim ? stim.name : 'Reiz';
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

      // Akzeptanz-Veränderung in Historie anzeigen
      let acceptancePart = '';
      if (ev.acceptanceChanged) {
        const from = formatAcceptanceShort(ev.previousAcceptance) || 'Keine';
        const to = formatAcceptanceShort(ev.acceptance) || 'Keine';
        acceptancePart = ` | Akzeptanz: ${from} → ${to}`;
      } else if (ev.acceptance) {
        acceptancePart = ` | Akzeptanz: ${formatAcceptanceShort(ev.acceptance)}`;
      }

      const li = document.createElement('li');
      li.textContent = `${idx + 1}. ${stimTitle} -> ${summaryParts.join(' | ') || 'Keine Modul-Wertung'}${acceptancePart}`;
      evalHistoryList.appendChild(li);
    });

  // Letzter Punkt im Verlauf: "Aktuell" (warum der Algorithmus den aktuellen Reiz zeigt)
  const outlookLi = document.createElement('li');
  outlookLi.className = 'eval-history-outlook';

  const currentStim = stimuli.find(s => s.id === currentStimulusId);
  if (currentStim) {
    outlookLi.innerHTML = `<strong>Aktuell:</strong> ${currentStim.name} [${getStimulusFunctionsDisplay(currentStim)}]<br><span class="caption-text">${currentStimulusAlgoReason || 'Automatische Auswahl nach IPS-Regeln'}</span>`;
  } else {
    outlookLi.innerHTML = `<strong>Aktuell:</strong> Keine weiteren offenen Reize (${currentStimulusAlgoReason || 'Alle Reize bewertet'})`;
  }
  evalHistoryList.appendChild(outlookLi);
}

// Ein- und Ausklappen des Verlaufs
if (btnToggleHistory && evalHistoryBox) {
  btnToggleHistory.addEventListener('click', () => {
    const isCollapsed = evalHistoryBox.classList.toggle('collapsed');
    btnToggleHistory.setAttribute('aria-expanded', String(!isCollapsed));
  });
}

// Header Profil-Auswahl Event Listener
if (headerProfileSelect) {
  headerProfileSelect.addEventListener('change', () => {
    currentProfileId = headerProfileSelect.value;
    selectProfile(currentProfileId);
    resetPendingActions();
    if (viewEvaluation && viewEvaluation.style.display !== 'none') {
      renderEvaluationView(false);
    }
    if (viewDecisionTree && viewDecisionTree.style.display !== 'none') {
      initDecisionTreeSession(true);
      renderDecisionTreeView();
    }
  });
}

// Reizbewertung: Module einblenden per Button
if (btnRevealModules) {
  btnRevealModules.addEventListener('click', () => {
    showEvaluationModules();
  });
}

// Akzeptanz-Buttons (TRY, BUY, ADOPT) Event Listener
evalAcceptanceButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const level = btn.dataset.level;
    if (currentEvaluationAcceptance === level) {
      currentEvaluationAcceptance = '';
    } else {
      currentEvaluationAcceptance = level;
    }
    updateAcceptanceButtonsUI();
  });
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

  const previousAcceptance = initialEvalAcceptance || '';
  const newAcceptance = currentEvaluationAcceptance || '';
  const acceptanceChanged = (previousAcceptance !== newAcceptance);

  const newEvalEntry = {
    stimulusId: currentStimulusId,
    timestamp: new Date().toISOString(),
    moduleActions: cleanedModuleActions,
    acceptance: newAcceptance || null,
    previousAcceptance: previousAcceptance || null,
    acceptanceChanged: acceptanceChanged
  };

  const updatedEvaluations = [...(activeProfile.stimulusEvaluations || []), newEvalEntry];

  try {
    btnSubmitEvaluation.disabled = true;
    const res = await fetch(`/api/profiles/${encodeURIComponent(activeProfile.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...activeProfile,
        acceptance: newAcceptance,
        stimulusEvaluations: updatedEvaluations
      })
    });

    if (!res.ok) {
      throw new Error('Fehler beim Speichern der Reizbewertung');
    }

    resetPendingActions();
    await fetchProfiles();
    await fetchEvaluations();
    renderEvaluationView(false); // Lädt automatisch den nächsten vom Algorithmus empfohlenen Reiz!

    evalStatusMsg.textContent = '✓ Bewertung gespeichert & nächster Reiz geladen!';
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
      await fetchEvaluations();
      renderEvaluationView(false);
      selectProfile(activeProfile.id);
      if (editingStimulusId) {
        renderStimulusEvaluationStats(editingStimulusId);
      }
    }
  } catch (err) {
    alert('Fehler beim Zurücksetzen: ' + err.message);
  }
});

// ==========================================
// SEITE 2B: PROTOTYP DECISION TREE (HYPERTEXT FICTION SANDBOX)
// ==========================================

/**
 * Initialisiert oder setzt die Sandbox-Session für den Decision Tree zurück.
 * Arbeitet mit einer unabhängigen In-Memory-Kopie des aktuell gewählten Profils
 * (Startzustand: nur die Basis-Kontextantworten ohne gespeicherte Reizhistorie),
 * sodass gespeicherte Profile niemals verändert werden.
 */
function initDecisionTreeSession(forceReset = false) {
  if (!currentProfileId && profiles.length > 0) {
    currentProfileId = profiles[0].id;
  }
  const baseProfile = profiles.find(p => p.id === currentProfileId) || profiles[0];
  if (!baseProfile) return;

  if (!dtSessionProfile || forceReset || dtSessionProfile.id !== baseProfile.id) {
    dtSessionProfile = {
      ...JSON.parse(JSON.stringify(baseProfile)),
      stimulusEvaluations: []
    };
    dtStorySteps = [];
    dtCurrentStimulusId = null;
    dtCurrentAlgoReason = '';
  }
}

function updateDtAcceptanceButtonsUI() {
  const currentAcc = dtSessionProfile?.acceptance || '';
  dtAcceptanceButtons.forEach(btn => {
    if (btn.dataset.level === currentAcc) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function renderDecisionTreeView() {
  initDecisionTreeSession(false);
  updateHeaderProfileDisplay();
  updateDtAcceptanceButtonsUI();

  if (!dtSessionProfile) return;

  // Nächsten Reiz nach exakt demselben IPS-Algorithmus bestimmen
  const recommendation = recommendNextStimulus(dtSessionProfile);
  dtCurrentStimulusId = recommendation.stimulus ? recommendation.stimulus.id : null;
  dtCurrentAlgoReason = recommendation.reason;

  const currentChapterNum = dtStorySteps.length + 1;
  if (dtChapterLabel) {
    dtChapterLabel.textContent = dtCurrentStimulusId
      ? `KAPITEL ${currentChapterNum}`
      : 'GESCHICHTE ABGESCHLOSSEN';
  }

  renderDecisionTreeStimulusCard();
  renderDecisionTreeSimulatedModules();
  renderDecisionTreeHistory();
  renderDecisionTreeHypertextChoices();
}

function renderDecisionTreeStimulusCard() {
  const stim = stimuli.find(s => s.id === dtCurrentStimulusId);
  if (!stim) {
    if (dtStimName) dtStimName.textContent = 'Alle Reize durchlaufen';
    if (dtStimCategory) dtStimCategory.textContent = '-';
    if (dtStimFunction) dtStimFunction.textContent = '-';
    if (dtStimModulesDisplay) dtStimModulesDisplay.textContent = '-';
    if (dtStimAlgoReason) dtStimAlgoReason.textContent = dtCurrentAlgoReason || 'Keine weiteren Reize offen.';
    if (dtStoryNarrative) {
      dtStoryNarrative.textContent = 'Die interaktive Geschichte hat alle verfügbaren Reize durchlaufen. Klicke oben auf „Geschichte neu starten“, um einen anderen Pfad durch den Decision Tree zu erkunden.';
    }
    if (dtStimMediaContainer) dtStimMediaContainer.innerHTML = '';
    if (dtStimContent) {
      dtStimContent.textContent = '';
      dtStimContent.style.display = 'none';
    }
    return;
  }

  const dtContent = getDecisionTreeContentForStimulus(stim);

  if (dtStimName) dtStimName.textContent = stim.name;
  if (dtStimCategory) dtStimCategory.textContent = stim.category || '';
  if (dtStimFunction) dtStimFunction.textContent = getStimulusFunctionsDisplay(stim);

  if (dtStimModulesDisplay) {
    const modNames = (stim.primaryModules || [])
      .map(mId => MODULES.find(m => m.id === mId)?.name || `Modul ${mId}`)
      .join(', ');
    dtStimModulesDisplay.textContent = modNames || 'Keine Angabe';
  }

  if (dtStimAlgoReason) {
    dtStimAlgoReason.textContent = dtCurrentAlgoReason || 'Automatische Auswahl nach IPS-Regeln';
  }

  if (dtStoryNarrative) {
    dtStoryNarrative.textContent = dtContent.story;
  }

  if (dtStimMediaContainer) {
    renderStimulusMediaInto(dtStimMediaContainer, stim);
  }

  if (dtStimContent) {
    if (stim.content) {
      dtStimContent.textContent = stim.content;
      dtStimContent.style.display = 'block';
    } else {
      dtStimContent.textContent = '';
      dtStimContent.style.display = 'none';
    }
  }
}

function renderDecisionTreeSimulatedModules() {
  if (!dtModulesSummaryGrid || !dtSessionProfile) return;
  dtModulesSummaryGrid.innerHTML = '';

  const stats = computeModuleStats(dtSessionProfile);

  MODULES.forEach(m => {
    const s = stats[m.id];
    const card = document.createElement('div');
    card.className = 'module-visual-card readonly';

    const titleEl = document.createElement('div');
    titleEl.className = 'module-visual-title';
    titleEl.textContent = m.name;

    const tokensArea = document.createElement('div');
    tokensArea.className = 'module-tokens-area';

    s.barrierItems.forEach(barrier => {
      const token = createBarrierTokenElement({
        barrier,
        isAlreadyLegitimized: Boolean(barrier.legitimizedBy),
        isSelectedNow: false,
        currentStimLabel: '',
        onToggleLegit: null
      });
      tokensArea.appendChild(token);
    });

    s.driverItems.forEach(driver => {
      const token = createDriverTokenElement({
        label: driver.label,
        isPending: false,
        onTogglePending: null
      });
      tokensArea.appendChild(token);
    });

    card.appendChild(titleEl);
    card.appendChild(tokensArea);
    dtModulesSummaryGrid.appendChild(card);
  });
}

function renderDecisionTreeHistory() {
  if (!dtHistoryList || !dtHistoryCount) return;
  dtHistoryCount.textContent = dtStorySteps.length;
  dtHistoryList.innerHTML = '';

  if (dtStorySteps.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Noch keine Entscheidung getroffen – wähle rechts deinen ersten Gedanken-Link.';
    dtHistoryList.appendChild(li);
  } else {
    dtStorySteps.forEach((step, idx) => {
      const li = document.createElement('li');
      const effectLabel = step.actionType === 'legit'
        ? '0 Legitimation'
        : step.actionType === 'barrier'
          ? '-1 Barriere'
          : '+1 Enabler';
      li.innerHTML = `<strong>Kapitel ${idx + 1} (${step.stimulusName}):</strong> [${step.optionCode} · Modul ${step.moduleId} · ${effectLabel}] „${step.chosenText}“`;
      dtHistoryList.appendChild(li);
    });
  }

  // Letzter Punkt im Verlauf: "Aktuell" (warum der Algorithmus das aktuelle Kapitel zeigt)
  const currentLi = document.createElement('li');
  currentLi.className = 'eval-history-outlook';
  const currentStim = stimuli.find(s => s.id === dtCurrentStimulusId);
  if (currentStim) {
    currentLi.innerHTML = `<strong>Aktuell (Kapitel ${dtStorySteps.length + 1}):</strong> ${currentStim.name} [${getStimulusFunctionsDisplay(currentStim)}]<br><span class="caption-text">${dtCurrentAlgoReason || 'Automatische Auswahl nach IPS-Regeln'}</span>`;
  } else {
    currentLi.innerHTML = `<strong>Aktuell:</strong> Keine weiteren offenen Reize (${dtCurrentAlgoReason || 'Alle Reize durchlaufen'})`;
  }
  dtHistoryList.appendChild(currentLi);
}

/**
 * Rendert die anklickbaren Hypertext-Entscheidungslinks pro Modul (1 bis 6).
 * Pro Reiz hat der Nutzer genau eine Wahl:
 * - Legitimation (0) wird in einem Modul NUR angeboten, wenn dort aktuell mindestens eine aktive Barriere existiert.
 * - Barriere (-1) ist immer wählbar.
 * - Enabler / Treiber (+1) ist immer wählbar.
 * Ein Klick auf einen Link wendet die Wahl sofort auf die Sandbox-Session an und blättert zum nächsten Reiz-Kapitel.
 */
function renderDecisionTreeHypertextChoices() {
  if (!dtChoicesContainer) return;
  dtChoicesContainer.innerHTML = '';

  const stim = stimuli.find(s => s.id === dtCurrentStimulusId);
  if (!stim || !dtSessionProfile) {
    const doneBox = document.createElement('div');
    doneBox.className = 'dt-module-card';
    doneBox.innerHTML = `
      <span class="caption-label">ENDE DER SIMULATION</span>
      <p style="margin:6px 0 0 0;">Alle verfügbaren Reize wurden in dieser Sitzung besucht. Starte die Geschichte oben neu oder wechsle im Header zu einer anderen Person.</p>
    `;
    dtChoicesContainer.appendChild(doneBox);
    return;
  }

  const stats = computeModuleStats(dtSessionProfile);
  const dtContent = getDecisionTreeContentForStimulus(stim);

  MODULES.forEach(m => {
    const modStat = stats[m.id];
    const modTexts = dtContent.modules[m.id] || {
      legit: 'Das entkräftet meine bisherigen Bedenken in diesem Punkt.',
      barrier: 'Das löst bei mir an dieser Stelle eher Skepsis und Widerstand aus.',
      driver: 'Das überzeugt mich und schafft für mich einen echten Mehrwert.'
    };

    const hasActiveBarrier = modStat.activeBarrierItems.length > 0;
    const firstActiveBarrier = modStat.activeBarrierItems[0] || null;

    const moduleCard = document.createElement('div');
    moduleCard.className = 'dt-module-card';

    const headerEl = document.createElement('div');
    headerEl.className = 'dt-module-card-header';

    const statusBadgeText = hasActiveBarrier
      ? `${modStat.activeBarrierItems.length} aktive Barriere${modStat.activeBarrierItems.length > 1 ? 'n' : ''} · Legitimation möglich`
      : 'Keine aktive Barriere';

    headerEl.innerHTML = `
      <span class="dt-module-card-title">${m.name}</span>
      <span class="caption-tag">${statusBadgeText}</span>
    `;
    moduleCard.appendChild(headerEl);

    const linksList = document.createElement('div');
    linksList.className = 'dt-links-list';

    let subIdx = 1;

    // 1) LEGITIMATION (0): Nur anzeigen, wenn im Modul eine aktive Barriere vorhanden ist!
    if (hasActiveBarrier && firstActiveBarrier) {
      const optionCode = `${m.id}.${subIdx++}`;
      const btnLegit = document.createElement('button');
      btnLegit.type = 'button';
      btnLegit.className = 'dt-hypertext-link link-legit';
      btnLegit.innerHTML = `
        <span class="dt-link-text">${optionCode} ${modTexts.legit}</span>
        <span class="dt-link-tag">Legitimation (hebt „${firstActiveBarrier.label}“ auf)</span>
      `;
      btnLegit.addEventListener('click', () => {
        handleDecisionTreeChoice({
          stimulus: stim,
          moduleId: m.id,
          actionType: 'legit',
          optionCode,
          chosenText: modTexts.legit,
          targetBarrierId: firstActiveBarrier.id
        });
      });
      linksList.appendChild(btnLegit);
    }

    // 2) BARRIERE (-1)
    {
      const optionCode = `${m.id}.${subIdx++}`;
      const btnBarrier = document.createElement('button');
      btnBarrier.type = 'button';
      btnBarrier.className = 'dt-hypertext-link link-barrier';
      btnBarrier.innerHTML = `
        <span class="dt-link-text">${optionCode} ${modTexts.barrier}</span>
        <span class="dt-link-tag">Barriere (-1)</span>
      `;
      btnBarrier.addEventListener('click', () => {
        handleDecisionTreeChoice({
          stimulus: stim,
          moduleId: m.id,
          actionType: 'barrier',
          optionCode,
          chosenText: modTexts.barrier
        });
      });
      linksList.appendChild(btnBarrier);
    }

    // 3) ENABLER / TREIBER (+1)
    {
      const optionCode = `${m.id}.${subIdx++}`;
      const btnDriver = document.createElement('button');
      btnDriver.type = 'button';
      btnDriver.className = 'dt-hypertext-link link-driver';
      btnDriver.innerHTML = `
        <span class="dt-link-text">${optionCode} ${modTexts.driver}</span>
        <span class="dt-link-tag">Enabler (+1)</span>
      `;
      btnDriver.addEventListener('click', () => {
        handleDecisionTreeChoice({
          stimulus: stim,
          moduleId: m.id,
          actionType: 'driver',
          optionCode,
          chosenText: modTexts.driver
        });
      });
      linksList.appendChild(btnDriver);
    }

    moduleCard.appendChild(linksList);
    dtChoicesContainer.appendChild(moduleCard);
  });
}

function handleDecisionTreeChoice({ stimulus, moduleId, actionType, optionCode, chosenText, targetBarrierId }) {
  if (!dtSessionProfile || !stimulus) return;

  const moduleActions = {
    [moduleId]: {
      legitimizedBarrierIds: actionType === 'legit' && targetBarrierId ? [targetBarrierId] : [],
      addBarrier: actionType === 'barrier',
      addDriver: actionType === 'driver'
    }
  };

  // Nur im Sandbox-Profil speichern (kein Backend-Call, echte Profile bleiben unberührt!)
  dtSessionProfile.stimulusEvaluations.push({
    stimulusId: stimulus.id,
    timestamp: new Date().toISOString(),
    moduleActions,
    acceptance: dtSessionProfile.acceptance || null
  });

  dtStorySteps.push({
    stimulusId: stimulus.id,
    stimulusName: stimulus.name,
    moduleId,
    actionType,
    optionCode,
    chosenText
  });

  renderDecisionTreeView();
}

if (btnDtRestart) {
  btnDtRestart.addEventListener('click', () => {
    initDecisionTreeSession(true);
    renderDecisionTreeView();
  });
}

if (btnToggleDtHistory && dtHistoryBox) {
  btnToggleDtHistory.addEventListener('click', () => {
    const isCollapsed = dtHistoryBox.classList.toggle('collapsed');
    btnToggleDtHistory.setAttribute('aria-expanded', String(!isCollapsed));
  });
}

dtAcceptanceButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (!dtSessionProfile) return;
    const level = btn.dataset.level;
    dtSessionProfile.acceptance = (dtSessionProfile.acceptance === level) ? '' : level;
    updateDtAcceptanceButtonsUI();
  });
});

// ==========================================
// SEITE 3: REIZSAMMLUNG (ERSTELLEN & VERWALTEN)
// ==========================================

function showStimulusStatus(message, isError = false) {
  stimulusStatusMessageEl.textContent = message;
  stimulusStatusMessageEl.className = isError ? 'error' : 'success';
  stimulusStatusMessageEl.style.display = 'block';
  setTimeout(() => {
    stimulusStatusMessageEl.style.display = 'none';
  }, 4000);
}

function formatModuleLabel(modId) {
  const mod = MODULES.find(m => m.id === Number(modId));
  if (!mod) return `M${modId}`;
  const cleanTitle = mod.name.replace(/^\d+\.\s*/, '');
  return `M${mod.id} - ${cleanTitle}`;
}

function renderStimulusModuleCheckboxes() {
  stimModulesCheckboxes.innerHTML = '';
  MODULES.forEach(m => {
    const label = document.createElement('label');
    label.className = 'stim-function-toggle';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = 'stim_module';
    input.value = String(m.id);
    const span = document.createElement('span');
    span.textContent = formatModuleLabel(m.id);
    label.appendChild(input);
    label.appendChild(span);
    stimModulesCheckboxes.appendChild(label);
  });
}

function getFilteredStimuli() {
  return stimuli.filter(s => {
    const matchFunction = activeFunctionFilter === 'all' || stimulusMatchesFunction(s, activeFunctionFilter);
    const matchModule = activeModuleFilter === 'all' || (Array.isArray(s.primaryModules) && s.primaryModules.includes(Number(activeModuleFilter)));
    const matchMvp = !activeMvpFilter || Boolean(s.isMvp || s.mvp || (Array.isArray(s.tags) && s.tags.includes('MVP')) || s.category === 'MVP');
    return matchFunction && matchModule && matchMvp;
  });
}

function renderStimuliSidebar() {
  const filtered = getFilteredStimuli();
  if (countStimuliEl) countStimuliEl.textContent = filtered.length;
  if (!stimuliCardsGridEl) return;
  stimuliCardsGridEl.innerHTML = '';

  if (stimFilterFunctionGroup) {
    stimFilterFunctionGroup.querySelectorAll('.btn-filter').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.function === activeFunctionFilter);
    });
  }
  if (stimFilterModuleGroup) {
    stimFilterModuleGroup.querySelectorAll('.btn-filter').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.module === activeModuleFilter);
    });
  }
  if (btnFilterMvp) {
    btnFilterMvp.classList.toggle('active', activeMvpFilter);
  }
  if (stimViewModeGroup) {
    stimViewModeGroup.querySelectorAll('[data-view-mode]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.viewMode === activeStimuliViewMode);
    });
  }

  stimuliCardsGridEl.classList.toggle('stimuli-details-list', activeStimuliViewMode === 'details');

  if (filtered.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'Keine Reize für diesen Filter gefunden.';
    emptyMsg.className = 'caption-text';
    stimuliCardsGridEl.appendChild(emptyMsg);
    return;
  }

  if (activeStimuliViewMode === 'details') {
    const headerRow = document.createElement('div');
    headerRow.className = 'stim-details-header';
    headerRow.innerHTML = `
      <span class="caption-label">BILD</span>
      <span class="caption-label">TITEL</span>
      <span class="caption-label">FUNKTIONEN</span>
      <span class="caption-label">MODULE</span>
      <span class="caption-label">SAMMLUNG</span>
    `;
    stimuliCardsGridEl.appendChild(headerRow);
  }

  filtered.forEach(s => {
    const imgUrl = (s.imageUrl || '').trim();
    const iframeSrc = extractIframeSrc(s.iframeUrl || '');
    const stimFuncs = Array.isArray(s.functions) && s.functions.length > 0
      ? s.functions
      : (s.primaryFunction ? [s.primaryFunction] : []);
    const evalCount = allEvaluations.filter(e => String(e.stimulusId) === String(s.id)).length;
    const isMvpStim = Boolean(s.isMvp || s.mvp || (Array.isArray(s.tags) && s.tags.includes('MVP')));

    const popoverLines = [];
    if (stimFuncs.length > 0) {
      popoverLines.push(`<div><strong>Funktion:</strong> ${stimFuncs.join(', ')}</div>`);
    }
    if (Array.isArray(s.primaryModules) && s.primaryModules.length > 0) {
      popoverLines.push(`<div><strong>Modul:</strong> ${s.primaryModules.map(formatModuleLabel).join(', ')}</div>`);
    }
    if (isMvpStim && s.personaTarget) {
      popoverLines.push(`<div><strong>Persona:</strong> ${s.personaTarget}</div>`);
    }
    if (evalCount > 0) {
      popoverLines.push(`<div><strong>Bewertungen:</strong> ${evalCount}</div>`);
    }
    if (s.content) {
      popoverLines.push(`<div style="margin-top:4px;">${s.content}</div>`);
    }

    if (activeStimuliViewMode === 'details') {
      const row = document.createElement('article');
      row.className = 'stim-details-row';

      // 1. Minibild
      const thumbBox = document.createElement('div');
      thumbBox.className = 'stim-details-thumb';
      if (imgUrl) {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = s.name || '';
        img.loading = 'lazy';
        thumbBox.appendChild(img);
      } else if (iframeSrc) {
        const iframe = document.createElement('iframe');
        iframe.src = iframeSrc;
        iframe.loading = 'lazy';
        iframe.setAttribute('tabindex', '-1');
        thumbBox.appendChild(iframe);
      } else {
        const textPreview = document.createElement('div');
        textPreview.className = 'stim-details-thumb-text';
        textPreview.textContent = s.content || s.name || '';
        thumbBox.appendChild(textPreview);
      }
      row.appendChild(thumbBox);

      // 2. Titel (+ optionales Hover-Info-Icon)
      const titleCol = document.createElement('div');
      titleCol.className = 'stim-details-title-col';
      const titleEl = document.createElement('span');
      titleEl.className = 'stim-details-title';
      titleEl.textContent = s.name || 'Ohne Titel';
      titleCol.appendChild(titleEl);

      if (popoverLines.length > 0) {
        const infoEl = document.createElement('span');
        infoEl.className = 'info-hover';
        infoEl.tabIndex = 0;
        infoEl.innerHTML = `
          ${ICONS.informationSm}
          <span class="info-popover">${popoverLines.join('')}</span>
        `;
        infoEl.addEventListener('click', (e) => e.stopPropagation());
        titleCol.appendChild(infoEl);
      }
      row.appendChild(titleCol);

      // 3. Funktionen
      const funcCol = document.createElement('div');
      funcCol.className = 'stim-details-cell';
      if (stimFuncs.length > 0) {
        stimFuncs.forEach(fn => {
          const fnTag = document.createElement('span');
          fnTag.className = 'caption-tag';
          fnTag.textContent = fn;
          funcCol.appendChild(fnTag);
        });
      } else {
        const emptySpan = document.createElement('span');
        emptySpan.className = 'caption-text';
        emptySpan.textContent = '–';
        funcCol.appendChild(emptySpan);
      }
      row.appendChild(funcCol);

      // 4. Module
      const modCol = document.createElement('div');
      modCol.className = 'stim-details-cell';
      if (Array.isArray(s.primaryModules) && s.primaryModules.length > 0) {
        s.primaryModules.forEach(modId => {
          const modTag = document.createElement('span');
          modTag.className = 'caption-tag';
          modTag.textContent = formatModuleLabel(modId);
          modCol.appendChild(modTag);
        });
      } else {
        const emptySpan = document.createElement('span');
        emptySpan.className = 'caption-text';
        emptySpan.textContent = '–';
        modCol.appendChild(emptySpan);
      }
      row.appendChild(modCol);

      // 5. Sammlung
      const collCol = document.createElement('div');
      collCol.className = 'stim-details-cell';
      if (isMvpStim) {
        const mvpTag = document.createElement('span');
        mvpTag.className = 'caption-tag tag-mvp';
        mvpTag.textContent = 'MVP';
        if (s.personaTarget) mvpTag.title = `Persona: ${s.personaTarget}`;
        collCol.appendChild(mvpTag);
      } else {
        const emptySpan = document.createElement('span');
        emptySpan.className = 'caption-text';
        emptySpan.textContent = '–';
        collCol.appendChild(emptySpan);
      }
      row.appendChild(collCol);

      row.addEventListener('click', () => {
        selectStimulusForEdit(s.id);
        if (modalStimulusDetail && !modalStimulusDetail.open) {
          modalStimulusDetail.showModal();
        }
      });

      stimuliCardsGridEl.appendChild(row);
      return;
    }

    const card = document.createElement('article');
    card.className = 'stim-thumb-card';

    // 1. 16:9 Thumbnail-Vorschau (Bild, Iframe oder Text)
    const mediaBox = document.createElement('div');
    mediaBox.className = 'stim-thumb-media';

    if (imgUrl) {
      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = s.name || '';
      img.loading = 'lazy';
      mediaBox.appendChild(img);
    } else if (iframeSrc) {
      const iframe = document.createElement('iframe');
      iframe.src = iframeSrc;
      iframe.loading = 'lazy';
      iframe.setAttribute('tabindex', '-1');
      mediaBox.appendChild(iframe);
    } else {
      const textPreview = document.createElement('div');
      textPreview.className = 'stim-thumb-text-preview';
      textPreview.textContent = s.content || s.name || '';
      mediaBox.appendChild(textPreview);
    }

    // 2. Karten-Body: Minimalistisch nur mit Titel, einem kompakten Tag und Hover-Info-Icon
    const body = document.createElement('div');
    body.className = 'stim-thumb-body';

    const titleRow = document.createElement('div');
    titleRow.className = 'stim-thumb-header-row';

    const titleEl = document.createElement('h4');
    titleEl.className = 'stim-thumb-title';
    titleEl.textContent = s.name;
    titleRow.appendChild(titleEl);

    if (popoverLines.length > 0) {
      const infoEl = document.createElement('span');
      infoEl.className = 'info-hover';
      infoEl.tabIndex = 0;
      infoEl.innerHTML = `
        ${ICONS.informationSm}
        <span class="info-popover">${popoverLines.join('')}</span>
      `;
      infoEl.addEventListener('click', (e) => e.stopPropagation());
      titleRow.appendChild(infoEl);
    }

    body.appendChild(titleRow);

    const metaRow = document.createElement('div');
    metaRow.className = 'stim-thumb-meta';

    if (Array.isArray(s.primaryModules) && s.primaryModules.length > 0) {
      s.primaryModules.forEach(modId => {
        const modTag = document.createElement('span');
        modTag.className = 'caption-tag';
        modTag.textContent = formatModuleLabel(modId);
        metaRow.appendChild(modTag);
      });
    }

    if (isMvpStim) {
      const mvpTag = document.createElement('span');
      mvpTag.className = 'caption-tag tag-mvp';
      mvpTag.textContent = 'MVP';
      metaRow.appendChild(mvpTag);
    }

    body.appendChild(metaRow);

    card.appendChild(mediaBox);
    card.appendChild(body);

    card.addEventListener('click', () => {
      selectStimulusForEdit(s.id);
      if (modalStimulusDetail && !modalStimulusDetail.open) {
        modalStimulusDetail.showModal();
      }
    });

    stimuliCardsGridEl.appendChild(card);
  });
}

function compressImageFile(file, maxDimension = 1920, quality = 0.88) {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(null);
      return;
    }
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => resolve(null);
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => resolve(e.target.result);
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

let pendingStimulusImageUpload = null;

async function handleStimulusImageFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  showStimulusStatus('Bild wird vorbereitet...', false);

  const base64Data = await compressImageFile(file);
  if (!base64Data) {
    showStimulusStatus('Bild konnte nicht verarbeitet werden.', true);
    return;
  }

  stimFieldImage.value = base64Data;
  stimFieldIframe.value = '';
  stimFieldMediatype.value = 'image';
  renderStimulusMediaSlot();
  updateStimulusFormPreview();

  const uploadTask = (async () => {
    try {
      showStimulusStatus('Bild wird hochgeladen...', false);
      const res = await fetch('/api/stimuli/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: base64Data,
          stimulusId: editingStimulusId
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.imageUrl) {
          stimFieldImage.value = data.imageUrl;
          updateStimulusFormPreview();
          showStimulusStatus('Bild bereit!', false);
          return data.imageUrl;
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        console.warn('Upload-Warnung:', errJson.error);
      }
    } catch (err) {
      console.warn('Upload-Fehler, Fallback auf Formular-Speicherung:', err);
    }
    return base64Data;
  })();

  pendingStimulusImageUpload = uploadTask;
  await uploadTask;
  if (pendingStimulusImageUpload === uploadTask) {
    pendingStimulusImageUpload = null;
  }
}

function renderStimulusMediaSlot() {
  if (!stimMediaSlot) return;
  stimMediaSlot.innerHTML = '';

  const imgUrl = (stimFieldImage.value || '').trim();
  const iframeUrl = (stimFieldIframe.value || '').trim();

  if (imgUrl) {
    const wrap = document.createElement('div');
    wrap.className = 'stim-media-filled-wrap';

    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = stimFieldName.value || 'Reiz-Bild';
    img.className = 'stim-media-filled-img';
    wrap.appendChild(img);

    const btnClear = document.createElement('button');
    btnClear.type = 'button';
    btnClear.className = 'btn-media-clear';
    btnClear.innerHTML = `${ICONS.closeSm} <span>Medien entfernen / ändern</span>`;
    btnClear.addEventListener('click', () => {
      stimFieldImage.value = '';
      stimFieldIframe.value = '';
      stimFieldMediatype.value = 'text';
      renderStimulusMediaSlot();
      updateStimulusFormPreview();
    });
    wrap.appendChild(btnClear);

    stimMediaSlot.appendChild(wrap);
    return;
  }

  if (iframeUrl) {
    const wrap = document.createElement('div');
    wrap.className = 'stim-media-filled-wrap';

    const iframeSrc = extractIframeSrc(iframeUrl);
    const iframe = document.createElement('iframe');
    iframe.src = iframeSrc;
    iframe.className = 'stim-media-filled-iframe';
    wrap.appendChild(iframe);

    const btnClear = document.createElement('button');
    btnClear.type = 'button';
    btnClear.className = 'btn-media-clear';
    btnClear.innerHTML = `${ICONS.closeSm} <span>Medien entfernen / ändern</span>`;
    btnClear.addEventListener('click', () => {
      stimFieldImage.value = '';
      stimFieldIframe.value = '';
      stimFieldMediatype.value = 'text';
      renderStimulusMediaSlot();
      updateStimulusFormPreview();
    });
    wrap.appendChild(btnClear);

    stimMediaSlot.appendChild(wrap);
    return;
  }

  // WENN LEER: Dropzone / Uploadfeld für Bild, Bildlink oder iFrame anzeigen
  const dropzone = document.createElement('div');
  dropzone.className = 'stim-dropzone';

  dropzone.innerHTML = `
    <div class="stim-dropzone-icon">
      ${icon('image', { size: 36 })}
    </div>
    <div class="stim-dropzone-title">Bild hierher ziehen oder Strg + V drücken</div>
    <div class="stim-dropzone-sub">Kopiere das Bild in AI Studio oder Nano Banana und füge es einfach mit Strg+V ein</div>
    <input type="file" id="stim-hidden-file-input" accept="image/*" style="display:none;" />
    <div class="stim-dropzone-actions">
      <button type="button" class="btn-outline-sm btn-icon-text" id="btn-pick-file">${ICONS.upload} <span>Datei auswählen</span></button>
      <button type="button" class="btn-outline-sm btn-icon-text" id="btn-toggle-link-row">${ICONS.link} <span>Bildlink (URL)</span></button>
      <button type="button" class="btn-outline-sm btn-icon-text" id="btn-toggle-iframe-row">${ICONS.code} <span>iFrame / Embed</span></button>
    </div>
    <div id="stim-inline-link-row" style="display:none; width:100%; max-width:440px; margin-top:10px;">
      <div style="display:flex; gap:6px;">
        <input type="url" id="stim-inline-link-input" class="caption-text" placeholder="https://example.com/bild.jpg" style="flex:1; padding:6px 10px;" />
        <button type="button" class="btn-primary caption-text" id="btn-apply-inline-link" style="padding:6px 14px;">Übernehmen</button>
      </div>
    </div>
    <div id="stim-inline-iframe-row" style="display:none; width:100%; max-width:440px; margin-top:10px;">
      <div style="display:flex; gap:6px;">
        <input type="text" id="stim-inline-iframe-input" class="caption-text" placeholder="https://... oder <iframe>...</iframe>" style="flex:1; padding:6px 10px;" />
        <button type="button" class="btn-primary caption-text" id="btn-apply-inline-iframe" style="padding:6px 14px;">Übernehmen</button>
      </div>
    </div>
  `;

  // Drag & Drop
  ['dragenter', 'dragover'].forEach(evt => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('drag-over');
    });
  });
  ['dragleave', 'drop'].forEach(evt => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('drag-over');
    });
  });
  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer?.files;
    if (files && files.length > 0 && files[0].type.startsWith('image/')) {
      handleStimulusImageFile(files[0]);
    } else {
      const text = e.dataTransfer?.getData('text/plain');
      if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
        stimFieldImage.value = text.trim();
        stimFieldIframe.value = '';
        stimFieldMediatype.value = 'image';
        renderStimulusMediaSlot();
        updateStimulusFormPreview();
      }
    }
  });

  const fileInput = dropzone.querySelector('#stim-hidden-file-input');
  const btnPick = dropzone.querySelector('#btn-pick-file');
  btnPick.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) {
      handleStimulusImageFile(fileInput.files[0]);
    }
  });

  const btnToggleLink = dropzone.querySelector('#btn-toggle-link-row');
  const linkRow = dropzone.querySelector('#stim-inline-link-row');
  const linkInput = dropzone.querySelector('#stim-inline-link-input');
  const btnApplyLink = dropzone.querySelector('#btn-apply-inline-link');

  btnToggleLink.addEventListener('click', () => {
    linkRow.style.display = linkRow.style.display === 'none' ? 'block' : 'none';
    if (linkRow.style.display === 'block') linkInput.focus();
  });
  btnApplyLink.addEventListener('click', () => {
    const val = linkInput.value.trim();
    if (val) {
      stimFieldImage.value = val;
      stimFieldIframe.value = '';
      stimFieldMediatype.value = 'image';
      renderStimulusMediaSlot();
      updateStimulusFormPreview();
    }
  });

  const btnToggleIframe = dropzone.querySelector('#btn-toggle-iframe-row');
  const iframeRow = dropzone.querySelector('#stim-inline-iframe-row');
  const iframeInput = dropzone.querySelector('#stim-inline-iframe-input');
  const btnApplyIframe = dropzone.querySelector('#btn-apply-inline-iframe');

  btnToggleIframe.addEventListener('click', () => {
    iframeRow.style.display = iframeRow.style.display === 'none' ? 'block' : 'none';
    if (iframeRow.style.display === 'block') iframeInput.focus();
  });
  btnApplyIframe.addEventListener('click', () => {
    const val = iframeInput.value.trim();
    if (val) {
      stimFieldIframe.value = val;
      stimFieldImage.value = '';
      stimFieldMediatype.value = 'iframe';
      renderStimulusMediaSlot();
      updateStimulusFormPreview();
    }
  });

  stimMediaSlot.appendChild(dropzone);
}

function updateStimulusFormPreview() {
  if (!stimFormPreview) return;
  const funcs = getSelectedStimulusFunctions();
  const selectedModules = Array.from(
    stimModulesCheckboxes.querySelectorAll('input[name="stim_module"]:checked')
  ).map(cb => Number(cb.value));

  const draft = {
    name: stimFieldName.value.trim() || 'Vorschau-Titel',
    functions: funcs,
    primaryFunction: funcs[0] || 'legitimierend',
    imageUrl: (stimFieldImage.value || '').trim(),
    iframeUrl: (stimFieldIframe.value || '').trim(),
    content: stimFieldContent.value.trim(),
    primaryModules: selectedModules
  };

  stimFormPreview.innerHTML = '';

  // 1. 16:9 Thumbnail-Vorschau
  const mediaBox = document.createElement('div');
  mediaBox.className = 'stim-thumb-media';

  const imgUrl = draft.imageUrl;
  const iframeSrc = extractIframeSrc(draft.iframeUrl);

  if (imgUrl) {
    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = draft.name;
    img.loading = 'lazy';
    mediaBox.appendChild(img);
  } else if (iframeSrc) {
    const iframe = document.createElement('iframe');
    iframe.src = iframeSrc;
    iframe.loading = 'lazy';
    mediaBox.appendChild(iframe);
  } else {
    const textPreview = document.createElement('div');
    textPreview.className = 'stim-thumb-text-preview';
    textPreview.textContent = draft.content || draft.name;
    mediaBox.appendChild(textPreview);
  }

  if (funcs.length > 0) {
    const badgeWrap = document.createElement('div');
    badgeWrap.className = 'stim-thumb-badges-wrap';
    funcs.forEach(fn => {
      const funcBadge = document.createElement('span');
      funcBadge.className = 'stim-thumb-badge-func';
      funcBadge.textContent = fn;
      badgeWrap.appendChild(funcBadge);
    });
    mediaBox.appendChild(badgeWrap);
  }

  // 2. Body
  const body = document.createElement('div');
  body.className = 'stim-thumb-body';

  const titleEl = document.createElement('h4');
  titleEl.className = 'stim-thumb-title';
  titleEl.textContent = draft.name;
  body.appendChild(titleEl);

  const metaRow = document.createElement('div');
  metaRow.className = 'stim-thumb-meta';

  if (draft.primaryModules.length > 0) {
    draft.primaryModules.forEach(modId => {
      const modTag = document.createElement('span');
      modTag.className = 'caption-tag';
      modTag.textContent = formatModuleLabel(modId);
      metaRow.appendChild(modTag);
    });
  }

  body.appendChild(metaRow);

  stimFormPreview.appendChild(mediaBox);
  stimFormPreview.appendChild(body);
}

function renderStimulusEvaluationStats(stimulusId) {
  if (!stimEvalContainer) return;
  stimEvalContainer.innerHTML = '';

  if (!stimulusId) {
    if (stimEvalSummaryBadge) stimEvalSummaryBadge.textContent = '';
    return;
  }

  const stim = stimuli.find(s => s.id === stimulusId);
  if (!stim) return;

  const relevantEvals = allEvaluations.filter(e => String(e.stimulusId) === String(stimulusId));
  const totalCount = relevantEvals.length;

  if (stimEvalSummaryBadge) {
    stimEvalSummaryBadge.textContent = totalCount === 1 ? '1 Bewertung' : `${totalCount} Bewertungen`;
  }

  if (totalCount === 0) {
    const emptyNotice = document.createElement('p');
    emptyNotice.className = 'caption-text';
    emptyNotice.style.margin = '8px 0 0 0';
    emptyNotice.textContent = 'Bisher liegen noch keine Bewertungen für diesen Reiz durch Testpersonen vor.';
    stimEvalContainer.appendChild(emptyNotice);
    return;
  }

  // Empirische Auswertung berechnen
  let totalLegit = 0;
  let totalDriver = 0;
  let totalBarrier = 0;
  const moduleReactionCounts = {};
  MODULES.forEach(m => {
    moduleReactionCounts[m.id] = {
      legit: 0,
      driver: 0,
      barrier: 0,
      total: 0
    };
  });

  relevantEvals.forEach(ev => {
    const actions = ev.moduleActions || {};
    Object.entries(actions).forEach(([modIdStr, act]) => {
      const modId = Number(modIdStr);
      if (!moduleReactionCounts[modId] || !act) return;

      if (Array.isArray(act.legitimizedBarrierIds) && act.legitimizedBarrierIds.length > 0) {
        totalLegit += act.legitimizedBarrierIds.length;
        moduleReactionCounts[modId].legit += act.legitimizedBarrierIds.length;
        moduleReactionCounts[modId].total += act.legitimizedBarrierIds.length;
      }
      if (act.addDriver) {
        totalDriver += 1;
        moduleReactionCounts[modId].driver += 1;
        moduleReactionCounts[modId].total += 1;
      }
      if (act.addBarrier) {
        totalBarrier += 1;
        moduleReactionCounts[modId].barrier += 1;
        moduleReactionCounts[modId].total += 1;
      }
    });
  });

  const totalActions = totalLegit + totalDriver + totalBarrier;

  // 1. Funktions-Abgleich (Geplant vs. Tatsächlich)
  const plannedFunc = stim.primaryFunction || 'legitimierend';
  let functionMatchVerdict = '';
  let functionVerdictClass = '';

  if (totalActions === 0) {
    functionMatchVerdict = 'Der Reiz wurde gesehen, löste jedoch in keinem Modul eine explizite Reaktion aus (neutral).';
    functionVerdictClass = 'match-partial';
  } else if (plannedFunc === 'legitimierend' || plannedFunc === 'widerstands-mindernd') {
    const legitRate = Math.round((totalLegit / totalActions) * 100);
    if (legitRate >= 50) {
      functionMatchVerdict = `✓ Gewünschte Funktion bestätigt: ${legitRate}% der Reaktionen waren legitimierend (Barrieren abgebaut).`;
      functionVerdictClass = 'match-success';
    } else if (totalLegit > 0) {
      functionMatchVerdict = `~ Teilweise Übereinstimmung (${legitRate}% legitimierend), löste aber auch ${totalDriver}x Treiber und ${totalBarrier}x Barrieren aus.`;
      functionVerdictClass = 'match-partial';
    } else {
      functionMatchVerdict = `⚠ Funktion weicht ab: Keine Barrieren legitimiert. Stattdessen ${totalDriver}x Treiber und ${totalBarrier}x neue Barrieren entstanden.`;
      functionVerdictClass = 'match-deviate';
    }
  } else if (plannedFunc === 'wert-schaffend') {
    const driverRate = Math.round((totalDriver / totalActions) * 100);
    if (driverRate >= 50) {
      functionMatchVerdict = `✓ Gewünschte Funktion bestätigt: ${driverRate}% der Reaktionen waren wert-schaffend (Treiber aufgebaut).`;
      functionVerdictClass = 'match-success';
    } else if (totalDriver > 0) {
      functionMatchVerdict = `~ Teilweise Übereinstimmung (${driverRate}% wert-schaffend).`;
      functionVerdictClass = 'match-partial';
    } else {
      functionMatchVerdict = `⚠ Funktion weicht ab: Reiz erzeugte keine Treiber.`;
      functionVerdictClass = 'match-deviate';
    }
  } else {
    const barrierRate = Math.round((totalBarrier / totalActions) * 100);
    if (barrierRate > 0) {
      functionMatchVerdict = `Bestätigt: Reiz erzeugte ${totalBarrier}x Barrieren (${barrierRate}%).`;
      functionVerdictClass = 'match-success';
    } else {
      functionMatchVerdict = `Reiz erzeugte keine Barrieren.`;
      functionVerdictClass = 'match-partial';
    }
  }

  // 2. Modul-Abgleich (Geplante Zielmodule vs. Tatsächlich angesprochene)
  const plannedModules = (stim.primaryModules || []).map(Number);
  const plannedModuleNames = plannedModules
    .map(id => MODULES.find(m => m.id === id)?.name || `Modul ${id}`)
    .join(', ') || 'Keine spezifischen Zielmodule hinterlegt';

  const touchedModules = MODULES.filter(m => moduleReactionCounts[m.id].total > 0);
  const touchedTargetModules = touchedModules.filter(m => plannedModules.includes(m.id));
  const unexpectedModules = touchedModules.filter(m => !plannedModules.includes(m.id));

  let moduleMatchVerdict = '';
  let moduleVerdictClass = '';

  if (touchedModules.length === 0) {
    moduleMatchVerdict = 'Keine Reaktionen in Modulen verzeichnet.';
    moduleVerdictClass = 'match-partial';
  } else if (unexpectedModules.length === 0 && touchedTargetModules.length === plannedModules.length) {
    moduleMatchVerdict = '✓ Zielmodule exakt getroffen: Reaktionen traten genau in den beabsichtigten Modulen auf.';
    moduleVerdictClass = 'match-success';
  } else if (touchedTargetModules.length > 0 && unexpectedModules.length > 0) {
    const unexpNames = unexpectedModules.map(m => m.name).join(', ');
    moduleMatchVerdict = `~ Zielmodule angesprochen, jedoch traten auch unerwartete Effekte in: ${unexpNames} auf.`;
    moduleVerdictClass = 'match-partial';
  } else if (touchedTargetModules.length > 0) {
    moduleMatchVerdict = `✓ Zielmodule teilweise bestätigt (${touchedTargetModules.length} von ${plannedModules.length} adressiert).`;
    moduleVerdictClass = 'match-success';
  } else {
    const unexpNames = unexpectedModules.map(m => m.name).join(', ');
    moduleMatchVerdict = `⚠ Zielmodule verfehlt: Reaktionen traten ausschließlich in ungeplanten Modulen auf (${unexpNames}).`;
    moduleVerdictClass = 'match-deviate';
  }

  // Kacheln aufbauen
  const statsGrid = document.createElement('div');
  statsGrid.className = 'eval-stats-grid';

  const totalAcceptanceChanges = relevantEvals.filter(e => e.acceptanceChanged).length;

  const funcCard = document.createElement('div');
  funcCard.className = 'eval-stat-card';
  funcCard.innerHTML = `
    <div class="eval-stat-card-title">FUNKTIONS-ABGLEICH</div>
    <div class="eval-stat-row">
      <span>Beabsichtigte Funktion:</span>
      <strong>${plannedFunc}</strong>
    </div>
    <div class="eval-stat-row">
      <span>Legitimierend (Barrieren abgebaut):</span>
      <span>${totalLegit}x</span>
    </div>
    <div class="eval-stat-row">
      <span>Wert-schaffend (Treiber gesetzt):</span>
      <span>${totalDriver}x</span>
    </div>
    <div class="eval-stat-row">
      <span>Wert-mindernd (Barrieren erzeugt):</span>
      <span>${totalBarrier}x</span>
    </div>
    <div class="eval-stat-row">
      <span>Akzeptanz-Wirkung:</span>
      <span>${totalAcceptanceChanges}x verändert</span>
    </div>
    <div class="match-verdict ${functionVerdictClass}">${functionMatchVerdict}</div>
  `;

  const touchedRowsHtml = touchedModules.map(m => {
    const c = moduleReactionCounts[m.id];
    const isTarget = plannedModules.includes(m.id);
    const tag = isTarget ? '<span class="caption-tag">Ziel</span>' : '<span class="caption-tag tag-unexpected">Ungeplant</span>';
    const parts = [];
    if (c.legit) parts.push(`${c.legit}x Legitimation`);
    if (c.driver) parts.push(`${c.driver}x Treiber`);
    if (c.barrier) parts.push(`${c.barrier}x Barriere`);
    return `
      <div class="eval-stat-row">
        <span>${m.name} ${tag}</span>
        <span>${parts.join(', ')}</span>
      </div>
    `;
  }).join('');

  const modCard = document.createElement('div');
  modCard.className = 'eval-stat-card';
  modCard.innerHTML = `
    <div class="eval-stat-card-title">MODUL-ABGLEICH</div>
    <div class="eval-stat-row" style="margin-bottom:6px;">
      <span>Beabsichtigte Zielmodule:</span>
      <span class="caption-text" style="text-align:right; max-width:60%;">${plannedModuleNames}</span>
    </div>
    ${touchedRowsHtml || '<div class="caption-text">Keine Modulreaktionen</div>'}
    <div class="match-verdict ${moduleVerdictClass}">${moduleMatchVerdict}</div>
  `;

  statsGrid.appendChild(funcCard);
  statsGrid.appendChild(modCard);
  stimEvalContainer.appendChild(statsGrid);

  // 3. Einzelbewertungen auflisten
  const listTitle = document.createElement('div');
  listTitle.className = 'caption-label';
  listTitle.style.marginBottom = '8px';
  listTitle.textContent = `BEWERTUNGEN VON PERSONEN (${totalCount})`;
  stimEvalContainer.appendChild(listTitle);

  const peopleList = document.createElement('div');
  relevantEvals.forEach(ev => {
    const personItem = document.createElement('div');
    personItem.className = 'eval-person-item';

    const dateFormatted = ev.timestamp ? new Date(ev.timestamp).toLocaleString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }) : '';

    const actionsList = [];
    Object.entries(ev.moduleActions || {}).forEach(([modIdStr, act]) => {
      const modId = Number(modIdStr);
      const modName = MODULES.find(m => m.id === modId)?.name || `Modul ${modId}`;
      if (act.legitimizedBarrierIds?.length) {
        actionsList.push(`<span class="eval-action-tag tag-legit">${modName}: ${act.legitimizedBarrierIds.length}x Legitimation (0)</span>`);
      }
      if (act.addDriver) {
        actionsList.push(`<span class="eval-action-tag tag-driver">${modName}: Treiber (+1)</span>`);
      }
      if (act.addBarrier) {
        actionsList.push(`<span class="eval-action-tag tag-barrier">${modName}: Barriere (-1)</span>`);
      }
    });

    if (ev.acceptanceChanged) {
      const from = formatAcceptanceShort(ev.previousAcceptance) || 'Keine';
      const to = formatAcceptanceShort(ev.acceptance) || 'Keine';
      actionsList.push(`<span class="eval-action-tag tag-acceptance-change">Akzeptanz: ${from} → ${to}</span>`);
    } else if (ev.acceptance) {
      actionsList.push(`<span class="eval-action-tag tag-acceptance">Akzeptanz: ${formatAcceptanceShort(ev.acceptance)}</span>`);
    }

    personItem.innerHTML = `
      <div class="eval-person-header">
        <span class="eval-person-name">${ev.profileName} <span class="caption-tag">${ev.profileDataType === 'real' ? 'Real' : 'Fiktiv'}</span></span>
        <span class="caption-text">${dateFormatted}</span>
      </div>
      <div class="eval-actions-list">
        ${actionsList.join('') || '<span class="caption-text">Neutral bewertet (keine Modul-Auswahl)</span>'}
      </div>
    `;

    peopleList.appendChild(personItem);
  });

  stimEvalContainer.appendChild(peopleList);
}

function selectStimulusForEdit(id) {
  const stim = stimuli.find(s => s.id === id);
  if (!stim) return;

  editingStimulusId = id;
  renderStimuliSidebar();

  stimFieldName.value = stim.name || '';
  setSelectedStimulusFunctions(stim.functions || (stim.primaryFunction ? [stim.primaryFunction] : ['legitimierend']));

  const inferredType = stim.mediaType || (stim.imageUrl ? 'image' : stim.iframeUrl ? 'iframe' : 'text');
  stimFieldMediatype.value = inferredType;
  stimFieldImage.value = stim.imageUrl || '';
  stimFieldIframe.value = stim.iframeUrl || '';
  stimFieldContent.value = stim.content || '';

  renderStimulusMediaSlot();

  const modSet = new Set((stim.primaryModules || []).map(Number));
  stimModulesCheckboxes.querySelectorAll('input[name="stim_module"]').forEach(cb => {
    cb.checked = modSet.has(Number(cb.value));
  });

  if (btnDeleteStimulus) btnDeleteStimulus.style.display = 'inline-flex';
  updateStimulusFormPreview();
  renderStimulusEvaluationStats(id);
}

function startNewStimulus(openModal = false) {
  editingStimulusId = null;
  renderStimuliSidebar();

  stimFieldName.value = '';
  setSelectedStimulusFunctions(['legitimierend']);
  stimFieldMediatype.value = 'text';
  stimFieldImage.value = '';
  stimFieldIframe.value = '';
  stimFieldContent.value = '';

  renderStimulusMediaSlot();

  stimModulesCheckboxes.querySelectorAll('input[name="stim_module"]').forEach(cb => {
    cb.checked = false;
  });

  if (btnDeleteStimulus) btnDeleteStimulus.style.display = 'none';
  updateStimulusFormPreview();
  renderStimulusEvaluationStats(null);

  if (openModal && modalStimulusDetail && !modalStimulusDetail.open) {
    modalStimulusDetail.showModal();
  }
  stimFieldName.focus();
}

async function handleStimulusFormSubmit(e) {
  e.preventDefault();
  if (!stimulusForm.checkValidity()) {
    stimulusForm.reportValidity();
    return;
  }

  if (pendingStimulusImageUpload) {
    showStimulusStatus('Warte auf Bildübertragung...', false);
    await pendingStimulusImageUpload;
  }

  const selectedFunctions = getSelectedStimulusFunctions();
  const selectedModules = Array.from(
    stimModulesCheckboxes.querySelectorAll('input[name="stim_module"]:checked')
  ).map(cb => Number(cb.value));

  const imgUrl = (stimFieldImage.value || '').trim();
  const iframeUrl = (stimFieldIframe.value || '').trim();
  const type = imgUrl ? 'image' : iframeUrl ? 'iframe' : 'text';

  const payload = {
    name: stimFieldName.value.trim(),
    functions: selectedFunctions,
    primaryFunction: selectedFunctions[0] || 'legitimierend',
    mediaType: type,
    imageUrl: imgUrl,
    imageData: imgUrl.startsWith('data:image/') ? imgUrl : undefined,
    iframeUrl: iframeUrl,
    content: stimFieldContent.value.trim(),
    primaryModules: selectedModules
  };

  try {
    let res;
    if (editingStimulusId) {
      res = await fetch(`/api/stimuli/${encodeURIComponent(editingStimulusId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch('/api/stimuli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Fehler beim Speichern (Status ${res.status})`);
    }

    const saved = await res.json();
    editingStimulusId = saved.id;
    await fetchStimuli();
    selectStimulusForEdit(saved.id);
    showStimulusStatus(`Reiz "${saved.name}" gespeichert.`);
  } catch (err) {
    showStimulusStatus(err.message || 'Netzwerkfehler beim Speichern', true);
  }
}

async function handleStimulusDelete() {
  if (!editingStimulusId) return;
  const target = stimuli.find(s => s.id === editingStimulusId);
  const title = target ? target.name : 'diesen Reiz';

  if (!window.confirm(`Möchtest du "${title}" wirklich löschen?`)) {
    return;
  }

  try {
    const res = await fetch(`/api/stimuli/${encodeURIComponent(editingStimulusId)}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      throw new Error('Fehler beim Löschen des Reizes');
    }
    editingStimulusId = null;
    if (modalStimulusDetail && modalStimulusDetail.open) {
      modalStimulusDetail.close();
    }
    await fetchStimuli();
  } catch (err) {
    showStimulusStatus(err.message, true);
  }
}

function handleStimulusReset() {
  if (editingStimulusId) {
    selectStimulusForEdit(editingStimulusId);
  } else {
    startNewStimulus(false);
  }
}

// Filter Event Listeners
if (stimFilterFunctionGroup) {
  stimFilterFunctionGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-filter');
    if (!btn) return;
    const fn = btn.dataset.function;
    activeFunctionFilter = (activeFunctionFilter === fn && fn !== 'all') ? 'all' : fn;
    renderStimuliSidebar();
  });
}

if (stimFilterModuleGroup) {
  stimFilterModuleGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-filter');
    if (!btn) return;
    const mod = btn.dataset.module;
    activeModuleFilter = (activeModuleFilter === mod && mod !== 'all') ? 'all' : mod;
    renderStimuliSidebar();
  });
}

if (btnFilterMvp) {
  btnFilterMvp.addEventListener('click', () => {
    activeMvpFilter = !activeMvpFilter;
    renderStimuliSidebar();
  });
}

if (stimViewModeGroup) {
  stimViewModeGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-view-mode]');
    if (!btn) return;
    const mode = btn.dataset.viewMode;
    if (mode && mode !== activeStimuliViewMode) {
      activeStimuliViewMode = mode;
      renderStimuliSidebar();
    }
  });
}

// Modal Schließen (Klick auf X-Button oder Klick außerhalb auf den Backdrop)
if (btnCloseStimulusModal && modalStimulusDetail) {
  btnCloseStimulusModal.addEventListener('click', () => {
    modalStimulusDetail.close();
  });
}

if (modalStimulusDetail) {
  modalStimulusDetail.addEventListener('click', (e) => {
    if (e.target === modalStimulusDetail) {
      modalStimulusDetail.close();
    }
  });
}

stimFieldName.addEventListener('input', updateStimulusFormPreview);
stimFieldContent.addEventListener('input', updateStimulusFormPreview);
document.querySelectorAll('input[name="stim_function"]').forEach(cb => {
  cb.addEventListener('change', updateStimulusFormPreview);
});
if (stimModulesCheckboxes) {
  stimModulesCheckboxes.addEventListener('change', updateStimulusFormPreview);
}

// Globaler Paste-Listener: Sobald das Reizfenster geöffnet ist, fängt Strg+V kopierte Bilder ab
window.addEventListener('paste', (e) => {
  if (!modalStimulusDetail || !modalStimulusDetail.open) return;
  const items = e.clipboardData?.items;
  if (!items) return;
  for (const item of items) {
    if (item.type && item.type.startsWith('image/')) {
      e.preventDefault();
      const file = item.getAsFile();
      if (file) {
        handleStimulusImageFile(file);
      }
      return;
    }
  }
});

btnNewStimulus.addEventListener('click', () => startNewStimulus(true));
stimulusForm.addEventListener('submit', handleStimulusFormSubmit);
btnDeleteStimulus.addEventListener('click', handleStimulusDelete);
btnResetStimulus.addEventListener('click', handleStimulusReset);

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

// Profil-Reiter Event Listeners
profileTabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    switchProfileTab(btn.dataset.tab);
  });
});

// Einklappen/Ausklappen der erweiterten Proxydaten
if (btnToggleProxyDetails) {
  btnToggleProxyDetails.addEventListener('click', () => {
    const isCollapsed = proxyDetailsContainer.style.display === 'none';
    setProxyDetailsCollapsed(!isCollapsed);
  });
}

// Initial laden
loadInitialData();
