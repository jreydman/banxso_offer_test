'use client';
import { Provider } from '@supabase/supabase-js';
import { Button } from 'src/shared/ui/components/chadcn/ui/button';
import { signinOAuth } from '../actions';

type OAuthProvider = {
  name: Provider;
  displayName: string;
  icon?: JSX.Element;
};

export function SigninOAuthButtons() {
  const oAuthProviders: OAuthProvider[] = [
    {
      name: 'github',
      displayName: 'GitHub',
      icon: <></>,
    },
    {
      name: 'google',
      displayName: 'Google',
      icon: <></>,
    },
  ];

  return (
    <>
      {oAuthProviders.map((provider) => (
        <Button
          key={provider.name}
          className="w-full flex items-center justify-center gap-2"
          onClick={async () => {
            await signinOAuth(provider.name);
          }}
        >
          {provider.icon}
          Login with {provider.displayName}
        </Button>
      ))}
    </>
  );
}
