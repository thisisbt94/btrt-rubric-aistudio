import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  Users,
  FileText,
  Search,
  SlidersHorizontal,
  Lock,
  Unlock,
  ChevronRight,
  Plus,
  Trash2,
  Download,
  Star,
  Eye,
  Send,
  HelpCircle,
  Building,
  MapPin,
  Sparkles,
  RefreshCw,
  X,
  FileJson,
  FileSpreadsheet,
  Check,
  AlertCircle,
  ExternalLink,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Nomination,
  JudgeScore,
  YTL_VALUES,
  CATEGORIES,
  INITIAL_DEMO_NOMINATIONS
} from './data/demoData';

export default function App() {
  // --- STATE ---
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [reviewerUnlocked, setReviewerUnlocked] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [passcode, setPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  
  // Search and Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [companyFilter, setCompanyFilter] = useState<string>('All');
  const [selectedNomination, setSelectedNomination] = useState<Nomination | null>(null);

  // Judge State
  const [activeJudge, setActiveJudge] = useState<string>('Judge 01');

  // New Nomination Form State
  const [formData, setFormData] = useState({
    nominatorName: '',
    nominatorEmail: '',
    nominatorCompany: '',
    relationship: '',
    nomineeName: '',
    nomineeEmail: '',
    nomineeCompany: '',
    nomineeDepartment: '',
    jobTitle: '',
    location: '',
    category: CATEGORIES[0],
    values: [] as string[],
    situation: '',
    task: '',
    action: '',
    result: '',
    worthiness: '',
    evidenceLink: '',
    consent: false
  });

  // Reference Code State (for successful nomination modal)
  const [successReferenceId, setSuccessReferenceId] = useState<string | null>(null);

  // Toasts
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // --- INITIALIZATION & LOCALSTORAGE ---
  useEffect(() => {
    const savedNoms = localStorage.getItem('btrt_nominations_v5');
    const savedUnlocked = sessionStorage.getItem('btrt_reviewer_unlocked');
    
    if (savedNoms) {
      setNominations(JSON.parse(savedNoms));
    } else {
      // Set initial high-quality demo data on very first load
      setNominations(INITIAL_DEMO_NOMINATIONS);
      localStorage.setItem('btrt_nominations_v5', JSON.stringify(INITIAL_DEMO_NOMINATIONS));
    }

    if (savedUnlocked === 'true') {
      setReviewerUnlocked(true);
    }
  }, []);

  const saveNominationsState = (updatedList: Nomination[]) => {
    setNominations(updatedList);
    localStorage.setItem('btrt_nominations_v5', JSON.stringify(updatedList));
  };

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // --- HANDLERS ---
  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'BTRT2026') {
      setReviewerUnlocked(true);
      sessionStorage.setItem('btrt_reviewer_unlocked', 'true');
      setShowLoginModal(false);
      setPasscode('');
      setPasscodeError('');
      triggerToast('Reviewer & Judge credentials unlocked successfully.', 'success');
      setActiveTab('review');
    } else {
      setPasscodeError('Invalid passcode. Hint: Use BTRT2026 for this demonstration.');
      triggerToast('Access denied. Please check passcode.', 'error');
    }
  };

  const handleLogout = () => {
    setReviewerUnlocked(false);
    sessionStorage.removeItem('btrt_reviewer_unlocked');
    setActiveTab('landing');
    triggerToast('Logged out of Reviewer Workspace.', 'info');
  };

  const handleValueCheckbox = (valueName: string) => {
    setFormData(prev => {
      const alreadyChecked = prev.values.includes(valueName);
      return {
        ...prev,
        values: alreadyChecked 
          ? prev.values.filter(v => v !== valueName) 
          : [...prev.values, valueName]
      };
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      triggerToast('You must confirm the consent checkbox to nominate.', 'error');
      return;
    }
    if (formData.values.length === 0) {
      triggerToast('Please select at least one YTL core value.', 'error');
      return;
    }

    const referenceId = `BTRT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newNomination: Nomination = {
      id: referenceId,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Peer Submitted',
      directorApproval: 'Pending',
      category: formData.category,
      nominatorName: formData.nominatorName,
      nominatorEmail: formData.nominatorEmail,
      nominatorCompany: formData.nominatorCompany,
      relationship: formData.relationship,
      nomineeName: formData.nomineeName,
      nomineeEmail: formData.nomineeEmail,
      nomineeCompany: formData.nomineeCompany,
      nomineeDepartment: formData.nomineeDepartment,
      jobTitle: formData.jobTitle || 'Unspecified Title',
      location: formData.location || 'Kuala Lumpur',
      values: formData.values,
      situation: formData.situation,
      task: formData.task,
      action: formData.action,
      result: formData.result,
      worthiness: formData.worthiness,
      evidenceLink: formData.evidenceLink,
      internalNotes: '',
      checklistChecked: []
    };

    const updated = [newNomination, ...nominations];
    saveNominationsState(updated);
    setSuccessReferenceId(referenceId);
    triggerToast(`Nomination ${referenceId} submitted successfully!`, 'success');

    // Reset Form
    setFormData({
      nominatorName: '',
      nominatorEmail: '',
      nominatorCompany: '',
      relationship: '',
      nomineeName: '',
      nomineeEmail: '',
      nomineeCompany: '',
      nomineeDepartment: '',
      jobTitle: '',
      location: '',
      category: CATEGORIES[0],
      values: [],
      situation: '',
      task: '',
      action: '',
      result: '',
      worthiness: '',
      evidenceLink: '',
      consent: false
    });
  };

  const fillSampleNomination = () => {
    setFormData({
      nominatorName: 'Marcus Goei',
      nominatorEmail: 'marcus.goei@ytlpower.com',
      nominatorCompany: 'YTL Power International',
      relationship: 'Direct manager',
      nomineeName: 'Siti Norhaliza',
      nomineeEmail: 'siti.nor@ytlpower.com',
      nomineeCompany: 'YTL Power International',
      nomineeDepartment: 'Technical Support',
      jobTitle: 'Senior Field Technician',
      location: 'Kuala Lumpur, Malaysia',
      category: 'Unsung Hero Recognition',
      values: ['Hard Work', 'Togetherness'],
      situation: 'A sudden electrical failure at our key communications routing hub dropped network connectivity for over 50 corporate clients on a rainy Sunday afternoon at 2 PM.',
      task: 'The standby engineer was sick, and we needed to manually swap the fault switchboard before backup battery limits ran completely dry at 4:30 PM.',
      action: 'Siti, despite being on roster leave, voluntarily rushed to the terminal node in high rain, diagnosed a faulty fuse bridge, negotiated a replacement unit directly with a nearby hardware supplier, and rewired the main relay loop block.',
      result: 'She restored online status at exactly 3:55 PM (35 minutes before system black-out). Kept critical customer networks operational with zero SLA penalty fee losses (saving circa RM 45,000 in SLA penalties).',
      worthiness: 'Siti demonstrated top-tier ownership, responsiveness, and resilience under pressure on a non-working day.',
      evidenceLink: 'https://internal.ytl.net/ops/sla-incident-recovery- Sunday.pdf',
      consent: true
    });
    triggerToast('Sample STAR data filled into form input.', 'info');
  };

  const loadDemoData = () => {
    saveNominationsState(INITIAL_DEMO_NOMINATIONS);
    triggerToast('All 8 realistic demo nominations restored to LocalStorage.', 'success');
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all nominations? This will wipe your browser storage for this mockup.')) {
      setNominations([]);
      localStorage.removeItem('btrt_nominations_v5');
      triggerToast('All nominations cleared.', 'info');
    }
  };

  // --- INTERNAL ADMINISTRATIVE MUTATORS ---
  const handleUpdateStatus = (id: string, nextStatus: Nomination['status']) => {
    const nextList = nominations.map(nom => {
      if (nom.id === id) {
        let approval = nom.directorApproval;
        if (nextStatus === 'Finalist' || nextStatus === 'Director Endorsed') {
          approval = 'Yes';
        } else if (nextStatus === 'Not Shortlisted') {
          approval = 'No';
        }
        return { ...nom, status: nextStatus, directorApproval: approval };
      }
      return nom;
    });
    saveNominationsState(nextList);
    if (selectedNomination && selectedNomination.id === id) {
      setSelectedNomination(prev => prev ? { ...prev, status: nextStatus, directorApproval: nextStatus === 'Finalist' || nextStatus === 'Director Endorsed' ? 'Yes' : 'No' } : null);
    }
    triggerToast(`Status updated to: ${nextStatus}`, 'success');
  };

  const handleUpdateDirectorApproval = (id: string, approval: Nomination['directorApproval']) => {
    const nextList = nominations.map(nom => {
      if (nom.id === id) {
        return { ...nom, directorApproval: approval };
      }
      return nom;
    });
    saveNominationsState(nextList);
    if (selectedNomination && selectedNomination.id === id) {
      setSelectedNomination(prev => prev ? { ...prev, directorApproval: approval } : null);
    }
    triggerToast(`Director approval set to: ${approval}`, 'success');
  };

  const handleUpdateInternalNotes = (id: string, notes: string) => {
    const nextList = nominations.map(nom => {
      if (nom.id === id) {
        return { ...nom, internalNotes: notes };
      }
      return nom;
    });
    saveNominationsState(nextList);
    if (selectedNomination && selectedNomination.id === id) {
      setSelectedNomination(prev => prev ? { ...prev, internalNotes: notes } : null);
    }
  };

  const handleToggleChecklist = (id: string, key: string) => {
    const nextList = nominations.map(nom => {
      if (nom.id === id) {
        const currentChecked = nom.checklistChecked || [];
        const nextChecked = currentChecked.includes(key)
          ? currentChecked.filter(k => k !== key)
          : [...currentChecked, key];
        return { ...nom, checklistChecked: nextChecked };
      }
      return nom;
    });
    saveNominationsState(nextList);
    if (selectedNomination && selectedNomination.id === id) {
      setSelectedNomination(prev => {
        if (!prev) return null;
        const currentChecked = prev.checklistChecked || [];
        const nextChecked = currentChecked.includes(key)
          ? currentChecked.filter(k => k !== key)
          : [...currentChecked, key];
        return { ...prev, checklistChecked: nextChecked };
      });
    }
  };

  // --- JUDGE EVALUATION MUTATORS ---
  const handleSaveJudgeScore = (nomId: string, ratings: JudgeScore['ratings'], comments: string) => {
    const nextList = nominations.map(nom => {
      if (nom.id === nomId) {
        const currentScores = nom.scores || {};
        currentScores[activeJudge] = {
          judgeName: activeJudge,
          ratings,
          comments,
          updatedAt: new Date().toISOString()
        };
        return { ...nom, scores: currentScores };
      }
      return nom;
    });
    saveNominationsState(nextList);
    triggerToast(`Score submitted to leaderboard under ${activeJudge}.`, 'success');
  };

  // --- CALCULATORS & SELECTORS ---
  const getAverageScore = (nom: Nomination) => {
    const scoreMap = nom.scores || {};
    const judgesList = Object.values(scoreMap);
    if (judgesList.length === 0) return { raw: 0, scale100: 0, count: 0 };

    let totalPoints = 0;
    judgesList.forEach(score => {
      // Sum the 5 criteria (each 1-5, bringing maximum score to 25)
      const sum = score.ratings.impact + score.ratings.values + score.ratings.initiative + score.ratings.togetherness + score.ratings.evidence;
      // Convert to a pristine 100-point scale
      const percentage = (sum / 25) * 100;
      totalPoints += percentage;
    });

    const averagePercentage = totalPoints / judgesList.length;
    return {
      raw: (averagePercentage / 100) * 25, // back to out-of-25 scale
      scale100: averagePercentage,
      count: judgesList.length
    };
  };

  // Get filtered nominations
  const filteredNominations = nominations.filter(nom => {
    const matchSearch = 
      nom.nomineeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nom.nominatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nom.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nom.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nom.nomineeCompany.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchStatus = statusFilter === 'All' || nom.status === statusFilter;
    const matchCompany = companyFilter === 'All' || nom.nomineeCompany === companyFilter;

    return matchSearch && matchStatus && matchCompany;
  });

  // Unique companies for filters
  const uniqueCompanies = Array.from(new Set(nominations.map(n => n.nomineeCompany)));

  // KPI calculations
  const kpiTotal = nominations.length;
  const kpiPending = nominations.filter(n => n.status === 'Peer Submitted').length;
  const kpiMoreInfo = nominations.filter(n => n.status === 'More Info Needed').length;
  const kpiEndorsed = nominations.filter(n => n.status === 'Director Endorsed').length;
  const kpiFinalists = nominations.filter(n => n.status === 'Finalist').length;
  const kpiJudged = nominations.filter(n => n.status === 'Finalist' && n.scores && Object.keys(n.scores).length > 0).length;

  // Finalists sorted for rankings
  const rankedFinalists = nominations
    .filter(n => n.status === 'Finalist')
    .map(n => ({
      nom: n,
      score: getAverageScore(n)
    }))
    .sort((a, b) => b.score.scale100 - a.score.scale100);

  // --- EXPORT TO CSV ---
  const exportToCSV = () => {
    const headers = [
      'Nomination ID',
      'Status',
      'Director Endorsement',
      'Category',
      'Nominee Name',
      'Nominee Email',
      'Nominee Company',
      'Nominee Department',
      'Job Title',
      'Nominator Name',
      'Nominator Email',
      'YTL Values Highlighted',
      'S.T.A.R. Situation',
      'S.T.A.R. Task',
      'S.T.A.R. Action',
      'S.T.A.R. Result',
      'Case Worthiness',
      'Evidence Reference Link',
      'Average Judge score (% scale)',
      'Total Score Records'
    ];

    const rows = nominations.map(nom => {
      const avg = getAverageScore(nom);
      return [
        nom.id,
        nom.status,
        nom.directorApproval,
        `"${nom.category.replace(/"/g, '""')}"`,
        `"${nom.nomineeName.replace(/"/g, '""')}"`,
        nom.nomineeEmail,
        `"${nom.nomineeCompany.replace(/"/g, '""')}"`,
        `"${nom.nomineeDepartment.replace(/"/g, '""')}"`,
        `"${nom.jobTitle.replace(/"/g, '""')}"`,
        `"${nom.nominatorName.replace(/"/g, '""')}"`,
        nom.nominatorEmail,
        `"${nom.values.join(', ')}"`,
        `"${nom.situation?.replace(/"/g, '""') || ''}"`,
        `"${nom.task?.replace(/"/g, '""') || ''}"`,
        `"${nom.action?.replace(/"/g, '""') || ''}"`,
        `"${nom.result?.replace(/"/g, '""') || ''}"`,
        `"${nom.worthiness?.replace(/"/g, '""') || ''}"`,
        `"${nom.evidenceLink?.replace(/"/g, '""') || ''}"`,
        avg.count > 0 ? avg.scale100.toFixed(1) : 'No Scores',
        avg.count
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `btrt_awards_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('CSV checklist exported successfully.', 'success');
  };

  // --- EXPORT TO JSON ---
  const exportToJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(nominations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `btrt_awards_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast('JSON schema exported successfully.', 'success');
  };

  // Static Standalone Files Mock Content Generation (For GitHub Pages download)
  const getStaticHTMLCode = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BTRT Awards 2026 Nomination Portal</title>
  <!-- Tailwind CSS CDN for high-fidelity styled view -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-slate-50 text-slate-900 font-sans">
  <!-- Interactive Static UI generated by AI Studio. See local styles.css -->
  ...
</body>
</html>`;
  };

  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-sans transition-all duration-300">
      
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-semibold text-white ${
              toast.type === 'success' ? 'bg-slate-900 border-l-4 border-emerald-500' :
              toast.type === 'error' ? 'bg-red-950 border-l-4 border-red-500 text-red-100' :
              'bg-blue-950 border-l-4 border-cyan-400'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
            {toast.type === 'info' && <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER */}
      <header className="bg-slate-900 text-white border-b border-slate-800 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md">
              <Award className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] tracking-widest text-indigo-400 font-mono font-bold block uppercase">
                YTL Group Excellence Registry
              </span>
              <h1 className="text-lg font-bold font-display tracking-tight text-slate-100 flex items-center gap-2">
                BTRT Awards 2026 <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono font-normal">Internal Mock Portal</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!reviewerUnlocked ? (
               <button
                 id="openLogin"
                 onClick={() => setShowLoginModal(true)}
                 className="bg-slate-950 border border-slate-800 hover:border-indigo-500 transition-all px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 hover:text-indigo-400 cursor-pointer"
               >
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Reviewer & Judge Access</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="bg-emerald-950/80 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-800 flex items-center gap-1.5 shadow-inner">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block animate-ping" />
                  <span>Reviewer Mode Active</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-950/70 text-red-200 border border-red-900/60 hover:bg-red-900/90 transition-all px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-100 cursor-pointer"
                >
                  Exit Reviewer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PORTAL NAV TABS */}
        <div className="bg-slate-950/90 backdrop-blur-md px-4 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto flex items-center overflow-x-auto gap-2 no-scrollbar py-2">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer ${
                activeTab === 'landing' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              Portal Overview
            </button>
            <button
              onClick={() => setActiveTab('nominate')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer ${
                activeTab === 'nominate' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              Submit Nomination
            </button>
            <button
              onClick={() => reviewerUnlocked ? setActiveTab('review') : setShowLoginModal(true)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                !reviewerUnlocked ? 'opacity-60' : ''
              } ${activeTab === 'review' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/60'}`}
            >
              {!reviewerUnlocked && <Lock className="w-3.5 h-3.5 text-slate-400" />}
              HR/HOD Review Workspace
            </button>
            <button
              onClick={() => reviewerUnlocked ? setActiveTab('judge') : setShowLoginModal(true)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                !reviewerUnlocked ? 'opacity-60' : ''
              } ${activeTab === 'judge' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/60'}`}
            >
              {!reviewerUnlocked && <Lock className="w-3.5 h-3.5 text-slate-400" />}
              Judge Scoring Panel
            </button>
            <button
              onClick={() => reviewerUnlocked ? setActiveTab('rankings') : setShowLoginModal(true)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                !reviewerUnlocked ? 'opacity-60' : ''
              } ${activeTab === 'rankings' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/60'}`}
            >
              {!reviewerUnlocked && <Lock className="w-3.5 h-3.5 text-slate-400" />}
              Leaderboard & Rankings
            </button>
            <button
              onClick={() => setActiveTab('static-code')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 text-indigo-400 hover:bg-slate-800/60 border border-dashed border-indigo-805/40 cursor-pointer ${
                activeTab === 'static-code' ? 'bg-indigo-950 text-indigo-300 border-indigo-500 font-bold' : ''
              }`}
            >
              🔧 Deploy Static Files
            </button>
          </div>
        </div>
      </header>

      {/* DYNAMIC PROGRESS TIMELINE */}
      <section className="bg-slate-900 border-b border-slate-800/90 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { step: '1', title: 'Peer Nomination', desc: 'Employees submit S.T.A.R. stories' },
              { step: '2', title: 'HR/HOD Review', desc: 'Eligibility & facts validated' },
              { step: '3', title: 'Finalist Shortlist', desc: 'Top ~20 selected' },
              { step: '4', title: 'Director Judging', desc: 'Rubric star scoring' },
              { step: '5', title: 'Award Showcase', desc: 'Official ceremony selection' }
            ].map((st, idx) => {
              const tabStepsMapping: Record<string, string[]> = {
                'landing': [],
                'nominate': ['1'],
                'review': ['1', '2'],
                'judge': ['1', '2', '3', '4'],
                'rankings': ['1', '2', '3', '4', '5']
              };
              const isPassed = tabStepsMapping[activeTab]?.includes(st.step);
              const isCurrent = (activeTab === 'nominate' && st.step === '1') ||
                                (activeTab === 'review' && st.step === '2') ||
                                (activeTab === 'judge' && st.step === '4') ||
                                (activeTab === 'rankings' && st.step === '5') ||
                                (activeTab === 'landing' && idx === 0);

              return (
                <div
                  key={st.step}
                  className={`p-3 rounded-xl transition-all duration-300 border ${
                    isCurrent ? 'bg-slate-850 border-indigo-500 shadow-lg shadow-indigo-500/10 animate-pulse-subtle' :
                    isPassed ? 'bg-slate-800/50 border-emerald-650 text-slate-300' :
                    'bg-slate-950/20 border-slate-850 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCurrent ? 'bg-indigo-600 text-white font-extrabold shadow-sm' :
                      isPassed ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' :
                      'bg-slate-900 text-slate-400'
                    }`}>
                      {isPassed ? '✓' : st.step}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider block">{st.title}</span>
                  </div>
                  <span className="text-[11px] block leading-tight text-slate-400">{st.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LIVE STATISTICS GRAPHICAL BAR */}
      {reviewerUnlocked && (
        <section className="bg-slate-100/90 border-b border-slate-200 py-3 block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
              Workspace Overview Panel:
            </span>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
                <span className="text-slate-400 text-xs">Total nominations:</span>
                <span className="font-bold text-slate-800">{kpiTotal}</span>
              </div>
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
                <span className="text-yellow-600 text-xs font-medium">Pending validation:</span>
                <span className="font-bold text-yellow-600 bg-yellow-50 px-1.5 rounded text-sm">{kpiPending}</span>
              </div>
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
                <span className="text-blue-600 text-xs font-medium">HR Endorsed:</span>
                <span className="font-bold text-blue-600">{kpiEndorsed}</span>
              </div>
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
                <span className="text-emerald-700 text-xs font-medium">Shortlisted Finalists:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 rounded text-sm">{kpiFinalists}</span>
              </div>
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
                <span className="text-slate-500 text-xs">Scored:</span>
                <span className="font-bold text-slate-700">{kpiJudged} (avg)</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">

        {/* 1. PORTAL OVERVIEW LANDING TAB */}
        {activeTab === 'landing' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
          >
            {/* Left side info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                  <span>Employee Recognition Programme</span>
                </div>
                
                <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight mb-4">
                  Honouring the Extraordinary Stories That Shape YTL
                </h2>
                
                <p className="text-slate-600 leading-relaxed mb-6 text-base sm:text-lg font-medium">
                  Welcome to the official <strong>BTRT Awards 2026 Nomination Portal</strong>. 
                  This internal platform was built to celebrate employees and volunteers across the YTL family 
                  who consistently bring our values of <strong>Hard Work, Honesty, Moral Responsibility, Togetherness, 
                  and Vitality</strong> to life.
                </p>

                <div className="border-t border-slate-150 pt-6 mt-6">
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-400 mb-3 block">
                    Important Strategic Position
                  </h3>
                  <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <p className="text-slate-600 text-sm leading-relaxed">
                      This award is <strong>peer-nominated</strong>, but it is <strong>not a popularity contest</strong>. 
                      Every submission undergoes standard HR/HOD eligibility screening and strict Director-level validation. 
                      The finalized shortlist of 20 finalists is then reviewed by senior judicial panels using a weighted corporate rubric. 
                      Winners represent absolute excellence.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  <button
                    onClick={() => setActiveTab('nominate')}
                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
                  >
                    Nominate a Colleague Now
                    <ChevronRight className="w-4 h-4 text-indigo-200" />
                  </button>
                  <button
                    onClick={() => reviewerUnlocked ? setActiveTab('review') : setShowLoginModal(true)}
                    className="border border-slate-300 text-slate-750 hover:bg-slate-50 px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    Review Workspace
                  </button>
                </div>
              </div>

              {/* BTRT Values Showcase Grid */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-4">
                  The Core Pillars: Our YTL Values
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {YTL_VALUES.map((val) => (
                    <div key={val.name} className="bg-white border border-slate-200 hover:border-slate-300 p-5 rounded-xl shadow-sm transition-all hover:shadow-md">
                      <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full inline-block mr-2" />
                      <h4 className="font-bold text-slate-900 inline">{val.name}</h4>
                      <p className="text-xs text-slate-500 leading-normal mt-2">
                        {val.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side helper sidebar */}
            <div className="space-y-6">
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 -translate-y-16 translate-x-12 opacity-10 pointer-events-none">
                  <Award className="w-72 h-72 text-indigo-500/20" />
                </div>
                
                <h3 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span>The BTRT Award Process</span>
                </h3>
                
                <ol className="relative border-l border-slate-850 space-y-5 ml-2.5 mt-4">
                  <li className="ml-6">
                    <span className="absolute flex items-center justify-center w-5 h-5 bg-indigo-600 rounded-full -left-2.5 font-mono text-[10px] text-white font-black">1</span>
                    <h4 className="font-bold text-xs text-indigo-350 uppercase tracking-widest">Step 1: Peer Nominated</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-normal">
                      Employees write detailed STAR stories clarifying individual effort, measurable outputs, and proof.
                    </p>
                  </li>
                  <li className="ml-6">
                    <span className="absolute flex items-center justify-center w-5 h-5 bg-slate-800 rounded-full -left-2.5 font-mono text-[10px] text-slate-400">2</span>
                    <h4 className="font-bold text-xs text-slate-350 uppercase tracking-widest">Step 2: HR / HOD Review</h4>
                    <p className="text-xs text-slate-450 mt-1 leading-normal">
                      HR verifies conduct and HODs confirm exact figures, marking cases as Endorsed or Needs Info.
                    </p>
                  </li>
                  <li className="ml-6">
                    <span className="absolute flex items-center justify-center w-5 h-5 bg-slate-800 rounded-full -left-2.5 font-mono text-[10px] text-slate-400">3</span>
                    <h4 className="font-bold text-xs text-slate-350 uppercase tracking-widest">Step 3: Director Endorsement</h4>
                    <p className="text-xs text-slate-450 mt-1 leading-normal">
                      Business Unit heads authorize finalist shortlist inclusion on group level.
                    </p>
                  </li>
                  <li className="ml-6">
                    <span className="absolute flex items-center justify-center w-5 h-5 bg-slate-800 rounded-full -left-2.5 font-mono text-[10px] text-slate-400">4</span>
                    <h4 className="font-bold text-xs text-slate-350 uppercase tracking-widest">Step 4: Director Judging</h4>
                    <p className="text-xs text-slate-450 mt-1 leading-normal">
                      Judges evaluate the top 20 finalists against a standard 1-5 weighted criteria rubric.
                    </p>
                  </li>
                </ol>
              </div>

              {/* Quick Simulator Sandbox */}
              <div className="bg-slate-100 border border-slate-205 p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-slate-650" />
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest block">Prototype Console</h4>
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  Toggle modes to test the mock flow immediately:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={loadDemoData}
                    className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-350 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reset 8 Demo Nominations</span>
                  </button>
                  {!reviewerUnlocked ? (
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-white" />
                      <span>Unlock Reviewer Mode (BTRT2026)</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-950 hover:bg-red-900 border border-red-900 text-slate-100 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Lock Reviewer Workspace</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. EMPLOYEE NOMINATION FORM TAB */}
        {activeTab === 'nominate' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex justify-between items-start gap-4 flex-wrap mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 font-display">New Peer Nomination Submission</h2>
                  <p className="text-sm text-slate-500 mt-1 leading-normal">
                    Please provide precise details about your colleague's accomplishments using the STAR format.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fillSampleNomination}
                  className="bg-indigo-50 text-indigo-700 border border-indigo-200/90 hover:bg-indigo-100 hover:border-indigo-300 transition-all px-4 py-2.5 rounded-xl text-xs font-bold block cursor-pointer"
                >
                  ⚡ Pre-fill Form with STAR Sample
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* PART A: NOMINATOR INFO */}
                <div className="bg-slate-50/80 border border-slate-200 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-2">
                    <span className="text-xs bg-indigo-600 text-white font-mono w-5 h-5 rounded-full flex items-center justify-center font-bold">A</span>
                    <h3 className="font-bold text-indigo-900 text-sm uppercase tracking-wider block">Nominator Information (Your Profile)</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Your Full Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Asha Lee"
                        value={formData.nominatorName}
                        onChange={e => setFormData({ ...formData, nominatorName: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Your Work Email <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        required
                        placeholder="esha@ytlpower.com"
                        value={formData.nominatorEmail}
                        onChange={e => setFormData({ ...formData, nominatorEmail: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Your Company / Business Unit <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. YTL Power, YTL Cement"
                        value={formData.nominatorCompany}
                        onChange={e => setFormData({ ...formData, nominatorCompany: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Relationship to Nominee <span className="text-red-500">*</span></label>
                      <select
                        required
                        value={formData.relationship}
                        onChange={e => setFormData({ ...formData, relationship: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                      >
                        <option value="">Select Professional Relationship</option>
                        <option value="Peer / colleague">Peer / colleague (Direct observation)</option>
                        <option value="Direct manager">Direct Manager / Supervisor</option>
                        <option value="HOD / Functional Head">HOD / Functional Head</option>
                        <option value="Cross-company collaborator">Cross-company collaborator</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* PART B: NOMINEE INFO */}
                <div className="bg-slate-50/80 border border-slate-200 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-2">
                    <span className="text-xs bg-indigo-600 text-white font-mono w-5 h-5 rounded-full flex items-center justify-center font-bold">B</span>
                    <h3 className="font-bold text-indigo-900 text-sm uppercase tracking-wider block">Nominee Information (Colleague You Are Nominating)</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Nominee Full Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="Their full official name"
                        value={formData.nomineeName}
                        onChange={e => setFormData({ ...formData, nomineeName: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Nominee Work Email</label>
                      <input
                        type="email"
                        placeholder="nominee@ytl.com.my"
                        value={formData.nomineeEmail}
                        onChange={e => setFormData({ ...formData, nomineeEmail: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Nominee Business Unit / Subsidiary <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. YTL Hotels, YTL Communications, YES"
                        value={formData.nomineeCompany}
                        onChange={e => setFormData({ ...formData, nomineeCompany: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Nominee Department / Function <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Operations, IT, Finance, Retail"
                        value={formData.nomineeDepartment}
                        onChange={e => setFormData({ ...formData, nomineeDepartment: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Designation / Job Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Executive, Senior RF Engineer"
                        value={formData.jobTitle}
                        onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Work Location / Country</label>
                      <input
                        type="text"
                        placeholder="e.g. Perak, Malaysia"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* PART C: AWARD CATEGORY & VALUES */}
                <div className="bg-slate-50/80 border border-slate-200 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-2">
                    <span className="text-xs bg-indigo-600 text-white font-mono w-5 h-5 rounded-full flex items-center justify-center font-bold">C</span>
                    <h3 className="font-bold text-indigo-900 text-sm uppercase tracking-wider block">Award Category & Specific Core Values</h3>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Target BTRT Award Category <span className="text-red-500">*</span></label>
                    <select
                      required
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-slate-800 text-sm font-medium focus:outline-none focus:border-indigo-500 transition-all"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">
                      Which YTL Core Values Were Demonstrated? (Select all that apply) <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {YTL_VALUES.map(val => {
                        const checked = formData.values.includes(val.name);
                        return (
                          <div
                            key={val.name}
                            onClick={() => handleToggleChecklist('values', val.name)}
                            className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                              formData.values.includes(val.name)
                                ? 'bg-indigo-50 border-indigo-400 text-slate-900'
                                : 'bg-white border-slate-200 hover:border-slate-350'
                            }`}
                            style={{ contentVisibility: 'auto' }}
                          >
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.values.includes(val.name)}
                                onChange={() => handleValueCheckbox(val.name)}
                                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 shrink-0"
                              />
                              <div>
                                <span className="text-sm font-bold block text-slate-900">{val.name}</span>
                                <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">{val.desc}</span>
                              </div>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* PART D: STAR FORMAT EVIDENCE */}
                <div className="bg-slate-50/80 border border-slate-200 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-2">
                    <span className="text-xs bg-indigo-600 text-white font-mono w-5 h-5 rounded-full flex items-center justify-center font-bold">D</span>
                    <h3 className="font-bold text-indigo-900 text-sm uppercase tracking-wider block">Evidence (Written S.T.A.R Blueprint)</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-700 block">S — Situation <span className="text-red-500">*</span></label>
                        <span className="text-[10px] text-slate-400 font-mono">Describe the trigger event or operational problem</span>
                      </div>
                      <textarea
                        required
                        rows={3}
                        placeholder="What environmental struggle, technical failure, or customer challenge did your nominee face?"
                        value={formData.situation}
                        onChange={e => setFormData({ ...formData, situation: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-700 block">T — Task <span className="text-red-500">*</span></label>
                        <span className="text-[10px] text-slate-400 font-mono">Explain what was expected or mandated</span>
                      </div>
                      <textarea
                        required
                        rows={2}
                        placeholder="What was the nominee responsible for accomplishing, or what window of time was strictly faced?"
                        value={formData.task}
                        onChange={e => setFormData({ ...formData, task: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-700 block">A — Action <span className="text-red-500">*</span></label>
                        <span className="text-[10px] text-indigo-700 font-bold">Most Important: What did they specifically do individually?</span>
                      </div>
                      <textarea
                        required
                        rows={4}
                        placeholder="Describe exact individual action, leadership, cross-company calls, or hard work. Differentiate them from default duties."
                        value={formData.action}
                        onChange={e => setFormData({ ...formData, action: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-700 block">R — Result / Impact <span className="text-red-500">*</span></label>
                        <span className="text-[10px] text-emerald-650 font-bold">Include tangible data, savings, or customer scores</span>
                      </div>
                      <textarea
                        required
                        rows={3}
                        placeholder="What happened? Offer specific numbers, SLAs saved, team output increases, or client feedback quotes."
                        value={formData.result}
                        onChange={e => setFormData({ ...formData, result: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Why do you believe this nominee specifically deserves Group-wide recognition? <span className="text-red-500">*</span></label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Summarize the core values demonstrated and explain the lasting cultural or business legacy they leave."
                        value={formData.worthiness}
                        onChange={e => setFormData({ ...formData, worthiness: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Optional Supporting URL or Evidence Reference Link</label>
                      <input
                        type="text"
                        placeholder="e.g. OneDrive link, shared appraisal, KPI report path, news URL"
                        value={formData.evidenceLink}
                        onChange={e => setFormData({ ...formData, evidenceLink: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* CONSENT AND SUBMIT */}
                <div className="space-y-4">
                  <div className="flex items-start gap-2.5">
                    <input
                      id="consent"
                      type="checkbox"
                      required
                      checked={formData.consent}
                      onChange={e => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-1 rounded text-indigo-650 focus:ring-indigo-500 h-4 w-4 shrink-0"
                    />
                    <label htmlFor="consent" className="text-xs text-slate-500 leading-normal font-medium cursor-pointer">
                      I confirm that all written statements and S.T.A.R details are honest representations of actual events, and can be fully verified by divisional HODs, auditors, and director-level judges.
                    </label>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
                    >
                      <Send className="w-4 h-4 text-indigo-200" />
                      <span>Submit Nomination</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Discard changes and clear form?')) {
                          setFormData({
                            nominatorName: '',
                            nominatorEmail: '',
                            nominatorCompany: '',
                            relationship: '',
                            nomineeName: '',
                            nomineeEmail: '',
                            nomineeCompany: '',
                            nomineeDepartment: '',
                            jobTitle: '',
                            location: '',
                            category: CATEGORIES[0],
                            values: [],
                            situation: '',
                            task: '',
                            action: '',
                            result: '',
                            worthiness: '',
                            evidenceLink: '',
                            consent: false
                          });
                        }
                      }}
                      className="border border-slate-200 text-slate-500 hover:bg-slate-50 px-5 py-3.5 rounded-xl font-semibold transition-all"
                    >
                      Reset Form
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </motion.div>
        )}

        {/* 3. HR / HOD REVIEW WORKSPACE TAB */}
        {activeTab === 'review' && reviewerUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* SEARCH AND FILTERS TOOLBAR */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-slate-500" />
                    <span>Active Review Operations</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Audit nominations, cross-verify metrics, update status, or mark finalist shortlist.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={loadDemoData}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-250 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reload 8 Demo Cases</span>
                  </button>
                  <button
                    onClick={clearAllData}
                    className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Storage</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search nominee, nominator, or ID"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium"
                  >
                    <option value="All">All Lifecycles</option>
                    <option value="Peer Submitted">Peer Submitted / New</option>
                    <option value="HR / HOD Review">HR / HOD Review</option>
                    <option value="More Info Needed">More Info Needed</option>
                    <option value="Director Endorsed">Director Endorsed</option>
                    <option value="Finalist">Finalist Shortlist</option>
                    <option value="Not Shortlisted">Not Shortlisted</option>
                  </select>
                </div>

                {/* Company Filter */}
                <div>
                  <select
                    value={companyFilter}
                    onChange={e => setCompanyFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium"
                  >
                    <option value="All">All Subsidiaries (YTL Power, etc.)</option>
                    {uniqueCompanies.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* NOMINATIONS CARD GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNominations.length === 0 ? (
                <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-bold text-lg text-slate-800">No Nominations Match Filters</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                    Try clearing search criteria or clicking "Reload Demo Data" to load realistic cases.
                  </p>
                </div>
              ) : (
                filteredNominations.map(nom => {
                  const statusColors: Record<string, string> = {
                    'Peer Submitted': 'bg-blue-50 text-blue-700 border-blue-200',
                    'HR / HOD Review': 'bg-yellow-50 text-yellow-700 border-yellow-250',
                    'More Info Needed': 'bg-orange-50 text-orange-700 border-orange-200',
                    'Director Endorsed': 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    'Finalist': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    'Not Shortlisted': 'bg-slate-100 text-slate-600 border-slate-250'
                  };
                  const average = getAverageScore(nom);

                  return (
                    <div
                      key={nom.id}
                      onClick={() => setSelectedNomination(nom)}
                      className="bg-white border hover:border-slate-350 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                      style={{ contentVisibility: 'auto' }}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-mono px-2 py-1 rounded font-semibold shrink-0">
                            ID: {nom.id}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${statusColors[nom.status] || 'bg-slate-50 text-slate-500'}`}>
                            {nom.status}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900 leading-snug text-base">{nom.nomineeName}</h3>
                          <span className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Building className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{nom.nomineeCompany} • {nom.nomineeDepartment}</span>
                          </span>
                        </div>

                        {/* STAR snippet preview */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                          <span className="text-[10px] text-slate-400 font-mono font-bold block mb-1">STAR CASE SYNOPSIS:</span>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            <strong>Result:</strong> {nom.result}
                          </p>
                        </div>

                        {/* values pills */}
                        <div className="flex flex-wrap gap-1">
                          {nom.values.map(val => (
                            <span key={val} className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold border border-indigo-100/60">
                              {val}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-slate-150 pt-3 mt-4 flex items-center justify-between text-xs text-slate-500">
                        <span>By {nom.nominatorName}</span>
                        {nom.status === 'Finalist' ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                            <span>{average.scale100 > 0 ? `${average.scale100.toFixed(1)}%` : 'No Scores'}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">Not Shortlisted</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}

        {/* 4. JUDGE SCORING SHEET TAB */}
        {activeTab === 'judge' && reviewerUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Judge session setup */}
            <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-md">
              <div className="max-w-2xl space-y-3">
                <span className="text-[10px] tracking-widest text-indigo-400 font-mono font-bold block uppercase animate-pulse-subtle">
                  ACTIVE DIRECTING JUDGE CREDENTIALS
                </span>
                <h2 className="text-2xl font-bold font-display text-slate-100">Director-Level Assessment Panel</h2>
                <p className="text-xs text-slate-350 leading-relaxed">
                  Toggle the current Active Judge name to score candidates independently. In production, 
                  this is bound securely via SSO/Active Directory. All scores dynamically generate the finalized ranks.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs text-slate-400 font-medium">Evaluate as:</span>
                  <select
                    value={activeJudge}
                    onChange={e => {
                      setActiveJudge(e.target.value);
                      triggerToast(`Switched active judge context to: ${e.target.value}`, 'info');
                    }}
                    className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-400"
                  >
                    <option value="Judge 01">Judge 01 (HOD Representative)</option>
                    <option value="Judge 02">Judge 02 (Independent Director)</option>
                    <option value="Judge 03 (Board Member)">Judge 03 (Board Member)</option>
                    <option value="Director of Human Capital">Director of Human Capital</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List of Finalists Eligible for Judging */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                Curated Finalist Shortlist ({nominations.filter(n => n.status === 'Finalist').length} Candidates)
              </h3>

              {nominations.filter(n => n.status === 'Finalist').length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
                  <Award className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <h4 className="font-bold text-[#142033]">No Finalists Selected Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-normal">
                    To test scoring, go to the <strong>Review Workspace</strong> and select a nomination. 
                    Mark its status as <strong>Finalist</strong> with director endorsement confirmed.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {nominations.filter(n => n.status === 'Finalist').map(nom => {
                    // Check if current active judge has already scored this nominee
                    const judgeMap = nom.scores || {};
                    const currentJudgeScore = judgeMap[activeJudge];
                    const average = getAverageScore(nom);

                    return (
                      <div key={nom.id} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm relative flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 font-mono px-2 py-0.5 rounded font-semibold uppercase">
                                FINALIST • {nom.id}
                              </span>
                              <h3 className="text-lg font-bold text-slate-900 mt-1">{nom.nomineeName}</h3>
                              <span className="text-xs text-slate-500 block">{nom.nomineeCompany} • {nom.nomineeDepartment}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block uppercase font-mono">Shortlist score:</span>
                              <span className="text-lg font-black text-emerald-700 block">
                                {average.count > 0 ? `${average.scale100.toFixed(1)}%` : '—'}
                              </span>
                              <span className="text-[9px] text-slate-400 block">{average.count} judge score(s)</span>
                            </div>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2 text-xs leading-relaxed text-slate-650">
                            <p><strong>Values Shown:</strong> {nom.values.join(', ')}</p>
                            <p className="line-clamp-3"><strong>Key S.T.A.R. Action:</strong> {nom.action}</p>
                            <p className="line-clamp-2"><strong>Tangible Result:</strong> {nom.result}</p>
                          </div>

                          {/* Interactive Score Form */}
                          <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100/60 space-y-4">
                            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-indigo-500 text-indigo-505 shrink-0" />
                              <span>Evaluation Matrix (Score 1-5)</span>
                            </h4>

                            <JudgeForm 
                              nomineeId={nom.id}
                              currentSubmission={currentJudgeScore}
                              onSubmitScore={handleSaveJudgeScore}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 5. LIVE RANKINGS AND LEADERBOARD TAB */}
        {activeTab === 'rankings' && reviewerUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="max-w-2xl mb-6">
                <span className="text-[10px] tracking-widest text-[#f59e0b] font-mono font-bold block uppercase">
                  REAL-TIME JUDGING SCORES
                </span>
                <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight">Finalist rankings & Leaderboard</h2>
                <p className="text-xs text-slate-500 leading-normal mt-1">
                  Candidates are ranked based on the average percentage scores assigned across all evaluating judges. 
                  In case of ties, final placements are determined during the closing Director board assembly.
                </p>
              </div>

              {rankedFinalists.length === 0 ? (
                <div className="text-center p-12 text-slate-500">
                  <Award className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <h4 className="font-bold text-[#142033]">Leaderboard is Currently Empty</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Shortlist nominees as <strong>Finalists</strong> and save a few judge scorecards to watch this registry activate.
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-inner">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm text-slate-700 min-w-[700px]">
                      <thead className="bg-slate-950 text-slate-100">
                        <tr>
                          <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-300 font-mono text-center w-16">Rank</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-300">Nominee & Subsidiary</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-300">Target Category</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-300">Highlighted Values</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-300 text-center w-36">Average Score</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-300 text-center w-28">Score Count</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {rankedFinalists.map((entry, index) => {
                          const medalColors = [
                            'bg-amber-100 text-amber-800 border-amber-300 font-extrabold shadow-sm',
                            'bg-slate-100 text-slate-800 border-slate-300 font-bold',
                            'bg-orange-100 text-orange-850 border-orange-250 font-bold'
                          ];

                          return (
                            <tr key={entry.nom.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="p-4 text-center">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border mx-auto ${medalColors[index] || 'bg-slate-50 text-slate-500'}`}>
                                  {index + 1}
                                </span>
                              </td>
                              <td className="p-4 font-semibold text-slate-900">
                                <div>{entry.nom.nomineeName}</div>
                                <span className="text-[10px] text-slate-500 font-mono tracking-tight block mt-0.5 uppercase">
                                  {entry.nom.nomineeCompany} • {entry.nom.id}
                                </span>
                              </td>
                              <td className="p-4 text-slate-650 text-xs">
                                {entry.nom.category}
                              </td>
                              <td className="p-4">
                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                  {entry.nom.values.map(v => (
                                    <span key={v} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                                      {v}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-4 text-center">
                                <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                                  {entry.score.count > 0 ? `${entry.score.scale100.toFixed(1)}%` : 'No Scores'}
                                </span>
                              </td>
                              <td className="p-4 text-center text-xs text-slate-400 font-medium font-mono">
                                {entry.score.count} record(s)
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 6. EXPORTS AND STATIC CODE CENTER DEPLOY TAB */}
        {activeTab === 'static-code' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
          >
            {/* Download Center */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Download className="text-cyan-500 w-5 h-5 shrink-0" />
                  <h3 className="font-bold text-slate-900 text-base">Static Asset Export</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Verify, download, or copy the final static files. You can drop these directly into your GitHub repository to replace the legacy prototype instantly!
                </p>
                <div className="space-y-2 pt-2">
                  <button
                    onClick={exportToCSV}
                    className="w-full bg-slate-900 text-white hover:bg-slate-800 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-400" />
                    <span>Download Excel / CSV Checklist</span>
                  </button>
                  <button
                    onClick={exportToJSON}
                    className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <FileJson className="w-4 h-4 text-cyan-400" />
                    <span>Download Raw JSON Schema</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 text-white rounded-2xl p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-bold text-xs uppercase tracking-widest text-indigo-400">How to deploy standalone</h3>
                </div>
                <ol className="text-xs space-y-2 text-slate-400 list-decimal pl-4 pt-1">
                  <li>Choose "Files list" in the sidebar and navigate to <code className="text-slate-200 bg-slate-900 px-1 py-0.5 rounded font-mono">/static-github-pages/</code></li>
                  <li>Copy and paste or write the files directly to replace your legacy <code className="text-slate-200 bg-slate-900 px-1 rounded font-mono">btrt-rubric</code> page on GitHub.</li>
                  <li>All actions instantly leverage <code className="text-slate-100 font-mono">localStorage</code> so no server database overhead remains.</li>
                </ol>
              </div>
            </div>

            {/* Static files preview */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 leading-tight">Standalone HTML Template Code</h3>
                <p className="text-xs text-slate-500 mt-1 leading-normal mb-3">
                  This contains responsive grid forms, and SSO passcode checkers completely offline. All logic operates securely on the browser.
                </p>
                
                <div className="relative">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(getStaticHTMLCode());
                      triggerToast('Standalone HTML code copied to clipboard!', 'success');
                    }}
                    className="absolute right-3 top-3 bg-slate-850 hover:bg-slate-800 text-slate-200 p-2 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 z-10 border border-slate-700 font-sans"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                  <pre className="bg-[#0f172a] text-slate-200 text-xs p-4 rounded-xl overflow-x-auto max-h-[300px] font-mono leading-relaxed border border-slate-800">
                    {getStaticHTMLCode()}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </main>

      {/* --- FLOATING DETAILED NOMINATION DRAWER / REVIEW OVERLAY --- */}
      <AnimatePresence>
        {selectedNomination && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNomination(null)}
              className="absolute inset-0 bg-slate-950 cursor-pointer"
            />

            {/* Slide over */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-150 flex justify-between items-start gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono tracking-widest block uppercase">
                    DETAILED LIFE-CYCLE ASSESSMENT SHEET
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 font-display mt-1">
                    {selectedNomination.nomineeName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedNomination.nomineeCompany} • {selectedNomination.nomineeDepartment} • {selectedNomination.jobTitle}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedNomination(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-500 p-2 rounded-full cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable details */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                
                {/* Lifespan badges */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Audit Status</label>
                    <select
                      value={selectedNomination.status}
                      onChange={e => handleUpdateStatus(selectedNomination.id, e.target.value as Nomination['status'])}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                    >
                      <option value="Peer Submitted">Peer Submitted</option>
                      <option value="HR / HOD Review">HR / HOD Review</option>
                      <option value="More Info Needed">More Info Needed</option>
                      <option value="Director Endorsed">Director Endorsed</option>
                      <option value="Finalist">Finalist</option>
                      <option value="Not Shortlisted">Not Shortlisted</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Director Endorsement</label>
                    <select
                      value={selectedNomination.directorApproval}
                      onChange={e => handleUpdateDirectorApproval(selectedNomination.id, e.target.value as Nomination['directorApproval'])}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                    >
                      <option value="Pending">Pending Validation</option>
                      <option value="Yes">Yes (Approved)</option>
                      <option value="No">No (Declined)</option>
                    </select>
                  </div>
                </div>

                {/* S.T.A.R full representation */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#1e3a8a] uppercase tracking-wider block border-b border-slate-150 pb-1">
                    S.T.A.R Narrative Evidence
                  </h4>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 80px' }}>
                      <span className="text-[10px] font-extrabold text-[#115e59] block uppercase mb-0.5">S — Situation:</span>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">{selectedNomination.situation}</p>
                    </div>

                    <div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 60px' }}>
                      <span className="text-[10px] font-extrabold text-[#115e59] block uppercase mb-0.5">T — Task:</span>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">{selectedNomination.task}</p>
                    </div>

                    <div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 120px' }}>
                      <span className="text-[10px] font-extrabold text-[#1e3a8a] block uppercase mb-0.5">A — Action Accomplished:</span>
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">{selectedNomination.action}</p>
                    </div>

                    <div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 80px' }}>
                      <span className="text-[10px] font-extrabold text-emerald-800 block uppercase mb-0.5">R — Result Case:</span>
                      <p className="text-xs text-slate-700 leading-relaxed font-bold">{selectedNomination.result}</p>
                    </div>
                  </div>
                </div>

                {/* Submission Profile details */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">NOMINATOR Profile</span>
                    <p className="font-bold text-slate-800 mt-1">{selectedNomination.nominatorName}</p>
                    <p className="text-slate-500">{selectedNomination.nominatorEmail}</p>
                    <p className="text-slate-500 mt-0.5">{selectedNomination.nominatorCompany} ({selectedNomination.relationship})</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">VETTING Checklist</span>
                    <div className="mt-2 space-y-1">
                      {[
                        { key: 'eligible', label: 'Eligible & clear of warnings' },
                        { key: 'strong_evidence', label: 'Measurable metric outputs' },
                        { key: 'vetted', label: 'HOD verified alignment' }
                      ].map(chk => {
                        const isChecked = (selectedNomination.checklistChecked || []).includes(chk.key);
                        return (
                          <div
                            key={chk.key}
                            onClick={() => handleToggleChecklist(selectedNomination.id, chk.key)}
                            className="flex items-center gap-1.5 cursor-pointer selection:bg-transparent"
                            style={{ contentVisibility: 'auto' }}
                          >
                            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                              isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300'
                            }`}>
                              {isChecked && <Check className="w-2.5 h-2.5 stroke-[4px]" />}
                            </span>
                            <span className={`text-[11px] font-medium leading-tight select-none ${isChecked ? 'text-slate-800' : 'text-slate-400'}`}>
                              {chk.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Internal notes and updates */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 block">Reviewer / HOD Vetting Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Provide internal insights or direct follow-up instructions..."
                    value={selectedNomination.internalNotes || ''}
                    onChange={e => handleUpdateInternalNotes(selectedNomination.id, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 leading-normal">
                    * Changes save in real-time. Unlocking status as <strong>"Finalist"</strong> instantly populates the judge-scoring board.
                  </p>
                </div>

              </div>

              {/* Action bar */}
              <div className="p-6 border-t border-slate-150 bg-slate-50 flex items-center gap-2">
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedNomination.id, 'Finalist');
                    setSelectedNomination(null);
                  }}
                  className="bg-emerald-650 hover:bg-emerald-700 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer"
                >
                  Confirm as Finalist Shortlist
                </button>
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedNomination.id, 'More Info Needed');
                    setSelectedNomination(null);
                  }}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  Request More Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MOCK SSO PASSCODE GATE MODAL --- */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-slate-950 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-w-sm w-full p-6 relative z-10 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="bg-slate-100 p-2.5 rounded-2xl text-slate-800">
                  <Lock className="w-5 h-5 shrink-0" />
                </div>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Passcode Verification</h3>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  In a real environment, this utilizes Microsoft Single Sign On (SSO). Use the demo key below to unlock.
                </p>
                <p className="text-xs bg-indigo-50/50 border border-indigo-100/60 p-2 rounded-xl text-slate-700 mt-2 font-mono justify-center flex">
                  Demo Passcode: <strong className="text-indigo-600 block pl-1">BTRT2026</strong>
                </p>
              </div>

              <form onSubmit={handlePasscodeLogin} className="space-y-3">
                <div>
                  <input
                    type="password"
                    placeholder="Enter passcode"
                    value={passcode}
                    onChange={e => setPasscode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-bold tracking-widest text-center focus:outline-none focus:border-indigo-500 transition-all"
                    autoFocus
                  />
                  {passcodeError && (
                    <span className="text-[11px] text-red-500 font-medium block mt-1 text-center">
                      {passcodeError}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow"
                >
                  <Unlock className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Verify Portal Unlock</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL AFTER NOMINATION SUBMITTED */}
      <AnimatePresence>
        {successReferenceId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSuccessReferenceId(null)}
              className="absolute inset-0 bg-slate-950 cursor-pointer text-white"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 relative z-10 text-center space-y-5"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-250 flex items-center justify-center mx-auto text-emerald-500">
                <CheckCircle2 className="w-6 h-6 stroke-[3px]" />
              </div>

              <div>
                <h3 className="text-xl font-bold font-display text-slate-900">Nomination Successfully Filed</h3>
                <p className="text-xs text-slate-500 mt-1 leading-normal max-w-xs mx-auto">
                  Thank you for celebrating your peer. HR and departmental heads have been notified to begin audit validation.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl max-w-sm mx-auto space-y-1">
                <span className="text-[10px] text-slate-400 font-mono tracking-widest block uppercase">Reference Receipt Code</span>
                <span className="text-2xl font-black text-[#1e3a8a] block tracking-wider font-mono">{successReferenceId}</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSuccessReferenceId(null)}
                  className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-2.5 rounded-xl text-xs font-bold block mx-auto cursor-pointer"
                >
                  Dismiss Receipt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white border-t border-slate-850 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap justify-between items-center gap-6">
          <div className="text-xs text-slate-500 text-left space-y-1">
            <p className="text-slate-400 font-bold">BTRT Awards Portal — A YTL Group Internal Recognition Mock</p>
            <p>Designed for desktop and mobile high-contrast screening. LocalStorage backed.</p>
          </div>
          <div className="text-xs text-slate-500 text-right font-mono">
            <span>Prototype Engine v5.1 — 2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

// --- SUB COMPONENT FOR INLINE JUDGE FORM ---
interface JudgeFormProps {
  nomineeId: string;
  currentSubmission?: {
    ratings: JudgeScore['ratings'];
    comments: string;
  };
  onSubmitScore: (id: string, ratings: JudgeScore['ratings'], comments: string) => void;
}

function JudgeForm({ nomineeId, currentSubmission, onSubmitScore }: JudgeFormProps) {
  const [ratings, setRatings] = useState({
    impact: 3,
    values: 3,
    initiative: 3,
    togetherness: 3,
    evidence: 3
  });
  
  const [comments, setComments] = useState('');

  // Sync state when submission or nominee changes
  useEffect(() => {
    if (currentSubmission) {
      setRatings(currentSubmission.ratings);
      setComments(currentSubmission.comments);
    } else {
      setRatings({
        impact: 3,
        values: 3,
        initiative: 3,
        togetherness: 3,
        evidence: 3
      });
      setComments('');
    }
  }, [currentSubmission, nomineeId]);

  const rawSum = ratings.impact + ratings.values + ratings.initiative + ratings.togetherness + ratings.evidence;
  const percentageScore = (rawSum / 25) * 100;

  const handleUpdateRating = (key: keyof typeof ratings, score: number) => {
    setRatings(prev => ({ ...prev, [key]: score }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitScore(nomineeId, ratings, comments);
  };

  const categoriesList = [
    { key: 'impact', label: 'Impact and Results', description: 'Measurable business efficiency, safety, or customer retention.' },
    { key: 'values', label: 'Demonstration of YTL Values', description: 'Strong, visible link to YTL Core foundations.' },
    { key: 'initiative', label: 'Initiative and Ownership', description: 'Whether they voluntarily went above standard duties on own accord.' },
    { key: 'togetherness', label: 'Collaboration / Togetherness', description: 'Involved or benefited other teams cleanly.' },
    { key: 'evidence', label: 'Story Strength and Evidence', description: 'How concrete, believable, and proven the case detail is.' }
  ] as const;

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="space-y-3">
        {categoriesList.map(item => (
          <div key={item.key} className="space-y-1 block" style={{ contentVisibility: 'auto' }}>
            <div className="flex justify-between items-center flex-wrap gap-1">
              <span className="text-xs font-bold text-slate-700">{item.label}</span>
              <span className="text-[9px] text-slate-500 max-w-[200px] leading-none block text-right">{item.description}</span>
            </div>

            <div className="flex items-center gap-1.5 pt-0.5">
              {[1, 2, 3, 4, 5].map(score => {
                const isSelected = ratings[item.key] >= score;
                return (
                  <button
                    key={score}
                    type="button"
                    onClick={() => handleUpdateRating(item.key, score)}
                    className="cursor-pointer p-1 rounded hover:bg-slate-100 transition-colors shrink-0"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        isSelected ? 'fill-amber-500 text-amber-500' : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="text-xs font-black text-slate-800 ml-2">{ratings[item.key]} / 5</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 block">
        <label className="text-xs font-bold text-slate-650 block mb-1">Judge Remarks / Evaluation Comments</label>
        <textarea
          rows={2}
          placeholder="Required: Provide the board justification rationale..."
          value={comments}
          onChange={e => setComments(e.target.value)}
          required
          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
        />
      </div>

      <div className="flex justify-between items-center pt-2">
        <div className="text-left leading-none font-mono">
          <span className="text-[10px] text-slate-400 block uppercase">Weighted Score:</span>
          <span className="text-base font-black text-slate-800">{percentageScore.toFixed(1)}%</span>
        </div>
        <button
          type="submit"
          className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <span>Save Score Card</span>
        </button>
      </div>
    </form>
  );
}
