import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env.js';
import * as authService from '../services/auth.service.js';

export function configurePassport() {
  if (!env.google.enabled) {
    console.warn('Google OAuth disabled: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set');
    return passport;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.google.clientId,
        clientSecret: env.google.clientSecret,
        callbackURL: env.google.callbackUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await authService.findOrCreateOAuthUser({
            provider: 'google',
            providerId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value,
          });
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  return passport;
}