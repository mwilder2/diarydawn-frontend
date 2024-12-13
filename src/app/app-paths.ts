export const paths = {
  home: 'home',
  project: 'project',
  login: 'login',
  register: 'register',
  resetPassword: 'reset-password',
  profile: 'profile',
  aboutContact: 'about-contact',
  bookshelf: 'bookshelf',
  pages: 'pages',
  oneOfYou: 'one-of-you',
  oneOfYouPublic: 'one-of-you-public',
  projectDiaryDawn: 'project-diary-dawn',
  projectCortexConnections: 'project-cortex-connections',
  projectSelection: 'projects-selection',
  tryChatGpt: 'try-chatgpt',
  pageNotFound: 'page-not-found',
  termsOfService: 'terms-of-service',
  privacyPolicy: 'privacy-policy'
} as const;  // Using `as const` to make all properties readonly and literal types

type AppPaths = typeof paths[keyof typeof paths];

export const whitelist = [
  'home',
  'login',
  'register',
  'reset-password',
  'about-contact',
  'page-not-found',
  'public',
  'end-session',
  'request-password-reset',
  'submit-password-reset-code',
  'refresh',
  'email-public-hero',
  'facebook-public-hero',
  'send-email',
  'public-hero',
  'terms-of-service',
  'project',
  'try-chatgpt',
  'project-diary-dawn',
  'project-cortex-connections',
  'projects-selection'
];