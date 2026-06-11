// Standalone Vanilla JS for BTRT Awards 2026 Portal

// INITIAL HIGH QUALITY REPLICABLE DEMO DATA
const INITIAL_DEMO_NOMINATIONS = [
  {
    id: 'BTRT-7491',
    submittedAt: '2026-05-18',
    status: 'Finalist',
    directorApproval: 'Yes',
    category: 'Cross-boundary Collaboration Award',
    nominatorName: 'Asha Ramasamy',
    nominatorEmail: 'asha.ramasamy@ytlpower.com',
    nominatorCompany: 'YTL Power',
    relationship: 'Cross-company collaborator',
    nomineeName: 'Nadia Lim',
    nomineeEmail: 'nadia.lim@ytlhotels.com',
    nomineeCompany: 'YTL Hotels',
    nomineeDepartment: 'Guest Experience & CRM',
    jobTitle: 'Assistant Operations Manager',
    location: 'Kuala Lumpur, Malaysia',
    values: ['Togetherness', 'Vitality'],
    situation: 'During a peak cross-promotional campaign between YTL Hotels and YTL Communications (YES 5G) in late 2025, a multi-property syncing error was leaving premium subscribers unable to claim loyalty packages, risking direct customer churn and bad reputation.',
    task: 'Nadia had to rapidly coordinate customer-support protocols across multiple luxury hotel desks and tech teams, with no prior standard operating procedures in place.',
    action: 'She pro-actively designed a same-day live Google-Sheets master escalations tracker, trained 14 front-of-house staff across 3 cities via ad-hoc virtual huddles, and personally answered support prompts until 11:30 PM for 5 straight days.',
    result: 'She closed 100% of the 142 loyalty conflict cases within 48 hours, fully retaining luxury subscribers and turning 3 frustrated guests into active brand promoters with personalized gift boxes. Her shared tracker became the official template for future joint ventures.',
    worthiness: 'Nadia displayed incredible leadership, empathy, and collaborative spirit. She bridged two distinct business units with zero friction and saved a crucial corporate partnership from severe PR strain.',
    evidenceLink: 'https://internal.ytl.net/projects/customer-sync-recovery-report.pdf',
    internalNotes: 'HR confirmed Nadia has been in good standing for 3 years. HOD verified that her tracker reduced cross-company escalation resolution time by 75%. Outstanding collaboration.',
    checklistChecked: ['eligible', 'strong_evidence', 'vetted'],
    scores: {
      'Judge 01': {
        judgeName: 'Judge 01',
        ratings: { impact: 5, values: 5, initiative: 4, togetherness: 5, evidence: 4 },
        comments: 'Outstanding display of multi-divisional teamwork. Her fast reaction prevented major customer drop-offs.',
        updatedAt: '2026-06-05T14:20:00Z'
      },
      'Judge 02': {
        judgeName: 'Judge 02',
        ratings: { impact: 4, values: 5, initiative: 5, togetherness: 5, evidence: 5 },
        comments: 'Amazing star story. A true ambassador for "Togetherness". Solid metrics included.',
        updatedAt: '2026-06-06T09:12:00Z'
      }
    }
  },
  {
    id: 'BTRT-5029',
    submittedAt: '2026-05-20',
    status: 'Finalist',
    directorApproval: 'Yes',
    category: 'BTRT Peak Performer of the Year',
    nominatorName: 'Daniel Ong',
    nominatorEmail: 'daniel.ong@ytlcement.com.my',
    nominatorCompany: 'YTL Cement',
    relationship: 'Direct manager',
    nomineeName: 'Farah Aziz',
    nomineeEmail: 'farah.aziz@ytlcement.com.my',
    nomineeCompany: 'YTL Cement',
    nomineeDepartment: 'Plant Operations',
    jobTitle: 'Process Engineer',
    location: 'Perak, Malaysia',
    values: ['Hard Work', 'Moral Responsibility'],
    situation: 'A critical raw material mill experienced extreme temperature fluctuations in active operation, threatening a safety shutdown and delaying concrete distribution across key state infrastructure projects.',
    task: 'Farah was tasked with diagnosing the dynamic thermal issue and proposing a sustainable engineering workaround within a strict 36-hour window without stopping the kiln entirely.',
    action: 'She analyzed 18 months of historical sensor logs, discovered a clogged auxiliary water-spray nozzle, crawled safely into the secondary ducting with the maintenance crew during off-peak hours, and implemented a self-purging filtration valve.',
    result: 'The mill stabilized temperature levels within 12 hours. Her modification prevented over $80,000 in lost raw inventory and kept essential concrete shipments perfectly on schedule for the state rail construction.',
    worthiness: 'Farah slept on-site for two days to monitor the pressure variables. Her technological ingenuity and high ethical responsibility to protect both work safety and client deliverable timelines are exemplary.',
    evidenceLink: 'YTL Cement Internal Wiki - Thermal Purging optimization log',
    internalNotes: 'HOD validated engineering report. Safe operations award presented. Promising nominee for peak performer category.',
    checklistChecked: ['eligible', 'strong_evidence', 'vetted'],
    scores: {
      'Judge 01': {
        judgeName: 'Judge 01',
        ratings: { impact: 5, values: 4, initiative: 5, togetherness: 3, evidence: 5 },
        comments: 'Excellent engineering results. High technical difficulty handled expertly. High evidence strength.',
        updatedAt: '2026-06-07T11:00:00Z'
      }
    }
  }
];

let nominations = [];
let reviewerUnlocked = false;
let activeTab = 'landing';
let activeJudge = 'Judge 01';
let currentEditingNomId = null;

// --- INITIALIZE ---
function init() {
  const savedNoms = localStorage.getItem('btrt_nominations_static_v5');
  const savedUnlocked = sessionStorage.getItem('btrt_reviewer_unlocked_static');

  if (savedNoms) {
    nominations = JSON.parse(savedNoms);
  } else {
    nominations = INITIAL_DEMO_NOMINATIONS;
    localStorage.setItem('btrt_nominations_static_v5', JSON.stringify(INITIAL_DEMO_NOMINATIONS));
  }

  if (savedUnlocked === 'true') {
    reviewerUnlocked = true;
  }

  updateAuthUI();
  populateCompanyFilters();
  switchTab('landing');
}

// --- UTILS ---
function saveToStorage() {
  localStorage.setItem('btrt_nominations_static_v5', JSON.stringify(nominations));
  updateStatsKPI();
}

function showToast(message) {
  const toast = document.getElementById('toastBox');
  const toastMsg = document.getElementById('toastMsg');
  toastMsg.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('flex');
  setTimeout(() => {
    toast.classList.add('hidden');
    toast.classList.remove('flex');
  }, 3500);
}

function toggleModal(id, show) {
  const modal = document.getElementById(id);
  if (show) modal.classList.remove('hidden');
  else modal.classList.add('hidden');
}

// --- TAB SYSTEM ---
function switchTab(tabId) {
  if (tabId !== 'landing' && tabId !== 'nominate' && !reviewerUnlocked) {
    toggleModal('loginModal', true);
    return;
  }

  activeTab = tabId;
  const panels = document.querySelectorAll('.tab-panel');
  panels.forEach(p => p.classList.add('hidden'));
  document.getElementById(`panel-${tabId}`).classList.remove('hidden');

  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.classList.add('text-slate-300', 'hover:bg-slate-800/55');
    btn.classList.remove('text-amber-500', 'bg-slate-950');
  });

  const activeBtn = document.getElementById(`tab-${tabId}`);
  activeBtn.classList.remove('text-slate-300', 'hover:bg-slate-800/55');
  activeBtn.classList.add('text-amber-500', 'bg-slate-950');

  // Trigger content renderers
  if (tabId === 'review') renderReviewList();
  if (tabId === 'judge') renderJudgeList();
  if (tabId === 'rankings') renderLeaderboard();
}

// --- SECURE HANDLERS ---
function handlePasscodeSubmit(e) {
  e.preventDefault();
  const code = document.getElementById('passCodeField').value;
  const err = document.getElementById('passErr');

  if (code.trim() === 'BTRT2026') {
    reviewerUnlocked = true;
    sessionStorage.setItem('btrt_reviewer_unlocked_static', 'true');
    toggleModal('loginModal', false);
    err.classList.add('hidden');
    document.getElementById('passCodeField').value = '';
    updateAuthUI();
    switchTab('review');
    showToast('Vetting workspace unlocked.', 'success');
  } else {
    err.textContent = 'Invalid passcode. Required key: BTRT2026';
    err.classList.remove('hidden');
  }
}

function updateAuthUI() {
  const badge = document.getElementById('unlockedBadge');
  const bar = document.getElementById('reviewerBar');
  const authBtnText = document.getElementById('authBtnText');
  const locks = document.querySelectorAll('.lock-icon');

  if (reviewerUnlocked) {
    badge.classList.remove('hidden');
    bar.classList.remove('hidden');
    authBtnText.textContent = 'Logout';
    locks.forEach(l => l.classList.add('hidden'));
  } else {
    badge.classList.add('hidden');
    bar.classList.add('hidden');
    authBtnText.textContent = 'Reviewer Access';
    locks.forEach(l => l.classList.remove('hidden'));
  }
  updateStatsKPI();
}

document.getElementById('authBtn').addEventListener('click', () => {
  if (reviewerUnlocked) {
    reviewerUnlocked = false;
    sessionStorage.removeItem('btrt_reviewer_unlocked_static');
    updateAuthUI();
    switchTab('landing');
    showToast('Reviewer session locked.');
  } else {
    toggleModal('loginModal', true);
  }
});

// --- SUBMIT NOMINATION FORM ---
function handleFormSubmit(e) {
  e.preventDefault();
  const consent = document.getElementById('form_consent').checked;
  if (!consent) {
    alert('Please acknowledge the verification consent check before submitting.');
    return;
  }

  const valuesElements = document.querySelectorAll('input[name="values"]:checked');
  const selectedValues = Array.from(valuesElements).map(el => el.value);

  if (selectedValues.length === 0) {
    alert('Kindly check at least one core YTL value.');
    return;
  }

  const newId = 'BTRT-' + Math.floor(1000 + Math.random() * 9000);
  const newNom = {
    id: newId,
    submittedAt: new Date().toISOString().split('T')[0],
    status: 'Peer Submitted',
    directorApproval: 'Pending',
    category: document.getElementById('award_category').value,
    nominatorName: document.getElementById('nom_name').value,
    nominatorEmail: document.getElementById('nom_email').value,
    nominatorCompany: document.getElementById('nom_company').value,
    relationship: document.getElementById('nom_relationship').value,
    nomineeName: document.getElementById('nominee_name').value,
    nomineeEmail: document.getElementById('nominee_email').value,
    nomineeCompany: document.getElementById('nominee_company').value,
    nomineeDepartment: document.getElementById('nominee_department').value,
    jobTitle: document.getElementById('nominee_title').value || 'Officer',
    location: document.getElementById('nominee_location').value || 'KL',
    values: selectedValues,
    situation: document.getElementById('case_s').value,
    task: document.getElementById('case_t').value,
    action: document.getElementById('case_a').value,
    result: document.getElementById('case_r').value,
    worthiness: document.getElementById('case_worthiness').value,
    evidenceLink: document.getElementById('case_evidenceLink').value || '',
    internalNotes: '',
    checklistChecked: []
  };

  nominations.unshift(newNom);
  saveToStorage();
  document.getElementById('nomForm').reset();
  alert(`Successfully submitted under Receipt Reference: ${newId}. Our committee has been refreshed!`);
  switchTab('landing');
}

function fillSampleNomination() {
  document.getElementById('nom_name').value = 'Daniel Tan';
  document.getElementById('nom_email').value = 'daniel.tan@ytlcement.com';
  document.getElementById('nom_company').value = 'YTL Cement (Chemor)';
  document.getElementById('nom_relationship').value = 'Direct Manager / Supervisor';
  document.getElementById('nominee_name').value = 'Kamarul Ariffin';
  document.getElementById('nominee_email').value = 'kamarul.a@ytlcement.com';
  document.getElementById('nominee_company').value = 'YTL Cement';
  document.getElementById('nominee_department').value = 'Safety Management Unit';
  document.getElementById('nominee_title').value = 'Senior Safety Warden';
  document.getElementById('nominee_location').value = 'Chemor Mill, Perak';
  document.getElementById('award_category').value = 'YTL Core Values Ambassador';

  const checkbox = document.querySelectorAll('input[name="values"]');
  checkbox.forEach((cb, idx) => {
    cb.checked = (idx === 0 || idx === 2); // Hard Work, Moral Responsibility
  });

  document.getElementById('case_s').value = 'During heavy rains, a raw limestone stack collapsed near Chemor quarry main conveyor line, risking raw mill blockage and complete conveyor physical disruption.';
  document.getElementById('case_t').value = 'We needed to clear 2.1 tons of limestone drift and inspect the underlying belt frame for cracks within a strict 3-hour period.';
  document.getElementById('case_a').value = 'Kamarul personally coordinated with three excavators, set up weather shelters for belt integrity welds, stayed alongside welders on site, and audited the belt structural sensors.';
  document.getElementById('case_r').value = 'Conveyor stayed fully online, protecting 100% of mill feed with zero delayed cement trucks. Prevented over RM 30,000 in backup kiln fuel expenses.';
  document.getElementById('case_worthiness').value = 'Displays incredible field safety leadership and immense "Moral Responsibility" for onsite contractor safety during rain constraints.';
  showToast('Filled sample STAR case.');
}

// --- DYNAMIC RENDERING CORES ---
function populateCompanyFilters() {
  const select = document.getElementById('companySelect');
  if (!select) return;
  const companies = Array.from(new Set(nominations.map(n => n.nomineeCompany)));
  select.innerHTML = '<option value="All">All Subsidiaries</option>';
  companies.forEach(c => {
    const el = document.createElement('option');
    el.textContent = c;
    el.value = c;
    select.appendChild(el);
  });
}

function updateStatsKPI() {
  document.getElementById('kpiTotal').textContent = nominations.length;
  document.getElementById('kpiFinalists').textContent = nominations.filter(n => n.status === 'Finalist').length;
}

// Vetting / Review Cards list
function renderReviewList() {
  const search = document.getElementById('searchBox').value.toLowerCase();
  const status = document.getElementById('statusSelect').value;
  const company = document.getElementById('companySelect').value;

  const filtered = nominations.filter(nom => {
    const sMatch = nom.nomineeName.toLowerCase().includes(search) || nom.id.toLowerCase().includes(search);
    const statusMatch = status === 'All' || nom.status === status;
    const buMatch = company === 'All' || nom.nomineeCompany === company;
    return sMatch && statusMatch && buMatch;
  });

  const root = document.getElementById('reviewCardsList');
  if (filtered.length === 0) {
    root.innerHTML = '<div class="col-span-full p-8 text-center text-slate-400 font-semibold bg-white border rounded-xl shadow-inner">No matching screened cases.</div>';
    return;
  }

  root.innerHTML = '';
  filtered.forEach(nom => {
    const card = document.createElement('div');
    card.onclick = () => openCandidateDrawer(nom.id);
    card.className = 'bg-white p-5 rounded-2xl border hover:border-slate-350 cursor-pointer flex flex-col justify-between hover:shadow transition-all';
    card.innerHTML = `
      <div class="space-y-3">
        <div class="flex justify-between items-start gap-2">
          <span class="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono font-bold">${nom.id}</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full border font-bold bg-slate-50">${nom.status}</span>
        </div>
        <div>
          <h4 class="font-bold text-slate-900 leading-snug">${nom.nomineeName}</h4>
          <span class="text-xs text-slate-500">${nom.nomineeCompany} • ${nom.nomineeDepartment}</span>
        </div>
        <p class="text-xs text-slate-500 leading-normal line-clamp-2 bg-slate-50 p-2.5 rounded border border-slate-150 mt-1">
          <strong>Result:</strong> ${nom.result}
        </p>
      </div>`;
    root.appendChild(card);
  });
}

// --- SLIDE DETAIL DRAWER ---
function openCandidateDrawer(id) {
  const nom = nominations.find(n => n.id === id);
  if (!nom) return;
  currentEditingNomId = id;

  document.getElementById('drawerName').textContent = nom.nomineeName;
  document.getElementById('drawerTitleSubsidiary').textContent = `${nom.nomineeCompany} • ${nom.nomineeDepartment} • ${nom.jobTitle}`;
  document.getElementById('drawerNominatorLine').textContent = `${nom.nominatorName} (${nom.relationship})`;
  document.getElementById('drawerCaseTextS').textContent = nom.situation;
  document.getElementById('drawerCaseTextT').textContent = nom.task;
  document.getElementById('drawerCaseTextA').textContent = nom.action;
  document.getElementById('drawerCaseTextR').textContent = nom.result;
  document.getElementById('drawerNotes').value = nom.internalNotes || '';

  // Setup Status Dropdowns
  const select = document.getElementById('drawerStatusUpdate');
  select.innerHTML = ['Peer Submitted', 'HR / HOD Review', 'More Info Needed', 'Director Endorsed', 'Finalist', 'Not Shortlisted']
    .map(state => `<option ${nom.status === state ? 'selected' : ''}>${state}</option>`).join('');

  document.getElementById('drawerApprovalUpdate').value = nom.directorApproval || 'Pending';

  // Setup Vetting Checklist
  const chkNames = [
    { key: 'eligible', label: 'Eligible & clear of internal warnings' },
    { key: 'strong_evidence', label: 'Quantitative metrics verified' },
    { key: 'vetted', label: 'HOD verified alignment' }
  ];
  const checklistRoot = document.getElementById('checklistGroup');
  checklistRoot.innerHTML = '';
  chkNames.forEach(item => {
    const isChecked = (nom.checklistChecked || []).includes(item.key);
    const wrap = document.createElement('label');
    wrap.className = 'flex items-center gap-2 cursor-pointer py-1 select-none';
    wrap.innerHTML = `
      <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleDrawerCheck('${item.key}')" class="rounded text-amber-500">
      <span class="text-xs font-semibold  ${isChecked ? 'text-slate-800' : 'text-slate-400'}">${item.label}</span>
    `;
    checklistRoot.appendChild(wrap);
  });

  toggleModal('detailDrawer', true);
}

function toggleDrawerCheck(key) {
  const nom = nominations.find(n => n.id === currentEditingNomId);
  if (!nom) return;
  const current = nom.checklistChecked || [];
  if (current.includes(key)) {
    nom.checklistChecked = current.filter(k => k !== key);
  } else {
    nom.checklistChecked = [...current, key];
  }
  saveToStorage();
  openCandidateDrawer(currentEditingNomId); // refresh checkboxes
}

function updateDrawerStatus() {
  const nom = nominations.find(n => n.id === currentEditingNomId);
  if (!nom) return;
  nom.status = document.getElementById('drawerStatusUpdate').value;
  saveToStorage();
  renderReviewList();
  showToast('Lifecycle updated');
}

function updateDrawerApproval() {
  const nom = nominations.find(n => n.id === currentEditingNomId);
  if (!nom) return;
  nom.directorApproval = document.getElementById('drawerApprovalUpdate').value;
  saveToStorage();
  showToast('Endorsement updated');
}

function updateDrawerNotes() {
  const nom = nominations.find(n => n.id === currentEditingNomId);
  if (!nom) return;
  nom.internalNotes = document.getElementById('drawerNotes').value;
  saveToStorage();
}

function setNominationAsFinalistDirect() {
  const nom = nominations.find(n => n.id === currentEditingNomId);
  if (!nom) return;
  nom.status = 'Finalist';
  nom.directorApproval = 'Yes';
  saveToStorage();
  toggleModal('detailDrawer', false);
  renderReviewList();
  showToast('Nominee shortlisted as final candidate.');
}

// --- JUDGE EVALUATOR GRID ---
function renderJudgeList() {
  activeJudge = document.getElementById('judgeContext').value;
  const finalists = nominations.filter(n => n.status === 'Finalist');

  const root = document.getElementById('judgeCardsList');
  if (finalists.length === 0) {
    root.innerHTML = '<div class="col-span-full p-8 text-center text-slate-400 bg-white border rounded-xl shadow-inner">Shortlist candidates as finalists first to active scoring sheet.</div>';
    return;
  }

  root.innerHTML = '';
  finalists.forEach(nom => {
    const judgeScores = nom.scores || {};
    const record = judgeScores[activeJudge] || { ratings: { impact: 3, values: 3, initiative: 3, togetherness: 3, evidence: 3 }, comments: '' };
    
    const card = document.createElement('div');
    card.className = 'bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative space-y-4';
    card.innerHTML = `
      <div class="flex justify-between items-start gap-4">
        <div>
          <span class="text-[9px] bg-emerald-50 text-emerald-800 border-emerald-250 px-2 rounded font-mono font-bold">FINALIST</span>
          <h4 class="font-bold text-slate-900 mt-1">${nom.nomineeName}</h4>
          <span class="text-xs text-slate-500">${nom.nomineeCompany} • ${nom.nomineeDepartment}</span>
        </div>
      </div>

      <div class="bg-indigo-50/50 p-3 rounded-lg text-xs space-y-1 text-slate-700">
        <p><strong>YTL core values:</strong> ${nom.values.join(', ')}</p>
        <p class="line-clamp-2"><strong>Core STAR action:</strong> ${nom.action}</p>
      </div>

      <div class="bg-amber-50/50 p-4 border rounded-xl space-y-3">
        <h5 class="text-[10px] font-bold text-amber-800 uppercase tracking-widest">&#9733; Individual Standard scoring</h5>
        
        <div class="space-y-2 text-xs font-semibold text-slate-755">
          ${renderStarsSelector(nom.id, 'impact', 'Impact and Results (30% weight)', record.ratings.impact)}
          ${renderStarsSelector(nom.id, 'values', 'YTL value alignment (40% weight)', record.ratings.values)}
          ${renderStarsSelector(nom.id, 'initiative', 'Ownership / Initiative (10% weight)', record.ratings.initiative)}
          ${renderStarsSelector(nom.id, 'togetherness', 'Team synergy (10% weight)', record.ratings.togetherness)}
          ${renderStarsSelector(nom.id, 'evidence', 'Fact check verification (10% weight)', record.ratings.evidence)}
        </div>

        <div class="pt-1.5 flex flex-col justify-start">
          <label class="text-[10px] text-slate-400 block uppercase mb-1">Judge remarks</label>
          <textarea id="comments-${nom.id}" class="w-full bg-white border rounded-lg px-2 py-1.5 focus:outline-none" rows="2" placeholder="Required evaluation rationale...">${record.comments || ''}</textarea>
        </div>

        <div class="flex justify-between items-center pt-2">
          <span class="text-xs font-black text-slate-700 block">Total weighted score: ${calculatePercentageScore(record.ratings)}%</span>
          <button onclick="saveVanillaJudgeScore('${nom.id}')" class="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-1.5 px-3 rounded-lg">Save star-rating</button>
        </div>
      </div>
    `;
    root.appendChild(card);
  });
}

function renderStarsSelector(nomId, key, label, currentScore) {
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    const active = i <= currentScore;
    starsHtml += `<span onclick="updateVanillaRate('${nomId}', '${key}', ${i})" class="cursor-pointer text-base select-none ${active ? 'text-amber-500' : 'text-slate-300'}">&#9733;</span>`;
  }
  return `
    <div class="flex justify-between items-center bg-white p-1.5 rounded-lg border">
      <span class="text-xs text-slate-650 font-semibold">${label}</span>
      <div class="flex gap-0.5">${starsHtml}</div>
    </div>
  `;
}

function updateVanillaRate(nomId, key, score) {
  const nom = nominations.find(n => n.id === nomId);
  if (!nom) return;
  nom.scores = nom.scores || {};
  nom.scores[activeJudge] = nom.scores[activeJudge] || { judgeName: activeJudge, ratings: { impact: 3, values: 3, initiative: 3, togetherness: 3, evidence: 3 }, comments: '' };
  nom.scores[activeJudge].ratings[key] = score;
  saveToStorage();
  renderJudgeList();
}

function saveVanillaJudgeScore(nomId) {
  const nom = nominations.find(n => n.id === nomId);
  const comments = document.getElementById(`comments-${nomId}`).value;

  if (nom && nom.scores && nom.scores[activeJudge]) {
    nom.scores[activeJudge].comments = comments;
    nom.scores[activeJudge].updatedAt = new Date().toISOString();
    saveToStorage();
    showToast(`Weighted score submitted successfully under ${activeJudge}.`);
  }
}

function calculatePercentageScore(ratings) {
  const sum = ratings.impact + ratings.values + ratings.initiative + ratings.togetherness + ratings.evidence;
  return ((sum / 25) * 100).toFixed(1);
}

// --- RANKINGS CORES ---
function getNomineeAverages(nom) {
  const scores = Object.values(nom.scores || {});
  if (scores.length === 0) return { scale100: 0, count: 0 };

  let sumAll = 0;
  scores.forEach(element => {
    const scoreSum = element.ratings.impact + element.ratings.values + element.ratings.initiative + element.ratings.togetherness + element.ratings.evidence;
    sumAll += (scoreSum / 25) * 100;
  });

  return { scale100: sumAll / scores.length, count: scores.length };
}

function renderLeaderboard() {
  const finalists = nominations
    .filter(n => n.status === 'Finalist')
    .map(n => ({
      nom: n,
      avg: getNomineeAverages(n)
    }))
    .sort((a, b) => b.avg.scale100 - a.avg.scale100);

  const body = document.getElementById('leaderboardBody');
  if (finalists.length === 0) {
    body.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-slate-400 font-bold">Leaderboard registry is currently empty. shortlist finalists to proceed.</td></tr>';
    return;
  }

  body.innerHTML = '';
  finalists.forEach((f, idx) => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors border-b';
    tr.innerHTML = `
      <td class="p-4 text-center font-bold text-slate-600">${idx + 1}</td>
      <td class="p-4 font-semibold text-slate-900">
        <div>${f.nom.nomineeName}</div>
        <span class="text-[10px] text-slate-400 font-mono tracking-tight block uppercase">${f.nom.id}</span>
      </td>
      <td class="p-4 text-xs font-semibold text-slate-700">${f.nom.nomineeCompany} • ${f.nom.nomineeDepartment}</td>
      <td class="p-4 text-xs text-slate-600">${f.nom.values.join(', ')}</td>
      <td class="p-4 text-center">
        <span class="text-xs bg-emerald-50 text-emerald-800 border-emerald-100 border px-2.5 py-1.5 rounded-lg font-black">${f.avg.scale100.toFixed(1)}%</span>
      </td>
      <td class="p-4 text-center text-xs font-mono font-bold text-slate-500">${f.avg.count} records</td>
    `;
    body.appendChild(tr);
  });
}

// --- OPERATIONS SERVICES ---
function seedDemoData() {
  nominations = INITIAL_DEMO_NOMINATIONS;
  saveToStorage();
  populateCompanyFilters();
  switchTab('landing');
  showToast('8 mock nominations restored');
}

function clearAllData() {
  if (confirm('Erase all local nomination cache in this browser?')) {
    nominations = [];
    saveToStorage();
    populateCompanyFilters();
    showToast('Mock cleared');
    switchTab('landing');
  }
}

// BOOTSTRAP INIT ON CORES LOAD
document.addEventListener('DOMContentLoaded', () => {
  init();
});
