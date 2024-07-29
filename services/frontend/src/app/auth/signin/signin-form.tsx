'use client';

import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import Link from 'next/link';
import { Button } from 'src/shared/ui/components/chadcn/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'src/shared/ui/components/chadcn/ui/card';
import { Input } from 'src/shared/ui/components/chadcn/ui/input';
import { Label } from 'src/shared/ui/components/chadcn/ui/label';
import { z } from 'zod';
import { signinEmail } from '../actions';
import { SigninOAuthButtons } from '../oauth/oauth-signin';
import FieldInfo from '../ui/form-filed-info';

export default function SignupForm() {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      signinEmail(value);
    },
    // Add a validator to support Zod usage in Form and Field
    validatorAdapter: zodValidator(),
  });

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>SigninForm</CardTitle>
        <SigninOAuthButtons />
      </CardHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <CardContent>
          <div>
            <form.Field
              name="email"
              validators={{
                onChange: z.string().email(),
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: z.string().refine(
                  async (value) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return !value.includes('error');
                  },
                  { message: "No 'error' allowed in email" }
                ),
              }}
              children={(field) => {
                return (
                  <>
                    <Label htmlFor={field.name}>
                      Email:
                      <Input
                        type="email"
                        placeholder="example@host.co"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Label>
                    <FieldInfo field={field} />
                  </>
                );
              }}
            />
          </div>

          <div>
            <form.Field
              name="password"
              validators={{
                onChange: z.string().min(4),
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: z.string().refine(
                  async (value) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return !value.includes('error');
                  },
                  { message: "No 'error' allowed in password" }
                ),
              }}
              children={(field) => {
                return (
                  <>
                    <Label htmlFor={field.name}>
                      Password:
                      <Input
                        type="password"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Label>
                    <FieldInfo field={field} />
                  </>
                );
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col justify-center space-y-4">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button className="mx-auto" type="submit" disabled={!canSubmit}>
                {isSubmitting ? '...' : 'Submit'}
              </Button>
            )}
          />
          <CardDescription>
            Dont have account?
            <Link href={''}>
              <Button variant={'link'}>Signup</Button>
            </Link>
          </CardDescription>
        </CardFooter>
      </form>
    </Card>
  );
}
