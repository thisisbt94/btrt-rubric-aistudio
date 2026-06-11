export interface Nomination {
  id: string;
  submittedAt: string;
  status: 'Peer Submitted' | 'HR / HOD Review' | 'More Info Needed' | 'Director Endorsed' | 'Finalist' | 'Not Shortlisted';
  directorApproval: 'Pending' | 'Yes' | 'No';
  category: string;
  nominatorName: string;
  nominatorEmail: string;
  nominatorCompany: string;
  relationship: string;
  nomineeName: string;
  nomineeEmail: string;
  nomineeCompany: string;
  nomineeDepartment: string;
  jobTitle: string;
  location: string;
  values: string[];
  situation: string;
  task: string;
  action: string;
  result: string;
  worthiness: string;
  evidenceLink: string;
  internalNotes?: string;
  checklistChecked?: string[]; // to save checklists
  scores?: Record<string, JudgeScore>; // judgeName -> credentials
}

export interface JudgeScore {
  judgeName: string;
  ratings: {
    impact: number;      // Impact and Results
    values: number;      // Demonstration of YTL Values
    initiative: number;  // Initiative and Ownership
    togetherness: number;// Collaboration / Togetherness
    evidence: number;    // Story Strength and Evidence
  };
  comments: string;
  updatedAt: string;
}

export const YTL_VALUES = [
  { name: 'Hard Work', desc: 'Persevering to achieve exceptional quality, staying resilient in challenges.' },
  { name: 'Honesty', desc: 'Being trustworthy, transparent, and holding high moral convictions.' },
  { name: 'Moral Responsibility', desc: 'Contributing positively to society, operating with absolute ethics.' },
  { name: 'Togetherness', desc: 'Synergising as one team, collaborating across departments cleanly.' },
  { name: 'Vitality', desc: 'Bringing proactive energy, pursuing innovation and new solutions.' }
];

export const CATEGORIES = [
  'BTRT Peak Performer of the Year',
  'YTL Core Values Ambassador',
  'Cross-boundary Collaboration Award',
  'Unsung Hero Recognition',
  'Rising Star (Outstanding New Joiner)'
];

export const INITIAL_DEMO_NOMINATIONS: Nomination[] = [
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
  },
  {
    id: 'BTRT-1022',
    submittedAt: '2026-05-24',
    status: 'Director Endorsed',
    directorApproval: 'Yes',
    category: 'Unsung Hero Recognition',
    nominatorName: 'Wei Jian Tan',
    nominatorEmail: 'weijian.tan@ytlpower.com',
    nominatorCompany: 'YTL PowerSeraya',
    relationship: 'Peer / colleague',
    nomineeName: 'Marcus Tan',
    nomineeEmail: 'marcus.tan@ytlpower.com',
    nomineeCompany: 'YTL PowerSeraya',
    nomineeDepartment: 'Digital Infrastructure',
    jobTitle: 'Senior Analyst / Dev',
    location: 'Singapore',
    values: ['Honesty', 'Hard Work'],
    situation: 'The primary executive reporting dashboard used during quarterly financial updates suffered critical database drift, resulting in mismatching numbers 2 hours before the board met.',
    task: 'Marcus was not assigned to this system, but realized the team Lead was stranded on travel leave and had to find the discrepancy fast.',
    action: 'He transparently notified the Chief Information Officer about the database mismatch, then worked tirelessly to audit and debug 4,000 lines of query code. He tracked the discrepancy to an unannounced external platform API patch.',
    result: 'He rewrote the connector module from scratch and refreshed the dashboard with 100% correct audit numbers just 15 minutes before the board session presentation began.',
    worthiness: 'He stepped up entirely on his own without seeking spotlight, worked under intense pressure, and acted with standard-setting honesty and courage.',
    evidenceLink: 'Git Commit Hash: seraya-dash-hotfix-3918a',
    internalNotes: 'Director of Digital Platforms confirmed this fix averted major reporting issue at executive level. Strongly endorsed.',
    checklistChecked: ['eligible', 'strong_evidence'],
    scores: {}
  },
  {
    id: 'BTRT-8941',
    submittedAt: '2026-05-28',
    status: 'HR / HOD Review',
    directorApproval: 'Pending',
    category: 'Rising Star (Outstanding New Joiner)',
    nominatorName: 'Mei Ling Robertson',
    nominatorEmail: 'm.robertson@wessexwater.co.uk',
    nominatorCompany: 'Wessex Water',
    relationship: 'HOD / Functional Head',
    nomineeName: 'Priya Raman',
    nomineeEmail: 'priya.raman@wessexwater.co.uk',
    nomineeCompany: 'Wessex Water',
    nomineeDepartment: 'Customer Experience',
    jobTitle: 'Customer Associate',
    location: 'Bath, United Kingdom',
    values: ['Togetherness', 'Honesty'],
    situation: 'A sudden billing migration error affected nearly 400 vulnerable water customers, sparking an influx of double-payment alerts and causing stress for the support staff.',
    task: 'Priya, having joined the company just three months prior, was assigned to handle standard incoming queries but wanted to do more.',
    action: 'She voluntarily set up a dedicated sub-channel, drafted a highly reassuring script detailing the exact technical cause, and paired with junior teammates to manage high-stress calls.',
    result: 'Every single affected account was credited and reassured within 36 hours. Priya personally handled 98 cases with zero escalations, earning pristine feedback metrics from elderly customers.',
    worthiness: 'Priya demonstrated maturity and collaboration far beyond her brief tenure. Her instincts to comfort and reassure vulnerable customers represent the best of YTL Hospitality principles.',
    evidenceLink: 'Wessex QA feedback summary, Week of May 25',
    internalNotes: 'We are currently verifying the feedback score sheet from the UK Customer Support division. Looks very promising.',
    checklistChecked: ['eligible']
  },
  {
    id: 'BTRT-4431',
    submittedAt: '2026-06-01',
    status: 'More Info Needed',
    directorApproval: 'Pending',
    category: 'Unsung Hero Recognition',
    nominatorName: 'Hannah Yeo',
    nominatorEmail: 'hannah.yeo@ytlland.com',
    nominatorCompany: 'YTL Land & Development',
    relationship: 'Peer / colleague',
    nomineeName: 'Ivan Koh',
    nomineeEmail: 'ivan.koh@ytlland.com',
    nomineeCompany: 'YTL Land & Development',
    nomineeDepartment: 'Sales Operations',
    jobTitle: 'Sales Gallery Executive',
    location: 'Kuala Lumpur, Malaysia',
    values: ['Vitality'],
    situation: 'The weekend launches of the Sentul project had a record-breaking surge of walk-in guests, leaving the greeting desks highly overwhelmed and congested.',
    task: 'Ivan needed to help organize visitors and support the property consultants.',
    action: 'He proactively coordinated queue signs and stayed past his shift hours to distribute water to waiting guests.',
    result: 'The event went by smoothly without serious visitor complaints, and the lead sheets were collected successfully.',
    worthiness: 'Ivan is always cheerful, displays high positive energy (Vitality) and is ready to work overtime whenever needed.',
    evidenceLink: '',
    internalNotes: 'HR Review Note: The narrative is highly commendable but needs specific, quantifiable output or concrete impact statistics to strengthen the case for finalist shortlisting. Contact nominator for more details.',
    checklistChecked: []
  },
  {
    id: 'BTRT-9080',
    submittedAt: '2026-06-02',
    status: 'Finalist',
    directorApproval: 'Yes',
    category: 'YTL Core Values Ambassador',
    nominatorName: 'Siti Aminah',
    nominatorEmail: 'siti.aminah@yes.my',
    nominatorCompany: 'YTL Communications',
    relationship: 'Direct manager',
    nomineeName: 'Arif Rahman',
    nomineeEmail: 'arif.rahman@yes.my',
    nomineeCompany: 'YTL Communications / YES 5G',
    nomineeDepartment: 'Network Optimization Group',
    jobTitle: 'Senior RF Engineer',
    location: 'Kuala Lumpur, Malaysia',
    values: ['Hard Work', 'Togetherness', 'Moral Responsibility'],
    situation: 'A national school infrastructure project was suffering from connection dips in remote learning centers in rural East Malaysia, jeopardizing 5G broadcast access for students.',
    task: 'Arif needed to diagnose the signal attenuation, which would typically require weeks of telemetry shipping and high-cost external consulting.',
    action: 'He designed a custom lightweight diagnostic software patch in his spare time, flew to the site at short notice, and spent 4 days travelling across mountainous terrains to manually install and calibrate the receivers.',
    result: 'He restored stable network signals to over 40 schools, providing seamless education access to more than 2,000 rural students, whilst saving the company over RM 65,000 in custom consulting fees.',
    worthiness: 'Arif demonstrated extraordinary dedication and moral responsibility to these children. His technical genius and tireless "Hard Work" deserve the highest group-level honors.',
    evidenceLink: 'YES 5G Rural Coverage KPI Logs, June 2026',
    internalNotes: 'Superb piece of work. The education impact and technical initiative are clear, verifiable, and highly laudable.',
    checklistChecked: ['eligible', 'strong_evidence', 'vetted'],
    scores: {
      'Judge 01': {
        judgeName: 'Judge 01',
        ratings: { impact: 5, values: 5, initiative: 5, togetherness: 4, evidence: 5 },
        comments: 'Excellent, life-changing social impact and high engineering efficiency. An absolute top-tier finalist.',
        updatedAt: '2026-06-08T15:30:00Z'
      }
    }
  },
  {
    id: 'BTRT-3129',
    submittedAt: '2026-06-05',
    status: 'Peer Submitted',
    directorApproval: 'Pending',
    category: 'YTL Core Values Ambassador',
    nominatorName: 'Joanne Chan',
    nominatorEmail: 'joanne.chan@ytlfoundation.org',
    nominatorCompany: 'YTL Foundation',
    relationship: 'Cross-company collaborator',
    nomineeName: 'Liew Kai Ming',
    nomineeEmail: 'kaiming.liew@ytlfoundation.org',
    nomineeCompany: 'YTL Foundation',
    nomineeDepartment: 'Community Programmes',
    jobTitle: 'Programme Coordinator',
    location: 'Selangor, Malaysia',
    values: ['Moral Responsibility', 'Togetherness'],
    situation: 'A mobile learning lab project experienced a sudden drop in weekend volunteer engagement, leading to potential cancellation of underprivileged youth tutoring.',
    task: 'Kai Ming wanted to stabilize tutoring attendance and build a highly resilient partnership framework with local universities.',
    action: 'He consolidated lists of volunteer university students, clarified responsibilities, and implemented a digital attendance incentive board.',
    result: 'Tutoring attendance stabilized, and 12 more volunteer slots were filled. On-ground volunteer coordination became smoother.',
    worthiness: 'Kai Ming works with total dedication, embodying our values of togetherness and caring for the community.',
    evidenceLink: ' tutortracker-incentive.xlsx',
    internalNotes: '',
    checklistChecked: []
  },
  {
    id: 'BTRT-2200',
    submittedAt: '2026-06-07',
    status: 'Not Shortlisted',
    directorApproval: 'No',
    category: 'Rising Star (Outstanding New Joiner)',
    nominatorName: 'Benjamin Lim',
    nominatorEmail: 'ben.lim@ytldatacentre.com',
    nominatorCompany: 'YTL Data Center',
    relationship: 'Peer / colleague',
    nomineeName: 'Grace Wong',
    nomineeEmail: 'grace.wong@ytldatacentre.com',
    nomineeCompany: 'YTL Data Center',
    nomineeDepartment: 'Administration',
    jobTitle: 'Office Assistant',
    location: 'Johor, Malaysia',
    values: ['Honesty'],
    situation: 'An old spreadsheet had several outdated vendor phone numbers and email contacts, causing team delays when querying.',
    task: 'Grace was asked to clean up and structure the operational sheet containing vendor lists.',
    action: 'She verified nearly 50 vendor details individually and re-logged them in a standardized, alphabetically sorted sheet.',
    result: 'The admin process is slightly cleaner, and everyone has access to the phone lists.',
    worthiness: 'Grace is extremely meticulous and honest. She completed the task ahead of schedule.',
    evidenceLink: 'Updated Contact Registry.xlsx',
    internalNotes: 'Highly useful work for the local DC admin team, but the scale of business impact is too small for Group-wide recognition. This has been noted on her positive assessment but marked as Not Shortlisted for this category.',
    checklistChecked: ['eligible']
  }
];
