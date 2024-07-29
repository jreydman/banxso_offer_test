export enum AuthStrategyEnum {
  anonymousOAuth = 'anonymous-auth',
  googleOAuth = 'google-oauth',
  githubOAuth = 'github-oauth',
  facebookOAuth = 'facebook-oauth',
  twitterOAuth = 'twitter-oauth',
  linkedinOAuth = 'linkedin-oauth',
  jwtAuth = 'jwt-auth',
  jwtRefresh = 'jwt-refresh',
}

export enum AuthProviderEnum {
  ANONYMOUS = 'ANONYMOUS',
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER',
  LINKEDIN = 'LINKEDIN',
  EMAIL = 'EMAIL',
}

export enum AuthStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
}
