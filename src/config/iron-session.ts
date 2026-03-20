// Iron session configuration for App Router

const sessionOptions = {
  cookieName: 'auth_session',
  password: process.env.IRON_SESSION_PASSWORD || 'complex_password_at_least_32_characters_long',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: undefined,
  },
};

export default sessionOptions;
