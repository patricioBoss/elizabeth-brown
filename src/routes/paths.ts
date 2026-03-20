// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  ARTICLES: '/articles',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    login: '/login',
    register: '/register',
    resetPassword: '/reset-password',
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    home: `${ROOTS.DASHBOARD}/home`,
    leading: `${ROOTS.DASHBOARD}/leading`,
    profile: `${ROOTS.DASHBOARD}/profile`,
    realestate: `${ROOTS.DASHBOARD}/realestate`,
    wallet: `${ROOTS.DASHBOARD}/wallet`,
    withdrawal: `${ROOTS.DASHBOARD}/withdrawal`,
    invest: {
      all: `${ROOTS.DASHBOARD}/invest/all`,
      interest: `${ROOTS.DASHBOARD}/invest/interest`,
      pend: `${ROOTS.DASHBOARD}/invest/pend`,
    },
    portfolio: {
      root: `${ROOTS.DASHBOARD}/portfolio`,
      stock: (stock: string) => `${ROOTS.DASHBOARD}/portfolio/${stock}`,
    },
    referral: {
      commission: `${ROOTS.DASHBOARD}/referral/commission`,
      list: `${ROOTS.DASHBOARD}/referral/list`,
    },
  },
  // ADMIN
  admin: {
    root: ROOTS.ADMIN,
    home: `${ROOTS.ADMIN}/home`,
    fee: `${ROOTS.ADMIN}/fee`,
    invest: `${ROOTS.ADMIN}/invest`,
    mail: `${ROOTS.ADMIN}/mail`,
    withdrawal: `${ROOTS.ADMIN}/withdrawal`,
    login: `${ROOTS.ADMIN}/login`,
  },
  // ARTICLES
  articles: {
    slug: (slug: string) => `${ROOTS.ARTICLES}/${slug}`,
  },
  // PUBLIC PAGES
  about: '/about',
  faq: '/faq',
  invest: '/invest',
  stocks: '/stocks',
  cryptocurrency: '/cryptocurrency',
  resetPassword: '/reset-password',
  notFound: '/404',
};
