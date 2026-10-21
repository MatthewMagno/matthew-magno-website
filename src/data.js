// All site copy lives here so it can be edited without touching layout.

export const profile = {
  name: 'Matthew Magno',
  email: 'matthewbmagno@gmail.com',
  location: 'San Francisco',
  linkedin: 'https://www.linkedin.com/in/matthewmagno/',
  github: 'https://github.com/MatthewMagno',
  resume: './Matthew_Magno_Resume.pdf',
};

export const apps = [
  {
    id: 'splitit',
    name: 'SplitIt',
    icon: './icons/splitit.png',
    color: '#0f6b66',
    status: 'In TestFlight',
    tagline: 'Split the costs of a trip or a dinner, then settle up in the fewest payments possible.',
    points: [
      'Native SwiftUI with no third-party packages.',
      'Four ways to split, including line by line from a receipt, with tax and tip shared in proportion.',
      'Ask Claude to log a receipt and it waits in the app, already matched to the people at your event.',
      'A review mode remembers what you checked and flags an expense if it changes afterwards.',
    ],
    facts: [
      { value: '4', label: 'ways to split' },
      { value: '2', label: 'currencies per event' },
    ],
    stack: ['Swift', 'SwiftUI', 'Cloudflare Workers', 'MCP'],
  },
  {
    id: 'memori',
    name: 'Memori',
    icon: './icons/memori.png',
    color: '#b8432a',
    status: 'On the App Store',
    tagline: 'A shared list of date ideas for two people, and a keepsake log of the dates you actually go on.',
    points: [
      'Shake your phone to pull a random idea when you’re both free.',
      'Pairs two phones and keeps the list and photo log in sync live.',
      'Shipped to the App Store and updated through version 1.7, with a share extension for saving ideas from anywhere.',
    ],
    facts: [
      { value: '1.7', label: 'current version' },
      { value: '790+', label: 'commits' },
    ],
    stack: ['React Native', 'Expo', 'Node.js', 'Fly.io'],
    link: { label: 'View on the App Store', href: 'https://apps.apple.com/us/app/memori-for-two/id6792543667' },
  },
  {
    id: 'reservations',
    name: 'Reservations',
    icon: './icons/reservations.png',
    color: '#1d1d1f',
    status: 'In App Store review',
    tagline: 'Flights, hotels, dinners and deliveries on one timeline, filled in from your confirmation emails.',
    points: [
      'Imports bookings through a custom MCP server: your own Claude account reads the confirmation emails and sends back only the booking details, so the app never asks for Gmail access.',
      'Checks every AI-imported booking on the server, matching confirmation codes, flight numbers and titles so nothing is added twice.',
      'Runs its own OAuth 2.1 sign-in server (PKCE, dynamic client registration), so the connector installs in Claude from a single URL.',
      'Taken from spec to App Store submission solo. I made the architecture, security and product calls and directed Claude Code on the implementation.',
    ],
    facts: [
      { value: '290+', label: 'automated tests' },
      { value: '0', label: 'Gmail permissions' },
    ],
    stack: ['React Native', 'TypeScript', 'Node.js', 'MCP', 'OAuth 2.1'],
  },
];

export const work = [
  {
    org: 'JPMorganChase',
    field: 'Software engineering',
    place: 'Palo Alto',
    tint: '#5e5ce6',
    roles: [
      {
        title: 'Software Engineer II',
        dates: 'Nov 2024 – now',
        points: [
          'Moved DocuSign document generation on the commercial real estate lending platform (DLx) off an outside integration and onto a service my team owns. That removed a duplicate prefill screen and cut licensing costs.',
          'Led the work that made loan-event processing 59.5% faster for large loans, using targeted database indexes and removing redundant reads and writes.',
          'Swapped nested-loop lookups for maps and sets, and batched one-at-a-time metadata queries into bulk calls.',
          'Scrum Master for the team, keeping engineering, product and compliance moving on the same sprint.',
        ],
      },
      {
        title: 'Software Engineer I',
        dates: 'Sep 2023 – Nov 2024',
        points: [
          'The firm’s main engineer and contact for Sealights, a test-analytics vendor: owned the integration, worked through vendor issues and helped teams adopt it.',
          'Built a scheduled job on the firm’s chaos engineering platform (Gremlin) that removes access for users inactive for over a year, cutting license costs.',
          'Co-chaired the Palo Alto new-graduate program, ran its $15,000 yearly budget and connected new hires with senior leadership.',
        ],
      },
    ],
  },
  {
    org: 'Wells Fargo',
    field: 'Software engineering',
    place: 'San Francisco',
    tint: '#ff453a',
    roles: [
      {
        title: 'Software Engineering Intern',
        dates: 'Summer 2022',
        points: [
          'Took over the front end of an internal website and added the component features it needed.',
          'Built the front end of a new chatbot backed by REST APIs that cut the time to find API release information by 85%.',
        ],
      },
    ],
  },
  {
    org: 'Tillamook',
    field: 'Project management',
    place: 'New York',
    tint: '#ff9f0a',
    roles: [
      {
        title: 'Project Management Intern',
        dates: 'Summer 2021',
        points: [
          'Built a SharePoint document repository for New Product Development that became the go-to resource for everyone in the group.',
          'Ran 30+ interviews across 19 product development departments to find and simplify project processes.',
          'Worked with R&D and outside vendors to standardize trial plans, reports and vendor briefs.',
          'Made an obsolescence tracking sheet so Supply Chain could follow discontinued products.',
        ],
      },
    ],
  },
  {
    org: 'The Chemours Company',
    field: 'Plant engineering',
    place: 'Belle, West Virginia',
    tint: '#30b0c7',
    roles: [
      {
        title: 'Mechanical Integrity Quality Assurance Engineer Intern',
        dates: 'Jan – May 2021',
        points: [
          'Built a database locating 3,000+ documents for the VAZO and glycolic acid facilities.',
          'Led biweekly meetings with plant engineers on hazard mitigation and incident reviews covering 530+ pieces of equipment.',
          'Made a hazardous substances matrix cross-referencing 100+ chemicals against human contact.',
        ],
      },
    ],
  },
  {
    org: 'Texas A&M University',
    field: 'Research',
    place: 'College Station',
    tint: '#8e2430',
    roles: [
      {
        title: 'Lead Undergraduate Research Assistant',
        team: 'Nutrition and Food Science',
        dates: '2020',
        points: [
          'Led weekly research meetings on how diet affected 17th-century European sailors, physically and mentally.',
          'Guided three colleagues on a paper submitted to The Mariner’s Mirror journal.',
          'Analyzed the nutritional content of salted meats to work out how healthy those sailors were.',
        ],
      },
      {
        title: 'Undergraduate Research Assistant',
        team: 'College of Engineering',
        dates: '2020',
        points: [
          'Researched biofuel alternatives made by fermenting organic material, contributing to MixAlco, a patented process for alcohol-based fuel.',
          'Adapted inoculum on plant biomass to measure acid production, and modeled particle distribution to estimate conversion efficiency.',
        ],
      },
      {
        title: 'Undergraduate Research Assistant',
        team: 'Nutrition and Food Science',
        dates: '2019',
        points: [
          'Used gas chromatography, DNA sequencing and Soxhlet extraction to measure bacteria and minerals in foods preserved with 17th-century methods.',
          'Ran the Institute of Nautical Archaeology’s blog, editing and publishing every article.',
          'Presented twice at Texas A&M’s Research Symposium. Named a Spring 2019 Aggie Research Scholar.',
        ],
      },
    ],
  },
  {
    org: 'ProGoes Probiotics',
    field: 'Marketing',
    place: 'College Station',
    tint: '#34c759',
    roles: [
      {
        title: 'Web Content Producer',
        dates: 'Aug 2019 – Jan 2020',
        points: [
          'The only undergraduate on the startup’s original team of four.',
          'Turned medical research papers into blog and ad articles, and ran photo and video for Instagram, Twitter and Facebook.',
          'Planned marketing to grow the company’s reach.',
        ],
      },
    ],
  },
];

// Every job as a span on the timeline, grouped by the kind of work. Months are 1–12.
export const fields = [
  { name: 'Software engineering', color: '#007aff', spans: [
    { org: 'Wells Fargo', from: [2022, 6], to: [2022, 8] },
    { org: 'JPMorganChase', from: [2023, 9], to: null },
  ] },
  { name: 'Research', color: '#af52de', spans: [
    { org: 'Texas A&M research labs', from: [2019, 1], to: [2020, 12] },
  ] },
  { name: 'Marketing', color: '#34c759', spans: [
    { org: 'ProGoes Probiotics', from: [2019, 8], to: [2020, 1] },
  ] },
  { name: 'Plant engineering', color: '#30b0c7', spans: [
    { org: 'Chemours', from: [2021, 1], to: [2021, 5] },
  ] },
  { name: 'Project management', color: '#ff9f0a', spans: [
    { org: 'Tillamook', from: [2021, 6], to: [2021, 8] },
  ] },
];

export const school = [
  {
    org: 'Texas A&M University',
    place: 'College Station',
    tint: '#8e2430',
    roles: [
      {
        title: 'B.S. Chemical Engineering',
        dates: 'Graduated Dec 2022',
        points: [],
      },
      {
        title: 'Historian, Philippine Student Association',
        dates: '2019 – 2020',
        points: [
          'Part of the team planning a $150,000 statewide collegiate competition for an expected 5,000+ attendees.',
        ],
      },
    ],
  },
  {
    org: 'Amazon Web Services',
    place: 'Certification',
    tint: '#ff9f0a',
    roles: [
      {
        title: 'AWS Certified Cloud Practitioner',
        dates: '',
        points: [],
      },
    ],
  },
];

export const toolbox = [
  { group: 'Languages', items: ['Java', 'TypeScript', 'JavaScript', 'Swift', 'Python', 'SQL'] },
  { group: 'Apps', items: ['React Native', 'Expo', 'SwiftUI', 'React'] },
  { group: 'Backend and data', items: ['Node.js', 'GraphQL', 'Kafka', 'Avro', 'Postgres'] },
  { group: 'Cloud', items: ['AWS', 'Cloudflare Workers', 'Fly.io'] },
  { group: 'AI', items: ['Model Context Protocol', 'OAuth 2.1', 'Claude Code', 'LLM tool integration'] },
];
